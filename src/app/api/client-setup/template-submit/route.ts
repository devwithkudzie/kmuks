import { createHash } from "node:crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { fillTokens, formatAnswer, isFieldVisible, parseStoredTemplate, validateAnswers } from "@/lib/client-setup/templates";
import { contactSchema } from "@/lib/client-setup/schema";
import { deriveStatus, markSetupLinkSubmitted } from "@/lib/client-setup/links-service";
import { getSetupLinkByToken } from "@/lib/google/setup-links";
import { appendSubmissionRow, ensureSheetHeaderExists, findSubmissionRowByReference, SUBMISSION_COLUMNS } from "@/lib/google/sheets";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

const submissionSchema = z.object({ token: z.string().min(1).max(200), clientDraftId: z.string().min(1).max(200), answers: z.unknown(), contact: contactSchema });
export async function POST(request: Request) {
  if (!checkRateLimit(`submit:${clientIpFrom(request.headers)}`, 10, 600000)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete your contact details and confirm your answers." }, { status: 400 });
  const data = parsed.data;
  try {
    const existing = await getSetupLinkByToken(data.token);
    if (!existing || ["Disabled", "Expired"].includes(deriveStatus(existing.link))) return NextResponse.json({ error: "This setup link is no longer available." }, { status: 403 });
    const link = existing.link;
    if (!link.templateJson) return NextResponse.json({ error: "This link uses the original setup form. Reload the page." }, { status: 400 });
    const template = parseStoredTemplate(link.templateJson);
    if (template.kind === "public") return NextResponse.json({ error: "Reload this link to apply." }, { status: 400 });
    const checked = validateAnswers(template, data.answers);
    if (Object.keys(checked.errors).length) return NextResponse.json({ error: "Please check your answers.", fieldErrors: checked.errors }, { status: 400 });
    // A token identifies one client campaign; retries keep the same reference.
    const submissionId = `KH-${createHash("sha256").update(data.token).digest("hex").slice(0, 20).toUpperCase()}`;
    await ensureSheetHeaderExists();
    if (await findSubmissionRowByReference(submissionId)) {
      await markSetupLinkSubmitted(data.token, submissionId);
      return NextResponse.json({ submissionId });
    }
    const values: Record<string, string> = {
      "Submission ID": submissionId, "Submitted At": new Date().toISOString(),
      "Business Name": link.businessName, Campaign: link.campaignName, Product: link.product,
      "Contact Name": data.contact.contactName, "Contact WhatsApp": data.contact.contactWhatsapp,
      "Customer WhatsApp": data.contact.customerWhatsapp, "Submission Status": "New",
      "Details JSON": JSON.stringify({ templateId: template.id, templateName: template.name, campaignId: link.campaignId, clientDraftId: data.clientDraftId,
        responses: template.fields
          .filter((field) => isFieldVisible(template, field, checked.answers))
          .map((field) => ({ id: field.id, label: fillTokens(field.label, field, link.product), section: field.section, value: formatAnswer(field, checked.answers[field.id], link.product) })),
      }),
    };
    if (values["Details JSON"].length > 45000) return NextResponse.json({ error: "Your answers are too long. Please shorten them before submitting." }, { status: 400 });
    const columns: Record<string, string> = { price: "Price", minimum_order: "Minimum Order", bulk_pricing: "Bulk Pricing", product_details: "Product Details", special_offer: "Special Offer", delivery_options: "Delivery Options", delivery_areas: "Delivery Areas", delivery_time: "Delivery Time", payment_methods: "Payment Methods", payment_notes: "Payment Notes", customer_types: "Customer Types", order_method: "Order Method", customer_notes: "Customer Notes", previously_advertised: "Previously Advertised", platforms_used: "Platforms Used", what_worked: "What Worked Well", what_didnt_work: "What Didn't Work" };
    for (const [id, column] of Object.entries(columns)) {
      const field = template.fields.find((item) => item.id === id);
      if (!field) { values[column] = ""; continue; }
      const answer = formatAnswer(field, checked.answers[id], link.product);
      // Follow-ups without their own column ("Other payment method", "Offer details") fold into
      // their parent, matching the original form: lists gain the extra entry, a single choice is replaced.
      const followUps = template.fields
        .filter((item) => item.showIf?.field === id && !(item.id in columns))
        .map((item) => formatAnswer(item, checked.answers[item.id], link.product))
        .filter(Boolean);
      if (!followUps.length) values[column] = answer;
      else if (Array.isArray(checked.answers[id])) values[column] = [answer, ...followUps].filter(Boolean).join(", ");
      else values[column] = followUps.join(", ");
    }
    await appendSubmissionRow(SUBMISSION_COLUMNS.map((column) => values[column] ?? ""));
    try { await markSetupLinkSubmitted(data.token, submissionId); } catch { console.error("[template-submit] Saved submission but could not update link status."); }
    return NextResponse.json({ submissionId });
  } catch {
    console.error("[template-submit] Could not read or save submission.");
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 502 });
  }
}
