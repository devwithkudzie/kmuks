import { z } from "zod";
import { AD_PLATFORMS, CUSTOMER_TYPES, DELIVERY_OPTIONS, ORDER_METHODS, PAYMENT_METHODS } from "./constants";

const optionalText = z.string().trim().max(4000).optional().default("");
const requiredText = (message: string) =>
  z.string().trim().min(1, message).max(4000);

export const productPricingSchema = z.object({
  priceAmount: requiredText("Let us know your current price."),
  priceQuantity: requiredText("Let us know the quantity this price is for."),
  minimumOrder: requiredText("Let us know your minimum order."),
  bulkPricing: z.enum(["same", "varies"]).default("same"),
  bulkPricingDetails: optionalText,
  productDetails: optionalText,
  hasSpecialOffer: z.enum(["yes", "no"]).default("no"),
  offerDetails: optionalText,
});

export const deliveryPaymentSchema = z.object({
  deliveryOptions: z.array(z.enum(DELIVERY_OPTIONS)).min(1, "Select at least one option."),
  deliveryAreas: optionalText,
  deliveryTime: optionalText,
  paymentMethods: z.array(z.enum(PAYMENT_METHODS)).min(1, "Select at least one payment method."),
  paymentMethodOther: optionalText,
  paymentNotes: optionalText,
});

export const customerSalesSchema = z.object({
  customerTypes: z.array(z.enum(CUSTOMER_TYPES)).min(1, "Select at least one option."),
  customerTypeOther: optionalText,
  orderMethod: z.enum(ORDER_METHODS).or(z.literal("")).default(""),
  orderMethodOther: optionalText,
  notes: optionalText,
});

export const previousMarketingSchema = z.object({
  hasAdvertised: z.enum(["yes", "no"]).default("no"),
  platformsUsed: z.array(z.enum(AD_PLATFORMS)).default([]),
  platformOther: optionalText,
  whatWorkedWell: optionalText,
  whatDidntWork: optionalText,
});

export const contactSchema = z.object({
  contactName: requiredText("Enter the primary contact name."),
  contactWhatsapp: requiredText("Enter a WhatsApp number so we can reach you."),
  customerWhatsapp: requiredText(
    "Enter the WhatsApp number customers should be directed to.",
  ),
  confirmed: z.boolean().refine((value) => value === true, {
    message: "Please confirm before submitting.",
  }),
});

export const assetFileSchema = z.object({
  category: z.string(),
  name: z.string(),
  url: z.string().url(),
  fileId: z.string(),
  size: z.number(),
  mimeType: z.string(),
});

export const clientSetupSubmissionSchema = z.object({
  campaignId: z.string().min(1),
  token: z.string().optional(),
  clientDraftId: z.string().min(1),
  product: productPricingSchema,
  delivery: deliveryPaymentSchema,
  customers: customerSalesSchema,
  marketing: previousMarketingSchema,
  contact: contactSchema,
  assets: z.array(assetFileSchema).default([]),
});

export type ProductPricingValues = z.infer<typeof productPricingSchema>;
export type DeliveryPaymentValues = z.infer<typeof deliveryPaymentSchema>;
export type CustomerSalesValues = z.infer<typeof customerSalesSchema>;
export type PreviousMarketingValues = z.infer<typeof previousMarketingSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type AssetFile = z.infer<typeof assetFileSchema>;
export type ClientSetupSubmission = z.infer<typeof clientSetupSubmissionSchema>;

export const emptyProductPricing: ProductPricingValues = {
  priceAmount: "",
  priceQuantity: "1,000",
  minimumOrder: "",
  bulkPricing: "same",
  bulkPricingDetails: "",
  productDetails: "",
  hasSpecialOffer: "no",
  offerDetails: "",
};

export const emptyDeliveryPayment: DeliveryPaymentValues = {
  deliveryOptions: [],
  deliveryAreas: "",
  deliveryTime: "",
  paymentMethods: [],
  paymentMethodOther: "",
  paymentNotes: "",
};

export const emptyCustomerSales: CustomerSalesValues = {
  customerTypes: [],
  customerTypeOther: "",
  orderMethod: "",
  orderMethodOther: "",
  notes: "",
};

export const emptyPreviousMarketing: PreviousMarketingValues = {
  hasAdvertised: "no",
  platformsUsed: [],
  platformOther: "",
  whatWorkedWell: "",
  whatDidntWork: "",
};

// A step is "complete" once its required fields validate — optional fields
// and asset uploads never block completion, matching the setup checklist.
export function isProductStepComplete(values: ProductPricingValues): boolean {
  return productPricingSchema.safeParse(values).success;
}
export function isDeliveryStepComplete(values: DeliveryPaymentValues): boolean {
  return deliveryPaymentSchema.safeParse(values).success;
}
export function isCustomersStepComplete(values: CustomerSalesValues): boolean {
  return customerSalesSchema.safeParse(values).success;
}
export function isMarketingStepComplete(values: PreviousMarketingValues): boolean {
  return previousMarketingSchema.safeParse(values).success;
}

export const emptyContact: ContactValues = {
  contactName: "",
  contactWhatsapp: "",
  customerWhatsapp: "",
  confirmed: false,
};
