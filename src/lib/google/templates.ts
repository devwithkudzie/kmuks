import { CONSTRUCTION_TEMPLATE, templateSchema, type FormTemplate } from "@/lib/client-setup/templates";
import { getClientSetupSpreadsheetId } from "./auth";
import { ensureSheetTabExists, sheetsClient } from "./sheets";

const TAB = "Form Templates";
export async function listFormTemplates(): Promise<FormTemplate[]> {
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties.title" });
  if (!metadata.data.sheets?.some((sheet) => sheet.properties?.title === TAB)) return [CONSTRUCTION_TEMPLATE];
  const result = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${TAB}'!A2:C` });
  return [CONSTRUCTION_TEMPLATE, ...(result.data.values ?? []).filter((row) => row[0]).map((row) => templateSchema.parse(JSON.parse(row[2])))];
}
export async function saveFormTemplate(template: FormTemplate) {
  await ensureSheetTabExists(TAB);
  const sheets = sheetsClient();
  const spreadsheetId = getClientSetupSpreadsheetId();
  await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${TAB}'!A1:C1`, valueInputOption: "RAW", requestBody: { values: [["Template ID", "Name", "Definition JSON"]] } });
  await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${TAB}'!A:C`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: [[template.id, template.name, JSON.stringify(template)]] } });
}
