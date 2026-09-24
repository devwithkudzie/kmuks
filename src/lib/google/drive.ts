import { Readable } from "node:stream";
import { google } from "googleapis";
import { getClientSetupDriveRootFolderId, getGoogleAuth } from "./auth";

function driveClient() {
  return google.drive({ version: "v3", auth: getGoogleAuth() });
}

/**
 * Finds a folder by name under a parent, creating it if it doesn't exist.
 * Idempotent: safe to call repeatedly for the same client/campaign.
 */
export async function getOrCreateFolder(name: string, parentId: string): Promise<string> {
  const drive = driveClient();
  const safeName = name.replace(/'/g, "\\'");

  const existing = await drive.files.list({
    q: `'${parentId}' in parents and name = '${safeName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  const found = existing.data.files?.[0];
  if (found?.id) return found.id;

  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  if (!created.data.id) {
    throw new Error(`Failed to create Drive folder: ${name}`);
  }

  return created.data.id;
}

export function driveFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

export async function getCampaignRootFolderId(
  clientFolderName: string,
  campaignFolderName: string,
): Promise<string> {
  const rootId = getClientSetupDriveRootFolderId();
  const clientsRootId = await getOrCreateFolder("Kudziemuks Clients", rootId);
  const clientId = await getOrCreateFolder(clientFolderName, clientsRootId);
  return getOrCreateFolder(campaignFolderName, clientId);
}

export async function getCampaignFolderPath(
  clientFolderName: string,
  campaignFolderName: string,
  subFolderName: string,
): Promise<string> {
  const campaignId = await getCampaignRootFolderId(clientFolderName, campaignFolderName);
  return getOrCreateFolder(subFolderName, campaignId);
}

export type UploadedDriveFile = {
  fileId: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
};

/**
 * Uploads a file into a folder. Files are private by default (no public
 * permission is added) — only people with access to the shared Drive
 * folder/domain can open the link.
 */
export async function uploadFileToDrive(
  folderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<UploadedDriveFile> {
  const drive = driveClient();

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, name, size, webViewLink",
  });

  const fileId = response.data.id;
  if (!fileId) throw new Error("Drive upload did not return a file id.");

  return {
    fileId,
    url: response.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`,
    name: response.data.name ?? fileName,
    size: buffer.byteLength,
    mimeType,
  };
}

export function sanitizeFileName(name: string): string {
  const trimmed = name.trim().slice(0, 180);
  return trimmed.replace(/[^a-zA-Z0-9._\-\s()]/g, "_") || "file";
}
