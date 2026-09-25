import { TemplateSetupForm } from "@/components/client-setup/TemplateSetupForm";
import type { Metadata } from "next";
import { ClientSetupForm } from "@/components/client-setup/ClientSetupForm";
import { resolveSetupLinkForClient } from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campaign Setup",
  robots: { index: false, follow: false },
};

const REASON_COPY: Record<string, { heading: string; body: string }> = {
  not_found: {
    heading: "This link isn't valid.",
    body: "Please check the link you were given, or contact Kudziemuks for a new one.",
  },
  disabled: {
    heading: "This link has been disabled.",
    body: "Please contact Kudziemuks for a new setup link.",
  },
  expired: {
    heading: "This link has expired.",
    body: "Please contact Kudziemuks for a new setup link.",
  },
  error: {
    heading: "Something went wrong.",
    body: "Please try again shortly, or contact Kudziemuks if this continues.",
  },
};

export default async function ClientSetupTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let result: Awaited<ReturnType<typeof resolveSetupLinkForClient>>;
  try {
    result = await resolveSetupLinkForClient(token);
  } catch (error) {
    if (error instanceof GoogleConfigError) {
      console.error("[client/setup/token] Google not configured:", error.message);
    } else {
      console.error("[client/setup/token] failed to resolve link:", error);
    }
    result = { ok: false, reason: "not_found" };
  }

  if (!result.ok) {
    const copy = REASON_COPY[result.reason] ?? REASON_COPY.error;
    return (
      <div className="min-h-dvh bg-canvas text-fog">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16 text-center sm:px-8">
          <p className="font-script text-2xl text-fog">Kudzie Muks</p>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-fog">{copy.heading}</h1>
          <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">{copy.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-canvas text-fog">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16 lg:max-w-6xl lg:px-12">
        <p className="font-script text-2xl text-fog">Kudzie Muks</p>
        <div className="mt-10">
          {result.template ? <TemplateSetupForm token={token} template={result.template} campaign={{ id: result.campaignId, businessName: result.businessName, product: result.product, campaignName: result.campaignName, referenceCode: "CLIENT", driveClientFolder: "", driveCampaignFolder: "" }} /> : <ClientSetupForm
            campaignId={result.campaignId}
            campaignName={result.campaignName}
            token={token}
          />}
        </div>
      </div>
    </div>
  );
}
