import { TemplateSetupForm } from "@/components/client-setup/TemplateSetupForm";
import { PublicCampaignForm } from "@/components/client-setup/PublicCampaignForm";
import { FormPageShell } from "@/components/client-setup/FormPageShell";
import type { Metadata } from "next";
import { ClientSetupForm } from "@/components/client-setup/ClientSetupForm";
import { resolveSetupLinkForClient } from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campaign Setup",
  robots: { index: false, follow: false },
};

const CLOSED_CAMPAIGN_COPY = {
  heading: "Applications for this campaign have closed.",
  body: "Thank you for your interest. Follow Kudziemuks for future opportunities.",
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

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value ?? "").slice(0, 200);
}

export default async function ClientSetupTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const query = await searchParams;

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
    const copy = result.publicCampaign ? CLOSED_CAMPAIGN_COPY : REASON_COPY[result.reason] ?? REASON_COPY.error;
    return (
      <FormPageShell>
        <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-24 text-center sm:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-balance text-fog">{copy.heading}</h1>
          <p className="mt-4 text-sm leading-relaxed text-pretty text-mist sm:text-base">{copy.body}</p>
        </div>
      </FormPageShell>
    );
  }

  if (result.template?.kind === "public") {
    return (
      <FormPageShell>
        <PublicCampaignForm
          token={token}
          template={result.template}
          product={result.product}
          utm={{
            source: firstParam(query.utm_source),
            medium: firstParam(query.utm_medium),
            campaign: firstParam(query.utm_campaign),
            content: firstParam(query.utm_content),
          }}
        />
      </FormPageShell>
    );
  }

  return (
    <FormPageShell>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {result.template ? (
          <TemplateSetupForm
            token={token}
            template={result.template}
            campaign={{
              id: result.campaignId,
              businessName: result.businessName,
              product: result.product,
              campaignName: result.campaignName,
              referenceCode: "CLIENT",
              driveClientFolder: "",
              driveCampaignFolder: "",
            }}
          />
        ) : (
          <ClientSetupForm campaignId={result.campaignId} campaignName={result.campaignName} token={token} />
        )}
      </div>
    </FormPageShell>
  );
}
