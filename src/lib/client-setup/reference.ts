import { createHash } from "node:crypto";
import type { CampaignConfig } from "./campaigns";

/**
 * Builds a human-readable, deterministic submission reference such as
 * KH-VICTORS-2026-7F3A2B. It's derived from the client's draft id, so a
 * retried/duplicated submit for the same in-progress form always produces
 * the same reference — that's what lets the submit route detect and ignore
 * duplicates instead of relying on a shared counter (which would race under
 * concurrent submissions).
 */
export function buildSubmissionReference(
  campaign: CampaignConfig,
  clientDraftId: string,
): string {
  const year = new Date().getFullYear();
  const hash = createHash("sha256").update(clientDraftId).digest("hex").slice(0, 6).toUpperCase();
  return `KH-${campaign.referenceCode}-${year}-${hash}`;
}
