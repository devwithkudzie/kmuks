export const PAYMENT_METHODS = ["Cash", "EcoCash", "Bank Transfer", "Other"] as const;

export const DELIVERY_OPTIONS = [
  "We deliver to customers",
  "Customers collect from our location",
] as const;

export const DELIVERY_TIME_OPTIONS = [
  "Same day",
  "Next day",
  "1-3 days",
  "3-7 days",
  "More than a week",
] as const;

export const CUSTOMER_TYPES = [
  "Builders / Contractors",
  "Individual home builders",
  "Construction companies",
  "Hardware stores / Resellers",
  "Other",
] as const;

export const ORDER_METHODS = [
  "Phone / WhatsApp",
  "In person",
  "Through hardware stores",
  "Other",
] as const;

export const AD_PLATFORMS = [
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Flyers / Posters",
  "Local advertising",
  "Other",
] as const;

export type AssetCategoryId = "product_photos" | "videos" | "previous_marketing" | "other";

export type AssetCategory = {
  id: AssetCategoryId;
  label: string;
  helpText: string;
  driveFolder: string;
  accept: string;
  multiple: boolean;
};

const ACCEPT_ALL = ".jpg,.jpeg,.png,.mp4,.pdf";

/** The last word of a product name, lowercased — "Red Common Bricks" -> "bricks". */
export function unitWordFor(productName: string): string {
  const lastWord = productName.trim().split(/\s+/).pop();
  return lastWord ? lastWord.toLowerCase() : "product";
}

export function getAssetCategories(productName: string): AssetCategory[] {
  const unit = unitWordFor(productName);

  return [
    {
      id: "product_photos",
      label: "Product Photos",
      helpText: `Upload photos of your ${unit}.`,
      driveFolder: "Product Photos",
      accept: ACCEPT_ALL,
      multiple: true,
    },
    {
      id: "videos",
      label: "Videos (Optional)",
      helpText: "Upload any product or production videos.",
      driveFolder: "Videos",
      accept: ACCEPT_ALL,
      multiple: true,
    },
    {
      id: "previous_marketing",
      label: "Previous Marketing (Optional)",
      helpText: "Upload flyers, posters or previous ads.",
      driveFolder: "Previous Marketing",
      accept: ACCEPT_ALL,
      multiple: true,
    },
    {
      id: "other",
      label: "Other Assets (Optional)",
      helpText: "Any other useful files.",
      driveFolder: "Other",
      accept: ACCEPT_ALL,
      multiple: true,
    },
  ];
}

/** Static fallback list — category ids/folders/accept never vary by product,
 * only the label/help text do. Used where a full campaign context isn't
 * available (e.g. the upload API route only needs id/accept/driveFolder). */
export const ASSET_CATEGORIES: AssetCategory[] = getAssetCategories("product");

export const MAX_FILES_PER_CATEGORY = 10;

const MB = 1024 * 1024;
export const MAX_FILE_SIZE = 50 * MB;

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "image",
  "image/png": "image",
  "video/mp4": "video",
  "application/pdf": "document",
};

export function fileSizeLimitFor(): number {
  return MAX_FILE_SIZE;
}

export function formatFileSize(bytes: number): string {
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}
