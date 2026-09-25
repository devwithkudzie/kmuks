import { randomUUID } from "node:crypto";
import { templateSchema, type FormTemplate } from "./templates";
import { getCampaignConfig } from "./campaigns";
import { generateSetupToken } from "./tokens";
import {
  createSetupLink,
  deleteSetupLinkRow,
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
  expiresInHours?: number,
  campaignName?: string,
  organization?: { businessName: string; product: string; template: FormTemplate },
): Promise<SetupLinkView> {
  await ensureSetupLinksHeaderExists();
  const campaign = getCampaignConfig(campaignId);
  const now = new Date();
  const expiresAt = expiresInHours
    ? new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString()
    : "";

  const link: SetupLinkRow = {
    token: generateSetupToken(),
    campaignId: organization ? `campaign-${randomUUID()}` : campaign.id,
    businessName: organization?.businessName ?? campaign.businessName,
    product: organization?.product ?? campaign.product,
    campaignName: campaignName?.trim() || campaign.campaignName,
    templateJson: organization ? JSON.stringify(organization.template) : "",
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

export function extendSetupLinkExpiry(token: string, hours: number) {
  return mutateLink(token, (link) => {
    const current = link.expiresAt ? new Date(link.expiresAt).getTime() : 0;
    const base = Math.max(current, Date.now());
    return { ...link, expiresAt: new Date(base + hours * 60 * 60 * 1000).toISOString() };
  });
}

/** Removes the link row only; any submission it produced stays in Client Submissions. */
export async function deleteSetupLink(token: string): Promise<boolean> {
  const existing = await getSetupLinkByToken(token);
  if (!existing) return false;
  await deleteSetupLinkRow(existing.rowNumber);
  return true;
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
  businessName: string;
  product: string;
  template: FormTemplate | null;
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
    businessName: existing.link.businessName,
    product: existing.link.product,
    template: existing.link.templateJson ? templateSchema.parse(JSON.parse(existing.link.templateJson)) : null,
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
