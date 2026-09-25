import { randomBytes } from "node:crypto";
import { z } from "zod";
import { after, NextResponse } from "next/server";
import { appendRowByHeader } from "@/lib/google/sheets";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/whatsapp/notify";

export const runtime = "nodejs";

const TAB = "Work With Me";
const PLATFORMS = ["Website", "Facebook", "Instagram", "LinkedIn", "TikTok", "X"] as const;
const COLUMNS = [
  "Submission ID",
  "Submitted At",
  "Source",
  "Page",
  "Name",
  "Business Name",
  "WhatsApp",
  "What They Do",
  ...PLATFORMS,
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "Status",
] as const;

const text = (max: number) => z.string().trim().max(max);
const leadSchema = z.object({
  source: text(60).default("work-with-me"),
  page: text(200).default(""),
  name: text(120).min(1, "Enter your name."),
  businessName: text(160).min(1, "Enter your business name."),
  whatsapp: text(20).regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid WhatsApp number, e.g. +263 77 000 0000."),
  businessDescription: text(2000).min(1, "Tell me briefly what your business does."),
  onlineProfiles: z.array(z.object({ platform: z.enum(PLATFORMS), url: text(300) })).max(PLATFORMS.length).default([]),
  utm: z.object({ source: text(200), medium: text(200), campaign: text(200) }).partial().default({}),
  // Honeypot: hidden from people, often filled in by bots.
  website: z.string().max(500).optional().default(""),
});

export async function POST(request: Request) {
  if (!checkRateLimit(`work-with-me:${clientIpFrom(request.headers)}`, 5, 600000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check your details." }, { status: 400 });
  }
  const lead = parsed.data;
  const submissionId = `WM-${randomBytes(5).toString("hex").toUpperCase()}`;
  // Pretend success for bots so they don't retry.
  if (lead.website) return NextResponse.json({ submissionId });

  const values: Record<string, string> = {
    "Submission ID": submissionId,
    "Submitted At": new Date().toISOString(),
    Source: lead.source,
    Page: lead.page,
    Name: lead.name,
    "Business Name": lead.businessName,
    WhatsApp: lead.whatsapp,
    "What They Do": lead.businessDescription,
    "UTM Source": lead.utm.source ?? "",
    "UTM Medium": lead.utm.medium ?? "",
    "UTM Campaign": lead.utm.campaign ?? "",
    Status: "New",
  };
  for (const profile of lead.onlineProfiles) values[profile.platform] = profile.url;

  try {
    await appendRowByHeader(TAB, COLUMNS, values);
  } catch (error) {
    console.error("[work-with-me] could not save lead:", error);
    return NextResponse.json({ error: "Could not send your details. Please try again." }, { status: 502 });
  }

  // The lead is saved; a failed notification shouldn't fail the visitor's request.
  after(async () => {
    try {
      await notifyNewLead({
        name: lead.name,
        businessName: lead.businessName,
        whatsapp: lead.whatsapp,
        description: lead.businessDescription,
        source: lead.source,
      });
    } catch (error) {
      console.error("[work-with-me] WhatsApp notification failed:", error);
    }
  });

  return NextResponse.json({ submissionId });
}
