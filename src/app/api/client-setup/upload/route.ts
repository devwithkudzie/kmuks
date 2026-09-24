import { NextResponse } from "next/server";
import { getCampaignConfig } from "@/lib/client-setup/campaigns";
import {
  ALLOWED_MIME_TYPES,
  ASSET_CATEGORIES,
  fileSizeLimitFor,
  formatFileSize,
} from "@/lib/client-setup/constants";
import { GoogleConfigError } from "@/lib/google/auth";
import { getCampaignFolderPath, sanitizeFileName, uploadFileToDrive } from "@/lib/google/drive";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);
  if (!checkRateLimit(`upload:${ip}`, 40, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = formData.get("file");
  const campaignId = formData.get("campaignId");
  const categoryId = formData.get("category");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was received." }, { status: 400 });
  }
  if (typeof campaignId !== "string" || typeof categoryId !== "string") {
    return NextResponse.json({ error: "Missing campaign or category." }, { status: 400 });
  }

  const category = ASSET_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) {
    return NextResponse.json({ error: "Unknown upload category." }, { status: 400 });
  }

  const mimeKind = ALLOWED_MIME_TYPES[file.type];
  if (!mimeKind) {
    return NextResponse.json(
      { error: `That file type isn't supported for ${category.label}.` },
      { status: 415 },
    );
  }

  const sizeLimit = fileSizeLimitFor();
  if (file.size > sizeLimit) {
    return NextResponse.json(
      { error: `That file is too large. Maximum size is ${formatFileSize(sizeLimit)}.` },
      { status: 413 },
    );
  }

  const campaign = getCampaignConfig(campaignId);
  const safeName = sanitizeFileName(file.name);

  try {
    const folderId = await getCampaignFolderPath(
      campaign.driveClientFolder,
      campaign.driveCampaignFolder,
      category.driveFolder,
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadFileToDrive(folderId, safeName, file.type, buffer);

    return NextResponse.json({
      fileId: uploaded.fileId,
      url: uploaded.url,
      name: uploaded.name,
      size: uploaded.size,
      mimeType: uploaded.mimeType,
      category: category.id,
    });
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      console.error("[client-setup/upload] Google not configured:", error.message);
      return NextResponse.json(
        { error: "File storage isn't configured yet. Please contact Kudziemuks." },
        { status: 503 },
      );
    }

    console.error("[client-setup/upload] upload failed:", error);
    return NextResponse.json(
      { error: "The upload failed. Please try again." },
      { status: 502 },
    );
  }
}
