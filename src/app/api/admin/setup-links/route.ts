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

  const body = await request.json().catch(() => ({}));
  const campaignName = typeof body.campaignName === "string" ? body.campaignName.trim() : "";
  const expiresInDays =
    typeof body.expiresInDays === "number" && body.expiresInDays > 0 ? body.expiresInDays : undefined;

  if (!campaignName) {
    return NextResponse.json({ error: "Enter a campaign name." }, { status: 400 });
  }

  if (campaignName.length > 120) {
    return NextResponse.json({ error: "Campaign name must be 120 characters or fewer." }, { status: 400 });
  }

  try {
    const link = await createNewSetupLink(undefined, expiresInDays, campaignName);
    return NextResponse.json({ link });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      return NextResponse.json({ error: "Google Sheets isn't configured yet." }, { status: 503 });
    }
    console.error("[admin/setup-links] create failed:", error);
    return NextResponse.json({ error: "Could not create the link." }, { status: 502 });
  }
}
