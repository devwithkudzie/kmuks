import type { CampaignConfig } from "@/lib/client-setup/campaigns";
import { site } from "@/lib/site";

export function SubmissionSuccess({
  campaign,
  submissionId,
}: {
  campaign: CampaignConfig;
  submissionId: string;
}) {
  const message = `Hi Prosper, I've completed and submitted the campaign setup information for ${campaign.businessName} — ${campaign.product}.`;
  const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="text-center sm:text-left">
      <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
        Submitted
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-fog sm:text-3xl">
        Thank you, {campaign.businessName}.
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">
        Your campaign information and available materials have been received.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">
        We&rsquo;ll use this information alongside our market, customer and
        competitor research to prepare the campaign approach, messaging,
        assets, tracking and launch setup.
      </p>
      <p className="mt-6 text-xs tracking-widest text-mist/70 uppercase">
        Reference: {submissionId}
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex min-h-12 items-center rounded-md bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet"
      >
        Message Prosper on WhatsApp
      </a>
    </div>
  );
}
