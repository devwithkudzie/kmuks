import { getClientSetupSpreadsheetId } from "./auth";
import { ensureSheetTabExists, sheetsClient } from "./sheets";

const SHEET_NAME = "Client Setup Links";

export const SETUP_LINK_COLUMNS = [
  "Token",
  "Campaign ID",
  "Business Name",
  "Product",
  "Status",
  "Created At",
  "Expires At",
  "Opened At",
  "Submitted At",
  "Submission ID",
  "Campaign Name",
] as const;

export type SetupLinkRow = {
  token: string;
  campaignId: string;
  businessName: string;
  product: string;
  status: "Active" | "Disabled";
  createdAt: string;
  expiresAt: string;
  openedAt: string;
  submittedAt: string;
  submissionId: string;
  campaignName: string;
};

function rowToLink(row: string[]): SetupLinkRow {
  return {
    token: row[0] ?? "",
    campaignId: row[1] ?? "",
    businessName: row[2] ?? "",
    product: row[3] ?? "",
    status: row[4] === "Disabled" ? "Disabled" : "Active",
    createdAt: row[5] ?? "",
    expiresAt: row[6] ?? "",
    openedAt: row[7] ?? "",
    submittedAt: row[8] ?? "",
    submissionId: row[9] ?? "",
    campaignName: row[10] ?? "",
  };
}

function linkToRow(link: SetupLinkRow): string[] {
  return [
    link.token,
    link.campaignId,
    link.businessName,
    link.product,
    link.status,
    link.createdAt,
    link.expiresAt,
    link.openedAt,
    link.submittedAt,
    link.submissionId,
    link.campaignName,
  ];
}

export async function ensureSetupLinksHeaderExists(): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  await ensureSheetTabExists(SHEET_NAME);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:K1`,
  });

  const header = (existing.data.values?.[0] ?? []) as string[];
  if (!header.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...SETUP_LINK_COLUMNS]] },
    });
    return;
  }

  if (header[10] !== "Campaign Name") {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!K1`,
      valueInputOption: "RAW",
      requestBody: { values: [["Campaign Name"]] },
    });
  }
}

export async function listSetupLinks(): Promise<SetupLinkRow[]> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:K`,
  });

  return (result.data.values ?? []).map((row) => rowToLink(row as string[]));
}

export async function getSetupLinkByToken(token: string): Promise<{
  link: SetupLinkRow;
  rowNumber: number;
} | null> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:K`,
  });

  const rows = result.data.values ?? [];
  const index = rows.findIndex((row) => row[0] === token);
  if (index === -1) return null;

  return { link: rowToLink(rows[index] as string[]), rowNumber: index + 2 };
}

export async function createSetupLink(link: SetupLinkRow): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [linkToRow(link)] },
  });
}

export async function updateSetupLinkRow(
  rowNumber: number,
  link: SetupLinkRow,
): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A${rowNumber}:K${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [linkToRow(link)] },
  });
}
