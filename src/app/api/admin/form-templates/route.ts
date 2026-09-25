import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { templateSchema } from "@/lib/client-setup/templates";
import { saveFormTemplate } from "@/lib/google/templates";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = templateSchema.safeParse({ ...body, id: `template-${randomUUID()}` });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid template." }, { status: 400 });
  if (JSON.stringify(parsed.data).length > 40000) return NextResponse.json({ error: "Template is too large." }, { status: 400 });
  try {
    await saveFormTemplate(parsed.data);
    return NextResponse.json({ template: parsed.data });
  } catch {
    return NextResponse.json({ error: "Could not save the template. Try again." }, { status: 502 });
  }
}
