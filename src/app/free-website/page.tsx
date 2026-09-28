import type { Metadata } from "next";
import { FormPageShell } from "@/components/client-setup/FormPageShell";
import { PublicCampaignForm } from "@/components/client-setup/PublicCampaignForm";
import { FREE_WEBSITE_TEMPLATE } from "@/lib/client-setup/templates";

const { copy } = FREE_WEBSITE_TEMPLATE;
const description = copy.intro.split(/\n{2,}/)[0];

export const metadata: Metadata = {
  title: copy.heading,
  description,
  alternates: { canonical: "/free-website" },
  openGraph: { title: copy.heading, description, url: "/free-website", type: "website" },
  twitter: { card: "summary_large_image", title: copy.heading, description },
};

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value ?? "").slice(0, 200);
}

// The campaign's own public page: same form and sheet tab as its generated links.
export default async function FreeWebsitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <FormPageShell>
      <PublicCampaignForm
        template={FREE_WEBSITE_TEMPLATE}
        product=""
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
