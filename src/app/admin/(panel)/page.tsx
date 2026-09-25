import type { Metadata } from "next";
import { requireAdminOrRedirect } from "@/lib/admin/auth";
import { listSubmissions, SUBMISSION_COLUMNS, type SubmissionRecord } from "@/lib/google/sheets";
import { focusRing } from "@/components/client-setup/styles";

export const metadata: Metadata = { title: "Admin · Dashboard" };
export const dynamic = "force-dynamic";

function submittedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value || "Unknown date" : new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Harare",
  }).format(date);
}

type TemplateResponse = { id: string; label: string; section: string; value: string | string[] };

/** Template links store every answer in Details JSON; legacy submissions return null. */
function templateResponses(details: string): TemplateResponse[] | null {
  try {
    const parsed = JSON.parse(details);
    return Array.isArray(parsed?.responses) ? parsed.responses : null;
  } catch {
    return null;
  }
}

const detailColumns = SUBMISSION_COLUMNS.filter((column) => !["Details JSON", "Drive Folder URL"].includes(column));
// Identity and contact columns are filled for every template; the rest are construction-specific.
const baseColumns = detailColumns.slice(0, detailColumns.indexOf("Customer WhatsApp") + 1);

function recordDetails(record: SubmissionRecord) {
  const column = (name: (typeof detailColumns)[number]) => ({
    key: name,
    label: name,
    value: name === "Submitted At" ? submittedAt(record[name]) : record[name],
  });
  const responses = templateResponses(record["Details JSON"]);
  if (!responses) return detailColumns.map(column);
  return [
    ...baseColumns.map(column),
    ...responses.map((response) => ({
      key: response.id,
      label: response.label,
      value: Array.isArray(response.value) ? response.value.join(", ") : response.value,
    })),
  ];
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ organization?: string; campaign?: string }>;
}) {
  await requireAdminOrRedirect("/admin");
  const { organization = "", campaign = "" } = await searchParams;
  let records: Awaited<ReturnType<typeof listSubmissions>> = [];
  let failed = false;
  try {
    records = await listSubmissions();
  } catch (error) {
    console.error("[admin] could not load submissions:", error);
    failed = true;
  }
  const organizations = [...new Set(records.map((record) => record["Business Name"]).filter(Boolean))].sort();
  const campaigns = [...new Set(records
    .filter((record) => !organization || record["Business Name"] === organization)
    .map((record) => record.Campaign)
    .filter(Boolean))].sort();
  records = records.filter((record) =>
    (!organization || record["Business Name"] === organization) && (!campaign || record.Campaign === campaign));
  const stats = [
    ["Submissions", records.length],
    ["Businesses", new Set(records.map((record) => record["Business Name"]).filter(Boolean)).size],
    ["New submissions", records.filter((record) => record["Submission Status"].trim().toLowerCase() === "new").length],
  ] as const;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.24em] text-purple uppercase">Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-3 text-sm text-mist">Current client details from your submissions sheet.</p>
        </div>
      </header>
      {failed ? (
        <div role="alert" className="mt-8 rounded-xl border border-purple/30 bg-purple/10 p-6">
          <p>Couldn’t load the submissions sheet. Check the Google Sheets connection and try again.</p>
          <a href="/admin" className={`mt-4 inline-block text-sm text-purple ${focusRing}`}>Retry</a>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map(([label, count]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-mist">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{count}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Client records</h2>
            <a href="/admin" className={`text-sm text-purple ${focusRing}`}>Refresh records</a>
          </div>
          <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-sm">Organization
              <select name="organization" defaultValue={organization} className={`mt-1 block rounded-md border border-white/10 bg-night px-3 py-2 ${focusRing}`}>
                <option value="">All organizations</option>
                {organizations.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label className="text-sm">Campaign
              <select name="campaign" defaultValue={campaign} className={`mt-1 block rounded-md border border-white/10 bg-night px-3 py-2 ${focusRing}`}>
                <option value="">All campaigns</option>
                {campaigns.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <button className={`rounded-md bg-purple px-4 py-2 text-sm ${focusRing}`}>Filter</button>
            {(organization || campaign) && <a href="/admin" className={`text-sm text-mist hover:text-fog ${focusRing}`}>Clear</a>}
          </form>
          <p className="mt-2 text-xs text-mist">Newest first. Expand a record to view its details. Times shown in Harare time.</p>
          {records.length === 0 ? (
            <p className="mt-6 rounded-xl border border-white/10 p-8 text-mist">{organization || campaign ? "No submissions match these filters." : "No submissions yet. Create a client setup link to collect your first record."}</p>
          ) : (
            <div className="mt-6 space-y-3">
              {records.map((record, index) => (
                <details key={`${record["Submission ID"]}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02]">
                  <summary className={`cursor-pointer p-5 ${focusRing}`}>
                    <span className="font-semibold">{record["Business Name"] || "Unnamed business"}</span>
                    <span className="ml-3 rounded-full bg-purple/10 px-3 py-1 text-xs text-purple">{record["Submission Status"] || "Unspecified"}</span>
                    <span className="mt-2 block text-sm text-mist">{record.Campaign} · {record.Product}</span>
                    <span className="mt-2 block text-xs text-mist/70">{record["Contact Name"]} · {submittedAt(record["Submitted At"])}</span>
                  </summary>
                  <dl className="grid gap-6 border-t border-white/10 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recordDetails(record).map(({ key, label, value }) => (
                      <div key={key} className="min-w-0">
                        <dt className="text-xs text-mist/70">{label}</dt>
                        <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-fog">{value || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
