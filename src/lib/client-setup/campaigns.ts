export type CampaignConfig = {
  id: string;
  referenceCode: string;
  businessName: string;
  product: string;
  campaignName: string;
  driveClientFolder: string;
  driveCampaignFolder: string;
};

const CAMPAIGNS: Record<string, CampaignConfig> = {
  "victors-red-bricks": {
    id: "victors-red-bricks",
    referenceCode: "VICTORS",
    businessName: "Victors Holdings",
    product: "Red Common Bricks",
    campaignName: "30-Day Customer Acquisition Pilot",
    driveClientFolder: "Victors Holdings",
    driveCampaignFolder: "Red Common Bricks — Customer Acquisition Pilot",
  },
};

export const DEFAULT_CAMPAIGN_ID = "victors-red-bricks";

export function getCampaignConfig(id?: string | null): CampaignConfig {
  if (id && CAMPAIGNS[id]) return CAMPAIGNS[id];
  return CAMPAIGNS[DEFAULT_CAMPAIGN_ID];
}

export function listCampaigns(): CampaignConfig[] {
  return Object.values(CAMPAIGNS);
}
