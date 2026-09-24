"use client";

import { StepShell } from "../StepShell";
import { FileUploadField } from "../FileUploadField";
import { getAssetCategories, type AssetCategoryId } from "@/lib/client-setup/constants";
import type { UploadItem } from "../uploadTypes";

export function CampaignAssetsStep({
  campaignId,
  productName,
  assetsByCategory,
  onCategoryChange,
  onNext,
  onBack,
}: {
  campaignId: string;
  productName: string;
  assetsByCategory: Record<AssetCategoryId, UploadItem[]>;
  onCategoryChange: (category: AssetCategoryId, items: UploadItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const assetCategories = getAssetCategories(productName);
  const stillUploading = assetCategories.some((category) =>
    (assetsByCategory[category.id] ?? []).some((item) => item.status === "uploading"),
  );

  return (
    <StepShell
      heading="Campaign Assets"
      supportingText="Upload any existing photos, videos or materials."
      onNext={onNext}
      onBack={onBack}
      nextLabel="Continue to Review & Submit →"
      nextDisabled={stillUploading}
      formError={stillUploading ? "Please wait for uploads to finish." : undefined}
    >
      {assetCategories.map((category) => (
        <FileUploadField
          key={category.id}
          category={category}
          campaignId={campaignId}
          items={assetsByCategory[category.id] ?? []}
          onItemsChange={(items) => onCategoryChange(category.id, items)}
        />
      ))}

      <p className="mt-6 text-xs leading-relaxed text-mist/70">
        You can upload multiple files for each category. Accepted formats:
        JPG, PNG, MP4, PDF (Max 50MB each).
      </p>
    </StepShell>
  );
}
