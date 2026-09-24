import type { CampaignConfig } from "@/lib/client-setup/campaigns";

export function CampaignHeader({ campaign }: { campaign: CampaignConfig }) {
  return (
    <div>
      <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
        Campaign Setup
      </p>
      <h1 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-fog text-pretty">
        {campaign.businessName}
      </h1>
      <p className="mt-1 text-base font-medium text-mist sm:text-lg">{campaign.product}</p>
      <p className="mt-1 text-sm text-mist/80">{campaign.campaignName}</p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
        Please provide whatever information you currently have. You don&rsquo;t
        need to have everything — we can work through any remaining gaps
        during setup.
      </p>
    </div>
  );
}
