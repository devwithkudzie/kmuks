import { randomBytes } from "node:crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { deriveStatus } from "@/lib/client-setup/links-service";
import { formatAnswer, isFieldVisible, parseStoredTemplate, validateAnswers } from "@/lib/client-setup/templates";
import { appendCampaignResponse, responseColumnFor } from "@/lib/google/campaign-responses";
import { getSetupLinkByToken } from "@/lib/google/setup-links";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";

const utmValue = z.string().trim().max(200).optional().default("");
const submissionSchema = z.object({
  token: z.string().min(1).max(200),
  answers: z.unknown(),
  utm: z.object({ source: utmValue, medium: utmValue, campaign: utmValue, content: utmValue }).default({
    source: "", medium: "", campaign: "", content: "",
  }),
  // Honeypot: hidden from people, often filled in by bots.
  website: z.string().max(500).optional().default(""),
});

export async function POST(request: Request) {
  if (!checkRateLimit(`campaign:${clientIpFrom(request.headers)}`, 5, 600000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }
  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your answers and try again." }, { status: 400 });
  const data = parsed.data;
  const submissionId = `KA-${randomBytes(5).toString("hex").toUpperCase()}`;
  // Pretend success for bots so they don't retry.
  if (data.website) return NextResponse.json({ submissionId });

  try {
    const existing = await getSetupLinkByToken(data.token);
    if (!existing || ["Disabled", "Expired"].includes(deriveStatus(existing.link))) {
      return NextResponse.json({ error: "This campaign is no longer accepting applications." }, { status: 403 });
    }
    const link = existing.link;
    const template = link.templateJson ? parseStoredTemplate(link.templateJson) : null;
    if (!template || template.kind !== "public") {
      return NextResponse.json({ error: "This link isn't a public campaign." }, { status: 400 });
    }
    const checked = validateAnswers(template, data.answers);
    if (Object.keys(checked.errors).length) {
      return NextResponse.json({ error: "Please check your answers.", fieldErrors: checked.errors }, { status: 400 });
    }

    const values: Record<string, string> = {
      "Submission ID": submissionId,
      "Submitted At": new Date().toISOString(),
      Campaign: link.campaignName,
      Organization: link.businessName,
      "UTM Source": data.utm.source,
      "UTM Medium": data.utm.medium,
      "UTM Campaign": data.utm.campaign,
      "UTM Content": data.utm.content,
      Status: "New",
    };
    for (const field of template.fields) {
      if (!isFieldVisible(template, field, checked.answers)) continue;
      values[responseColumnFor(field)] = formatAnswer(field, checked.answers[field.id], link.product);
    }
    await appendCampaignResponse(template, values);
    return NextResponse.json({ submissionId });
  } catch (error) {
    console.error("[campaigns/submit] could not save response:", error);
    return NextResponse.json({ error: "Could not send your application. Please try again." }, { status: 502 });
  }
}
