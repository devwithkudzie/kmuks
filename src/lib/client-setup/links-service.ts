import { getCampaignConfig } from "./campaigns";
import { generateSetupToken } from "./tokens";
import {
  createSetupLink,
  ensureSetupLinksHeaderExists,
  getSetupLinkByToken,
  listSetupLinks,
  updateSetupLinkRow,
  type SetupLinkRow,
} from "@/lib/google/setup-links";

export type SetupLinkStatus =
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Disabled"
  | "Expired";

export type SetupLinkView = SetupLinkRow & { derivedStatus: SetupLinkStatus };

export function deriveStatus(link: SetupLinkRow): SetupLinkStatus {
  if (link.status === "Disabled") return "Disabled";
  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) return "Expired";
  if (link.submittedAt) return "Submitted";
  if (link.openedAt) return "In Progress";
  return "Not Started";
}

function withDerivedStatus(link: SetupLinkRow): SetupLinkView {
  return { ...link, derivedStatus: deriveStatus(link) };
}

export async function listSetupLinkViews(): Promise<SetupLinkView[]> {
  await ensureSetupLinksHeaderExists();
  const links = await listSetupLinks();
  return links.map(withDerivedStatus).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createNewSetupLink(
  campaignId?: string,
  expiresInDays?: number,
  campaignName?: string,
): Promise<SetupLinkView> {
  await ensureSetupLinksHeaderExists();
  const campaign = getCampaignConfig(campaignId);
  const now = new Date();
  const expiresAt = expiresInDays
    ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : "";

  const link: SetupLinkRow = {
    token: generateSetupToken(),
    campaignId: campaign.id,
    businessName: campaign.businessName,
    product: campaign.product,
    campaignName: campaignName?.trim() || campaign.campaignName,
    status: "Active",
    createdAt: now.toISOString(),
    expiresAt,
    openedAt: "",
    submittedAt: "",
    submissionId: "",
  };

  await createSetupLink(link);
  return withDerivedStatus(link);
}

async function mutateLink(
  token: string,
  mutate: (link: SetupLinkRow) => SetupLinkRow,
): Promise<SetupLinkView | null> {
  const existing = await getSetupLinkByToken(token);
  if (!existing) return null;

  const updated = mutate(existing.link);
  await updateSetupLinkRow(existing.rowNumber, updated);
  return withDerivedStatus(updated);
}

export function setSetupLinkEnabled(token: string, enabled: boolean) {
  return mutateLink(token, (link) => ({ ...link, status: enabled ? "Active" : "Disabled" }));
}

export function extendSetupLinkExpiry(token: string, days: number) {
  return mutateLink(token, (link) => {
    const base = link.expiresAt && new Date(link.expiresAt).getTime() > Date.now()
      ? new Date(link.expiresAt)
      : new Date();
    base.setDate(base.getDate() + days);
    return { ...link, expiresAt: base.toISOString() };
  });
}

export async function regenerateSetupLink(token: string): Promise<SetupLinkView | null> {
  const existing = await getSetupLinkByToken(token);
  if (!existing) return null;

  const replacement: SetupLinkRow = {
    ...existing.link,
    token: generateSetupToken(),
    status: "Active",
    createdAt: new Date().toISOString(),
    openedAt: "",
    submittedAt: "",
    submissionId: "",
  };

  await updateSetupLinkRow(existing.rowNumber, { ...existing.link, status: "Disabled" });
  await createSetupLink(replacement);
  return withDerivedStatus(replacement);
}

export async function resolveSetupLinkForClient(token: string): Promise<{
  ok: true;
  campaignId: string;
  campaignName: string;
} | {
  ok: false;
  reason: "not_found" | "disabled" | "expired";
}> {
  const existing = await getSetupLinkByToken(token);
  if (!existing) return { ok: false, reason: "not_found" };

  const status = deriveStatus(existing.link);
  if (status === "Disabled") return { ok: false, reason: "disabled" };
  if (status === "Expired") return { ok: false, reason: "expired" };

  if (!existing.link.openedAt) {
    await updateSetupLinkRow(existing.rowNumber, {
      ...existing.link,
      openedAt: new Date().toISOString(),
    });
  }

  const campaign = getCampaignConfig(existing.link.campaignId);
  return {
    ok: true,
    campaignId: existing.link.campaignId,
    campaignName: existing.link.campaignName.trim() || campaign.campaignName,
  };
}

export async function markSetupLinkSubmitted(
  token: string,
  submissionId: string,
): Promise<void> {
  const existing = await getSetupLinkByToken(token);
  if (!existing) return;

  await updateSetupLinkRow(existing.rowNumber, {
    ...existing.link,
    submittedAt: new Date().toISOString(),
    submissionId,
  });
}
