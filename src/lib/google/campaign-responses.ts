import { BUILT_IN_TEMPLATES, type FormTemplate } from "@/lib/client-setup/templates";
import { getClientSetupSpreadsheetId } from "./auth";
import { appendRowByHeader, isMissingTabError, sheetsClient } from "./sheets";

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

/** One tab as header + rows, or null if the tab doesn't exist yet. */
async function readResponsesTab(tab: string): Promise<{ header: string[]; rows: Record<string, string>[] } | null> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  let values: string[][];
  try {
    const result = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${tab}'` });
    values = (result.data.values ?? []) as string[][];
  } catch (error) {
    if (isMissingTabError(error)) return null;
    throw error;
  }
  const [header = [], ...rows] = values;
  return {
    header,
    rows: rows
      .filter((row) => row.some(Boolean))
      .map((row) => Object.fromEntries(header.map((column, i) => [column, String(row[i] ?? "")])))
      .sort((a, b) => (Date.parse(b["Submitted At"]) || 0) - (Date.parse(a["Submitted At"]) || 0)),
  };
}

/**
 * Read only: responses for every public campaign template, newest first.
 * Templates live in code, so tab names are known up front and all tabs are
 * read in parallel — one round trip instead of a lookup followed by a read.
 */
export async function listCampaignResponses(): Promise<CampaignResponses[]> {
  const templates = BUILT_IN_TEMPLATES.filter((template) => template.kind === "public");
  const tabs = await Promise.all(templates.map((template) => readResponsesTab(responsesTabName(template))));
  return templates.flatMap((template, index) => {
    const tab = tabs[index];
    return tab ? [{ tab: responsesTabName(template), campaign: template.name, ...tab }] : [];
  });
}

/** Read only: one template's responses in a single sheet read; empty if the tab doesn't exist yet. */
export async function getCampaignResponses(template: FormTemplate): Promise<Record<string, string>[]> {
  const tab = await readResponsesTab(responsesTabName(template));
  return tab?.rows ?? [];
}
