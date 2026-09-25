import type { Metadata } from "next";
import { requireAdminOrRedirect } from "@/lib/admin/auth";
import { listCampaignResponses, RESPONSE_BASE_COLUMNS } from "@/lib/google/campaign-responses";
import { focusRing } from "@/components/client-setup/styles";
import { FREE_WEBSITE_TEMPLATE } from "@/lib/client-setup/templates";

export const metadata: Metadata = { title: "Admin · Campaign Responses" };
export const dynamic = "force-dynamic";

function submittedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value || "Unknown date" : new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Harare",
  }).format(date);
}

/** wa.me needs digits in international format; local numbers starting with 0 are assumed Zimbabwean. */
function whatsappLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${value.trim().startsWith("0") ? `263${digits.slice(1)}` : digits}`;
}

const HIDDEN_DETAIL_COLUMNS: readonly string[] = ["Submission ID", "Submitted At", "Campaign", "Organization", "Status"];

export default async function CampaignResponsesPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; source?: string }>;
}) {
  await requireAdminOrRedirect("/admin/responses");
  const { campaign = "", source = "" } = await searchParams;

  let campaigns: Awaited<ReturnType<typeof listCampaignResponses>> = [];
  let failed = false;
  try {
    campaigns = await listCampaignResponses();
  } catch (error) {
    console.error("[admin/responses] could not load responses:", error);
    failed = true;
  }

  const selected = campaigns.find((item) => item.campaign === campaign) ?? campaigns[0];
  const sources = [...new Set((selected?.rows ?? []).map((row) => row["UTM Source"] || "Direct"))].sort();
  const rows = (selected?.rows ?? []).filter((row) => !source || (row["UTM Source"] || "Direct") === source);
  const questionColumns = (selected?.header ?? []).filter((column) => !(RESPONSE_BASE_COLUMNS as readonly string[]).includes(column));
  const titleColumn = questionColumns.find((column) => /business name/i.test(column)) ?? questionColumns[0];
  const nameColumn = questionColumns.find((column) => /^(your )?name$/i.test(column));
  const whatsappColumn = questionColumns.find((column) => /^whatsapp( number)?$/i.test(column));
  const optInColumn = questionColumns.find((column) => /opt-?in|updates/i.test(column));

  const stats = [
    ["Applications", rows.length],
    ["Top source", sources.length ? [...sources].sort((a, b) =>
      rows.filter((row) => (row["UTM Source"] || "Direct") === b).length - rows.filter((row) => (row["UTM Source"] || "Direct") === a).length,
    )[0] : "—"],
    ...(optInColumn ? [["WhatsApp opt-ins", rows.filter((row) => row[optInColumn] === "Yes").length] as const] : []),
  ] as const;

  const selectClass = `mt-1 block rounded-md border border-white/10 bg-night px-3 py-2 ${focusRing}`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.24em] text-purple uppercase">Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Campaign Responses</h1>
          <p className="mt-3 text-sm text-mist">Applications from public campaign links, read from your Google Sheet.</p>
        </div>
        <a
          href={`/admin/client-setup?create=${FREE_WEBSITE_TEMPLATE.id}`}
          className={`inline-flex min-h-11 items-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focusRing}`}
        >
          + Create campaign link
        </a>
      </header>

      {failed ? (
        <div role="alert" className="mt-8 rounded-xl border border-purple/30 bg-purple/10 p-6">
          <p>Couldn’t load campaign responses. Check the Google Sheets connection and try again.</p>
          <a href="/admin/responses" className={`mt-4 inline-block text-sm text-purple ${focusRing}`}>Retry</a>
        </div>
      ) : !selected ? (
        <div className="mt-8 rounded-xl border border-white/10 p-8">
          <p className="text-mist">
            No applications yet. Create a public campaign link, share it, and applications will show up here.
          </p>
        </div>
      ) : (
        <>
          <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
            <label className="text-sm">Campaign
              <select name="campaign" defaultValue={selected.campaign} className={selectClass}>
                {campaigns.map((item) => <option key={item.tab} value={item.campaign}>{item.campaign}</option>)}
              </select>
            </label>
            <label className="text-sm">Source
              <select name="source" defaultValue={source} className={selectClass}>
                <option value="">All sources</option>
                {sources.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <button className={`rounded-md bg-purple px-4 py-2 text-sm ${focusRing}`}>Filter</button>
            {source ? <a href={`/admin/responses?campaign=${encodeURIComponent(selected.campaign)}`} className={`text-sm text-mist hover:text-fog ${focusRing}`}>Clear</a> : null}
          </form>

          <div className={`mt-8 grid gap-4 ${stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-mist">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Applications</h2>
            <a href={`/admin/responses?campaign=${encodeURIComponent(selected.campaign)}`} className={`text-sm text-purple ${focusRing}`}>Refresh</a>
          </div>
          <p className="mt-2 text-xs text-mist">Newest first. Times shown in Harare time. The full list is in the “{selected.tab}” tab of your sheet.</p>

          {rows.length === 0 ? (
            <p className="mt-6 rounded-xl border border-white/10 p-8 text-mist">No applications match this filter.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {rows.map((row, index) => {
                const chat = whatsappColumn ? whatsappLink(row[whatsappColumn]) : null;
                return (
                  <details key={`${row["Submission ID"]}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02]">
                    <summary className={`cursor-pointer p-5 ${focusRing}`}>
                      <span className="font-semibold">{(titleColumn && row[titleColumn]) || "Unnamed applicant"}</span>
                      <span className="ml-3 rounded-full bg-purple/10 px-3 py-1 text-xs text-purple">{row["UTM Source"] || "Direct"}</span>
                      <span className="mt-2 block text-sm text-mist">
                        {[nameColumn && row[nameColumn], row["Business Type"], row.Location].filter(Boolean).join(" · ")}
                      </span>
                      <span className="mt-2 block text-xs text-mist/70">{submittedAt(row["Submitted At"])}</span>
                    </summary>
                    <div className="border-t border-white/10 p-5">
                      {chat ? (
                        <a
                          href={chat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex min-h-10 items-center rounded-md bg-purple px-4 text-sm font-medium text-white transition hover:bg-violet ${focusRing}`}
                        >
                          Message on WhatsApp
                        </a>
                      ) : null}
                      <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {selected.header
                          .filter((column) => !HIDDEN_DETAIL_COLUMNS.includes(column) && (row[column] || questionColumns.includes(column)))
                          .map((column) => (
                            <div key={column} className="min-w-0">
                              <dt className="text-xs text-mist/70">{column}</dt>
                              <dd className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-fog">{row[column] || "—"}</dd>
                            </div>
                          ))}
                      </dl>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}
