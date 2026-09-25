import { google } from "googleapis";
import { getClientSetupSpreadsheetId, getGoogleAuth } from "./auth";

const SHEET_NAME = "Client Submissions";

export const SUBMISSION_COLUMNS = [
  "Submission ID",
  "Submitted At",
  "Business Name",
  "Campaign",
  "Product",
  "Contact Name",
  "Contact WhatsApp",
  "Customer WhatsApp",
  "Price",
  "Minimum Order",
  "Bulk Pricing",
  "Product Details",
  "Special Offer",
  "Delivery Options",
  "Delivery Areas",
  "Delivery Time",
  "Payment Methods",
  "Payment Notes",
  "Customer Types",
  "Order Method",
  "Customer Notes",
  "Previously Advertised",
  "Platforms Used",
  "What Worked Well",
  "What Didn't Work",
  "Drive Folder URL",
  "Submission Status",
  "Details JSON",
] as const;

export function sheetsClient() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

/**
 * Creates a tab with the given name if the spreadsheet doesn't already have
 * one — a fresh spreadsheet only has a default "Sheet1", so the first real
 * write would otherwise fail with a "Unable to parse range" error.
 */
export async function ensureSheetTabExists(sheetName: string): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const tabExists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );
  if (tabExists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: sheetName } } }],
    },
  });
}

export async function ensureSheetHeaderExists(): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  await ensureSheetTabExists(SHEET_NAME);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:A1`,
  });

  if (existing.data.values?.length) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [[...SUBMISSION_COLUMNS]] },
  });
}

export async function findSubmissionRowByReference(
  submissionId: string,
): Promise<number | null> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
  });

  const rows = result.data.values ?? [];
  const index = rows.findIndex((row) => row[0] === submissionId);
  return index === -1 ? null : index + 1;
}

export async function appendSubmissionRow(row: (string | number)[]): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

export type SubmissionRecord = Record<(typeof SUBMISSION_COLUMNS)[number], string>;

/** Read only: an unused spreadsheet is an empty dashboard, not a new tab. */
export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  if (!spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === SHEET_NAME)) {
    return [];
  }
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${SHEET_NAME}'!A:AB`,
    valueRenderOption: "FORMATTED_VALUE",
  });
  const [headers = [], ...rows] = result.data.values ?? [];
  const indexes = SUBMISSION_COLUMNS.map((column) => headers.indexOf(column));
  if (indexes.some((index) => index === -1)) {
    throw new Error("Client Submissions sheet headers do not match the expected columns.");
  }
  return rows
    .filter((row) => row[indexes[0]])
    .map((row) => Object.fromEntries(
      SUBMISSION_COLUMNS.map((column, index) => [column, String(row[indexes[index]] ?? "")]),
    ) as SubmissionRecord)
    .sort((a, b) => (Date.parse(b["Submitted At"]) || 0) - (Date.parse(a["Submitted At"]) || 0));
}

/**
 * Appends one row to `tab`, creating the tab if needed. Values are matched to
 * columns by header name; any wanted column the tab doesn't have yet is added
 * at the end, so existing rows stay aligned.
 */
export async function appendRowByHeader(
  tab: string,
  columns: readonly string[],
  values: Record<string, string>,
): Promise<void> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  await ensureSheetTabExists(tab);

  const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${tab}'!1:1` });
  const header = ((existing.data.values?.[0] ?? []) as unknown[]).map(String);
  const missing = columns.filter((column) => !header.includes(column));
  if (missing.length) {
    header.push(...missing);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tab}'!1:1`,
      valueInputOption: "RAW",
      requestBody: { values: [header] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${tab}'!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [header.map((column) => values[column] ?? "")] },
  });
}
