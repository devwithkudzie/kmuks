"use client";

import { ConfirmDialog } from "./ConfirmDialog";
import { TemplateBuilder } from "./TemplateBuilder";
import type { FormTemplate } from "@/lib/client-setup/templates";
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
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
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type LinkGroup = "Active" | "Expired" | "Disabled";
const LINK_GROUPS: LinkGroup[] = ["Active", "Expired", "Disabled"];

// Uses the live clock so a link moves to Expired while the page is open.
function linkGroup(link: SetupLinkView, now: number): LinkGroup {
  if (link.status === "Disabled") return "Disabled";
  if (link.expiresAt && new Date(link.expiresAt).getTime() < now) return "Expired";
  return "Active";
}

export function AdminLinksManager({
  initialTemplates,
  initialLinks,
  baseUrl,
}: {
  initialTemplates: FormTemplate[];
  initialLinks: SetupLinkView[];
  baseUrl: string;
}) {
  const setupUrl = (token: string) => new URL(`/client/setup/${encodeURIComponent(token)}`, baseUrl).href;
  const [templates, setTemplates] = useState(initialTemplates);
  const [templateId, setTemplateId] = useState(initialTemplates[0]?.id ?? "");
  const [businessName, setBusinessName] = useState("");
  const [product, setProduct] = useState("");
  const [links, setLinks] = useState(initialLinks);
  const [campaignName, setCampaignName] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [expiryUnit, setExpiryUnit] = useState<"hours" | "days">("hours");
  const [group, setGroup] = useState<LinkGroup>("Active");
  const [now, setNow] = useState(() => Date.now());
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>();
  const [busyToken, setBusyToken] = useState<string>();
  const [copiedToken, setCopiedToken] = useState<string>();
  const [createError, setCreateError] = useState<string>();
  const [pendingDelete, setPendingDelete] = useState<SetupLinkView>();
  const createDialog = useRef<HTMLDialogElement>(null);

  const openCreate = () => {
    setCreateError(undefined);
    createDialog.current?.showModal();
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(undefined);
    try {
      const response = await fetch("/api/admin/setup-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(), product: product.trim(), templateId,
          campaignName: campaignName.trim(),
          expiresInHours: expiresIn ? Number(expiresIn) * (expiryUnit === "days" ? 24 : 1) : undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not create the link.");
      setLinks((prev) => [body.link, ...prev]);
      setGroup("Active");
      setBusinessName("");
      setProduct("");
      setCampaignName("");
      setExpiresIn("");
      createDialog.current?.close();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create the link.");
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

  const deleteLink = async (link: SetupLinkView) => {
    setBusyToken(link.token);
    setError(undefined);
    try {
      const response = await fetch(`/api/admin/setup-links/${link.token}`, { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not delete the link.");
      setLinks((prev) => prev.filter((item) => item.token !== link.token));
      setPendingDelete(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the link.");
      setPendingDelete(undefined);
    } finally {
      setBusyToken(undefined);
    }
  };

  const groupCounts = Object.fromEntries(
    LINK_GROUPS.map((name) => [name, links.filter((link) => linkGroup(link, now) === name).length]),
  ) as Record<LinkGroup, number>;
  const visibleLinks = links.filter((link) => linkGroup(link, now) === group);

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
      <TemplateBuilder templates={templates} onSaved={(template) => { setTemplates((old) => [...old, template]); setTemplateId(template.id); }} />
      <dialog
        ref={createDialog}
        aria-labelledby="create-link-title"
        className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-xl border border-white/10 bg-night p-0 text-fog backdrop:bg-black/70"
      >
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="create-link-title" className="text-lg font-semibold">Generate a new setup link</h2>
            <button
              type="button"
              onClick={() => createDialog.current?.close()}
              aria-label="Close"
              className={`rounded-md p-2 text-mist hover:bg-white/5 hover:text-fog ${focusRing}`}
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Organization name</span>
              <input list="organizations" required className={fieldClass} value={businessName} maxLength={120} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Victors Holdings" />
            </label>
            <datalist id="organizations">{[...new Set(links.map((link) => link.businessName))].map((name) => <option key={name} value={name} />)}</datalist>
            <label>
              <span className={labelClass}>Product or service</span>
              <input required className={fieldClass} value={product} maxLength={120} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Red Common Bricks" />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>Form template</span>
              <select className={fieldClass} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                {templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
              </select>
              <span className="mt-2 block text-xs text-mist">{templates.find((template) => template.id === templateId)?.description}</span>
            </label>
            <label className="sm:col-span-2">
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
            <div className="sm:col-span-2">
              <span className={labelClass}>Expires in</span>
              <div className="flex gap-2 sm:max-w-sm">
                <input
                  type="number"
                  min={1}
                  aria-label="Expires in"
                  placeholder="No expiry"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className={fieldClass}
                />
                <select
                  aria-label="Expiry unit"
                  value={expiryUnit}
                  onChange={(e) => setExpiryUnit(e.target.value as "hours" | "days")}
                  className={fieldClass}
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              <span className="mt-2 block text-xs text-mist">Leave blank for a link that never expires.</span>
            </div>
          </div>
          {createError ? (
            <p role="alert" className="mt-4 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{createError}</p>
          ) : null}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => createDialog.current?.close()}
              className={`min-h-12 rounded-md px-5 text-sm font-medium text-mist transition hover:text-fog ${focusRing}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !campaignName.trim() || !businessName.trim() || !product.trim() || !templateId}
              className={`inline-flex min-h-12 items-center justify-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {creating ? "Generating…" : "Generate Link"}
            </button>
          </div>
        </form>
      </dialog>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this setup link?"
        confirmLabel="Delete link"
        busy={!!pendingDelete && busyToken === pendingDelete.token}
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => pendingDelete && deleteLink(pendingDelete)}
      >
        {pendingDelete ? (
          <p>
            <span className="font-medium text-fog">
              {pendingDelete.businessName} — {pendingDelete.campaignName || pendingDelete.product}
            </span>{" "}
            will stop working and the client won&apos;t be able to open it. Any submission already received is kept.
          </p>
        ) : null}
      </ConfirmDialog>

      {error ? (
        <p className="mt-4 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{error}</p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10">
        <div role="tablist" aria-label="Link groups" className="flex gap-6 text-sm">
        {LINK_GROUPS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={group === name}
            onClick={() => setGroup(name)}
            className={`-mb-px border-b-2 pb-3 font-medium transition ${group === name ? "border-purple text-fog" : "border-transparent text-mist hover:text-fog"} ${focusRing}`}
          >
            {name} <span className="text-mist/70">({groupCounts[name]})</span>
          </button>
        ))}
      </div>
        <button
          type="button"
          onClick={openCreate}
          className={`mb-2 inline-flex items-center gap-2 rounded-md bg-purple px-4 py-2 text-sm font-medium text-white transition hover:bg-violet ${focusRing}`}
        >
          <Plus aria-hidden className="size-4" />
          Create link
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {visibleLinks.length === 0 ? (
          <p className="text-sm text-mist/70">
            {links.length === 0 ? "No setup links yet." : `No ${group.toLowerCase()} links.`}
          </p>
        ) : (
          visibleLinks.map((link) => {
            const isBusy = busyToken === link.token;
            const disabled = link.derivedStatus === "Disabled";
            const status = linkGroup(link, now) === "Expired" ? "Expired" : link.derivedStatus;

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
                    <p className={`mt-1 text-xs font-medium tracking-wide uppercase ${statusClass(status)}`}>
                      {status}
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
                    onClick={() => runAction(link.token, "extend", { hours: 1 })}
                    className={`font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
                  >
                    Extend +1 hour
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => runAction(link.token, "extend", { hours: 7 * 24 })}
                    className={`font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
                  >
                    Extend +7 days
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setPendingDelete(link)}
                    className={`ml-auto font-medium text-purple transition hover:text-violet disabled:opacity-50 ${focusRing}`}
                  >
                    Delete
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
