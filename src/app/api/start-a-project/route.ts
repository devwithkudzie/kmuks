import { randomBytes } from "node:crypto";
import { z } from "zod";
import { after, NextResponse } from "next/server";
import { BUDGETS, TIMELINES } from "@/lib/enquiry";
import { packages } from "@/lib/content";
import { appendRowByHeader } from "@/lib/google/sheets";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/whatsapp/notify";

export const runtime = "nodejs";

const TAB = "Project Enquiries";
const COLUMNS = [
  "Submission ID",
  "Submitted At",
  "Name",
  "Work Email",
  "Phone / WhatsApp",
  "Company",
  "Interested In",
  "Goal",
  "Main Problem",
  "Current Tools",
  "Timeline",
  "Budget",
  "Page",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "Status",
] as const;

const text = (max: number) => z.string().trim().max(max);
const enquirySchema = z.object({
  name: text(120).min(1, "Enter your name."),
  email: text(200).email("Enter a valid work email."),
  phone: text(30).regex(/^$|^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number, e.g. +263 77 000 0000.").default(""),
  // Optional since the form was cut to the basics; older clients may still send them.
  company: text(160).default(""),
  solution: z.enum(["", "not-sure", ...packages.map((item) => item.slug)]).default(""),
  goal: text(2000).default(""),
  problem: text(2000).min(1, "Tell me a little about what you need."),
  tools: text(1000).default(""),
  timeline: z.enum(["", ...TIMELINES]).default(""),
  budget: z.enum(["", ...BUDGETS]).default(""),
  page: text(200).default(""),
  utm: z.object({ source: text(200), medium: text(200), campaign: text(200) }).partial().default({}),
  // Honeypot: hidden from people, often filled in by bots.
  website: z.string().max(500).optional().default(""),
});

export async function POST(request: Request) {
  if (!checkRateLimit(`start-a-project:${clientIpFrom(request.headers)}`, 5, 600000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
    );
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });
  }
  const enquiry = parsed.data;
  const submissionId = `PE-${randomBytes(5).toString("hex").toUpperCase()}`;
  // Pretend success for bots so they don't retry.
  if (enquiry.website) return NextResponse.json({ submissionId });

    const solutionTitle =
    packages.find((item) => item.slug === enquiry.solution)?.title ?? (enquiry.solution ? "Not sure yet" : "");
  const values: Record<string, string> = {
    "Submission ID": submissionId,
    "Submitted At": new Date().toISOString(),
    Name: enquiry.name,
    "Work Email": enquiry.email,
    "Phone / WhatsApp": enquiry.phone,
    Company: enquiry.company,
    "Interested In": solutionTitle,
    Goal: enquiry.goal,
    "Main Problem": enquiry.problem,
    "Current Tools": enquiry.tools,
    Timeline: enquiry.timeline,
    Budget: enquiry.budget,
    Page: enquiry.page,
    "UTM Source": enquiry.utm.source ?? "",
    "UTM Medium": enquiry.utm.medium ?? "",
    "UTM Campaign": enquiry.utm.campaign ?? "",
    Status: "New",
  };

  try {
    await appendRowByHeader(TAB, COLUMNS, values);
  } catch (error) {
    console.error("[start-a-project] could not save enquiry:", error);
    return NextResponse.json({ error: "Could not send your enquiry. Please try again." }, { status: 502 });
  }

  // The enquiry is saved; a failed notification shouldn't fail the visitor's request.
  after(async () => {
    try {
      await notifyNewLead({
        name: enquiry.name,
        // WhatsApp templates reject empty values.
        businessName: enquiry.company || "Not given",
        contact: [enquiry.email, enquiry.phone].filter(Boolean).join(" · "),
        description: [solutionTitle, enquiry.problem].filter(Boolean).join(" — "),
        source: "start-a-project",
      });
    } catch (error) {
      console.error("[start-a-project] WhatsApp notification failed:", error);
    }
  });

  return NextResponse.json({ submissionId });
}
