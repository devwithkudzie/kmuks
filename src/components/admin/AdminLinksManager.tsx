"use client";

import { useState } from "react";
import type { SetupLinkView } from "@/lib/client-setup/links-service";
import { fieldClass, focusRing, labelClass } from "@/components/client-setup/styles";

function statusClass(status: SetupLinkView["derivedStatus"]) {
  switch (status) {
    case "Submitted":
      return "text-purple";
    case "In Progress":
      return "text-fog";
    case "Disabled":
    case "Expired":
      return "text-mist/50";
    default:
      return "text-mist";
  }
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminLinksManager({
  initialLinks,
  baseUrl,
}: {
  initialLinks: SetupLinkView[];
  baseUrl: string;
}) {
  const setupUrl = (token: string) => new URL(`/client/setup/${encodeURIComponent(token)}`, baseUrl).href;
  const [links, setLinks] = useState(initialLinks);
  const [campaignName, setCampaignName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>();
  const [busyToken, setBusyToken] = useState<string>();
  const [copiedToken, setCopiedToken] = useState<string>();

  const handleCreate = async () => {
    setCreating(true);
    setError(undefined);
    try {
      const response = await fetch("/api/admin/setup-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: campaignName.trim(),
          expiresInDays: expiresInDays ? Number(expiresInDays) : undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not create the link.");
      setLinks((prev) => [body.link, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the link.");
    } finally {
      setCreating(false);
    }
  };

  const runAction = async (token: string, action: string, extra?: Record<string, unknown>) => {
    setBusyToken(token);
    setError(undefined);
    try {
      const response = await fetch(`/api/admin/setup-links/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not update the link.");

      setLinks((prev) => {
        if (action === "regenerate") {
          return [
            body.link,
            ...prev.map((link) => (link.token === token ? { ...link, derivedStatus: "Disabled" as const, status: "Disabled" as const } : link)),
          ];
        }
        return prev.map((link) => (link.token === token ? body.link : link));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the link.");
    } finally {
      setBusyToken(undefined);
    }
  };

  const copyLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(setupUrl(token));
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(undefined), 2000);
    } catch {
      // Clipboard API may be unavailable — the link is still shown on screen.
    }
  };

  return (
    <div className="mt-10">
      <div className="rounded-md border border-white/5 bg-night p-5">
        <p className="text-sm font-medium text-fog">Generate a new setup link</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className={labelClass}>Campaign name</span>
            <input
              type="text"
              maxLength={120}
              required
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="30-Day Customer Acquisition Pilot"
              className={fieldClass}
            />
          </label>
          <label className="sm:w-40">
            <span className={labelClass}>Expires in (days)</span>
            <input
              type="number"
              min={1}
              placeholder="No expiry"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className={fieldClass}
            />
          </label>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !campaignName.trim()}
            className={`inline-flex min-h-12 items-center justify-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {creating ? "Generating…" : "Generate Link"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{error}</p>
      ) : null}

      <div className="mt-10 space-y-4">
        {links.length === 0 ? (
          <p className="text-sm text-mist/70">No setup links yet.</p>
        ) : (
          links.map((link) => {
            const isBusy = busyToken === link.token;
            const disabled = link.derivedStatus === "Disabled";

            return (
              <div key={link.token} className="rounded-md border border-white/5 bg-night p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-fog">
                      {link.businessName} — {link.product}
                    </p>
                    {link.campaignName ? (
                      <p className="mt-1 text-sm text-mist">{link.campaignName}</p>
                    ) : null}
                    <p className={`mt-1 text-xs font-medium tracking-wide uppercase ${statusClass(link.derivedStatus)}`}>
                      {link.derivedStatus}
                    </p>
                  </div>
                  <div className="text-right text-xs text-mist/70">
                    <p>Created {formatDate(link.createdAt)}</p>
                    <p>Expires {link.expiresAt ? formatDate(link.expiresAt) : "Never"}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-md bg-canvas px-3 py-2">
                  <code className="min-w-0 flex-1 truncate text-xs text-mist">{setupUrl(link.token)}</code>
                  <button
                    type="button"
                    onClick={() => copyLink(link.token)}
                    className={`shrink-0 text-xs font-medium text-purple transition hover:text-violet ${focusRing}`}
                  >
                    {copiedToken === link.token ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => runAction(link.token, disabled ? "enable" : "disable")}
                    className={`font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
                  >
                    {disabled ? "Enable" : "Disable"}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => runAction(link.token, "regenerate")}
                    className={`font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
                  >
                    Replace link
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => runAction(link.token, "extend", { days: 7 })}
                    className={`font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
                  >
                    Extend +7 days
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
