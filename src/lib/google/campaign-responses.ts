import type { FormTemplate } from "@/lib/client-setup/templates";
import { getClientSetupSpreadsheetId } from "./auth";
import { appendRowByHeader, sheetsClient } from "./sheets";

export const RESPONSE_BASE_COLUMNS = [
  "Submission ID",
  "Submitted At",
  "Campaign",
  "Organization",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "UTM Content",
  "Status",
] as const;

/** Sheet tab titles can't contain []*?:/\ and are capped at 100 characters. */
export function responsesTabName(template: FormTemplate) {
  return `Responses - ${template.name}`.replace(/[[\]*?:/\\]/g, " ").slice(0, 100).trim();
}

export function responseColumnFor(field: FormTemplate["fields"][number]) {
  return field.column || field.label;
}

export async function appendCampaignResponse(template: FormTemplate, values: Record<string, string>) {
  const columns = [...RESPONSE_BASE_COLUMNS, ...template.fields.map(responseColumnFor)];
  await appendRowByHeader(responsesTabName(template), columns, values);
}

export type CampaignResponses = { tab: string; campaign: string; header: string[]; rows: Record<string, string>[] };

/** Read only: every "Responses - …" tab, newest responses first. */
export async function listCampaignResponses(): Promise<CampaignResponses[]> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties.title" });
  const tabs = (metadata.data.sheets ?? [])
    .map((sheet) => sheet.properties?.title ?? "")
    .filter((title) => title.startsWith("Responses - "));
  if (!tabs.length) return [];

  const result = await sheets.spreadsheets.values.batchGet({ spreadsheetId, ranges: tabs.map((tab) => `'${tab}'`) });
  return tabs.map((tab, index) => {
    const [header = [], ...rows] = (result.data.valueRanges?.[index]?.values ?? []) as string[][];
    return {
      tab,
      campaign: tab.replace(/^Responses - /, ""),
      header,
      rows: rows
        .filter((row) => row.some(Boolean))
        .map((row) => Object.fromEntries(header.map((column, i) => [column, String(row[i] ?? "")])))
        .sort((a, b) => (Date.parse(b["Submitted At"]) || 0) - (Date.parse(a["Submitted At"]) || 0)),
    };
  });
}
