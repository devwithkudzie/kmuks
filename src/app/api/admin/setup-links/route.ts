import { z } from "zod";
import { BUILT_IN_TEMPLATES } from "@/lib/client-setup/templates";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createNewSetupLink, listSetupLinkViews } from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await listSetupLinkViews();
    return NextResponse.json({ links });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      return NextResponse.json({ error: "Google Sheets isn't configured yet." }, { status: 503 });
    }
    console.error("[admin/setup-links] list failed:", error);
    return NextResponse.json({ error: "Could not load setup links." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = z.object({
    businessName: z.string().trim().min(1, "Enter an organization name.").max(120),
    product: z.string().trim().max(120).default(""),
    campaignName: z.string().trim().min(1, "Enter a campaign name.").max(120),
    templateId: z.string().min(1),
    expiresInHours: z.number().int().min(1).max(3650 * 24).optional(),
  }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { businessName, product, campaignName, templateId, expiresInHours } = parsed.data;

  try {
    const template = BUILT_IN_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return NextResponse.json({ error: "Select an available template." }, { status: 400 });
    if (!product && template.kind !== "public") return NextResponse.json({ error: "Enter a product or service." }, { status: 400 });
    const link = await createNewSetupLink(undefined, expiresInHours, campaignName, { businessName, product, template });
    return NextResponse.json({ link });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      return NextResponse.json({ error: "Google Sheets isn't configured yet." }, { status: 503 });
    }
    console.error("[admin/setup-links] create failed:", error);
    return NextResponse.json({ error: "Could not create the link." }, { status: 502 });
  }
}
