import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  deleteSetupLink,
  extendSetupLinkExpiry,
  regenerateSetupLink,
  setSetupLinkEnabled,
} from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const action = body.action;

  try {
    let link;
    if (action === "disable") {
      link = await setSetupLinkEnabled(token, false);
    } else if (action === "enable") {
      link = await setSetupLinkEnabled(token, true);
    } else if (action === "regenerate") {
      link = await regenerateSetupLink(token);
    } else if (action === "extend") {
      const hours = typeof body.hours === "number" && body.hours > 0 && body.hours <= 3650 * 24 ? body.hours : 7 * 24;
      link = await extendSetupLinkExpiry(token, hours);
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      return NextResponse.json({ error: "Google Sheets isn't configured yet." }, { status: 503 });
    }
    console.error("[admin/setup-links/token] update failed:", error);
    return NextResponse.json({ error: "Could not update the link." }, { status: 502 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  try {
    const deleted = await deleteSetupLink(token);
    if (!deleted) return NextResponse.json({ error: "Link not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      return NextResponse.json({ error: "Google Sheets isn't configured yet." }, { status: 503 });
    }
    console.error("[admin/setup-links/token] delete failed:", error);
    return NextResponse.json({ error: "Could not delete the link." }, { status: 502 });
  }
}
