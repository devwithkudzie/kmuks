import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient, type BaseExternalAccountClient } from "google-auth-library";

export class GoogleConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleConfigError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new GoogleConfigError(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Authenticates to Google Cloud via Vercel OIDC + Workload Identity
 * Federation, impersonating GOOGLE_SERVICE_ACCOUNT_EMAIL. No service-account
 * private key is created, downloaded, or stored anywhere.
 *
 * In production (a real Vercel Function), the Vercel platform makes the
 * per-request OIDC token available automatically — no wiring needed here.
 * In local development, it's read from VERCEL_OIDC_TOKEN in .env.local
 * (`vercel link && vercel env pull`), and refreshed automatically via the
 * Vercel CLI's own login session when it expires (~12h dev token lifetime).
 * If neither is available, google-auth-library's token request fails with a
 * clear underlying error rather than falling back to anything insecure.
 */
let cachedAuth: BaseExternalAccountClient | null = null;

export function getGoogleAuth(): BaseExternalAccountClient {
  if (cachedAuth) return cachedAuth;

  const projectNumber = requireEnv("GOOGLE_CLOUD_PROJECT_NUMBER");
  const poolId = requireEnv("GOOGLE_WORKLOAD_IDENTITY_POOL_ID");
  const providerId = requireEnv("GOOGLE_WORKLOAD_IDENTITY_PROVIDER_ID");
  const serviceAccountEmail = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");

  const client = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
    subject_token_supplier: {
      // google-auth-library calls this with its own `context` argument
      // (context.audience is the GCP resource path above, not a Vercel
      // `aud` value) — that must be ignored. We want Vercel's own default
      // OIDC token as-is: the GCP provider is configured with "Allowed
      // audiences" set to Vercel's own default (https://vercel.com/<team>),
      // so no custom-audience exchange is needed — passing one here actually
      // breaks the exchange (confirmed: Google rejects it as "Invalid
      // audience", since the exchanged token's aud doesn't come out as the
      // literal string passed in).
      getSubjectToken: () => getVercelOidcToken(),
    },
  });

  if (!client) {
    throw new GoogleConfigError(
      "Could not build the Google Workload Identity Federation client from the configured values.",
    );
  }

  cachedAuth = client;
  return client;
}

export function getClientSetupSpreadsheetId(): string {
  return requireEnv("CLIENT_SETUP_SPREADSHEET_ID");
}

export function getClientSetupDriveRootFolderId(): string {
  return requireEnv("CLIENT_SETUP_DRIVE_ROOT_FOLDER_ID");
}
