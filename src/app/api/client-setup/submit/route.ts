import { NextResponse } from "next/server";
import { getCampaignConfig } from "@/lib/client-setup/campaigns";
import { unitWordFor } from "@/lib/client-setup/constants";
import { deriveStatus, markSetupLinkSubmitted } from "@/lib/client-setup/links-service";
import { getSetupLinkByToken } from "@/lib/google/setup-links";
import { buildSubmissionReference } from "@/lib/client-setup/reference";
import { clientSetupSubmissionSchema } from "@/lib/client-setup/schema";
import { GoogleConfigError } from "@/lib/google/auth";
import {
  appendSubmissionRow,
  ensureSheetHeaderExists,
  findSubmissionRowByReference,
} from "@/lib/google/sheets";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";

function yesNo(value: string) {
  return value === "yes" ? "Yes" : value === "no" ? "No" : value;
}

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);
  if (!checkRateLimit(`submit:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = clientSetupSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some information is missing or invalid.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (!data.token) return NextResponse.json({ error: "A valid setup link is required." }, { status: 403 });
  let campaign;
  let campaignName;
  try {
    const existing = await getSetupLinkByToken(data.token);
    if (!existing || ["Disabled", "Expired"].includes(deriveStatus(existing.link))) {
      return NextResponse.json({ error: "This link is no longer available." }, { status: 403 });
    }
    if (existing.link.templateJson) return NextResponse.json({ error: "Reload this link to use its selected template." }, { status: 400 });
    const base = getCampaignConfig(existing.link.campaignId);
    campaign = { ...base, businessName: existing.link.businessName, product: existing.link.product };
    campaignName = existing.link.campaignName.trim() || base.campaignName;
  } catch {
    return NextResponse.json({ error: "Could not verify your setup link. Please try again." }, { status: 503 });
  }
  const submissionId = buildSubmissionReference(campaign, data.clientDraftId);
  const unit = unitWordFor(campaign.product);

  try {
    const existingRow = await findSubmissionRowByReference(submissionId);
    if (existingRow) {
      return NextResponse.json({ submissionId, status: "already_submitted" });
    }
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      console.error("[client-setup/submit] Google not configured:", error.message);
      return NextResponse.json(
        { error: "Submission storage isn't configured yet. Please contact Kudziemuks." },
        { status: 503 },
      );
    }
    // A failed idempotency check shouldn't block submission outright — log and continue.
    console.error("[client-setup/submit] idempotency check failed:", error);
  }

  try {
    await ensureSheetHeaderExists();
  } catch (error) {
    console.error("[client-setup/submit] could not verify sheet header:", error);
  }

  const price = `$${data.product.priceAmount} per ${data.product.priceQuantity} ${unit}`;
  const minimumOrder = `${data.product.minimumOrder} ${unit}`;
  const bulkPricing =
    data.product.bulkPricing === "varies" ? data.product.bulkPricingDetails || "Varies" : "Same price";
  const specialOffer = data.product.hasSpecialOffer === "yes" ? data.product.offerDetails : "No";

  const paymentMethods = [
    ...data.delivery.paymentMethods,
    ...(data.delivery.paymentMethodOther ? [data.delivery.paymentMethodOther] : []),
  ].join(", ");

  const customerTypes = [
    ...data.customers.customerTypes,
    ...(data.customers.customerTypeOther ? [data.customers.customerTypeOther] : []),
  ].join(", ");

  const orderMethod =
    data.customers.orderMethod === "Other"
      ? data.customers.orderMethodOther || "Other"
      : data.customers.orderMethod;

  const platformsUsed = [
    ...data.marketing.platformsUsed,
    ...(data.marketing.platformOther ? [data.marketing.platformOther] : []),
  ].join(", ");

  const detailsJson = JSON.stringify({
    clientDraftId: data.clientDraftId,
    assets: data.assets,
  });

  const row: (string | number)[] = [
    submissionId,
    new Date().toISOString(),
    campaign.businessName,
    campaignName,
    campaign.product,
    data.contact.contactName,
    data.contact.contactWhatsapp,
    data.contact.customerWhatsapp,
    price,
    minimumOrder,
    bulkPricing,
    data.product.productDetails,
    specialOffer,
    data.delivery.deliveryOptions.join(", "),
    data.delivery.deliveryAreas,
    data.delivery.deliveryTime,
    paymentMethods,
    data.delivery.paymentNotes,
    customerTypes,
    orderMethod,
    data.customers.notes,
    yesNo(data.marketing.hasAdvertised),
    platformsUsed,
    data.marketing.whatWorkedWell,
    data.marketing.whatDidntWork,
    "",
    "New",
    detailsJson,
  ];

  try {
    await appendSubmissionRow(row);
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      console.error("[client-setup/submit] Google not configured:", error.message);
      return NextResponse.json(
        { error: "Submission storage isn't configured yet. Please contact Kudziemuks." },
        { status: 503 },
      );
    }

    console.error("[client-setup/submit] failed to save submission:", error);
    return NextResponse.json(
      { error: "We couldn't save your submission. Please try again." },
      { status: 502 },
    );
  }

  if (data.token) {
    try {
      await markSetupLinkSubmitted(data.token, submissionId);
    } catch (error) {
      // The submission itself already succeeded — a failure to update the
      // link's tracked status shouldn't fail the request.
      console.error("[client-setup/submit] could not mark setup link submitted:", error);
    }
  }

  return NextResponse.json({ submissionId, status: "created" });
}
