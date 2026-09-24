import { randomBytes } from "node:crypto";

/** URL-safe, unguessable token used in client-facing setup links. */
export function generateSetupToken(): string {
  return randomBytes(24).toString("base64url");
}
