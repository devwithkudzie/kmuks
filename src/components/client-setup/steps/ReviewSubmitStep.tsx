"use client";

import { useState } from "react";
import { StepShell } from "../StepShell";
import { TextField } from "../fields";
import { focusRing } from "../styles";
import { unitWordFor } from "@/lib/client-setup/constants";
import {
  contactSchema,
  type AssetFile,
  type ContactValues,
  type CustomerSalesValues,
  type DeliveryPaymentValues,
  type PreviousMarketingValues,
  type ProductPricingValues,
} from "@/lib/client-setup/schema";

function SummaryRow({
  title,
  summary,
  step,
  onEdit,
}: {
  title: string;
  summary: string;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 py-4 first:border-t-0">
      <div>
        <p className="text-sm font-medium text-fog">{title}</p>
        <p className="mt-0.5 text-xs text-mist/70">{summary || "Nothing added yet."}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className={`shrink-0 text-sm font-medium text-purple transition hover:text-violet ${focusRing}`}
      >
        Edit
      </button>
    </div>
  );
}

export function ReviewSubmitStep({
  productName,
  product,
  delivery,
  customers,
  marketing,
  assets,
  contact,
  onContactChange,
  onEditStep,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: {
  productName: string;
  product: ProductPricingValues;
  delivery: DeliveryPaymentValues;
  customers: CustomerSalesValues;
  marketing: PreviousMarketingValues;
  assets: AssetFile[];
  contact: ContactValues;
  onContactChange: (values: ContactValues) => void;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError?: string;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const unit = unitWordFor(productName);

  const update = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) =>
    onContactChange({ ...contact, [key]: value });

  const handleSubmit = () => {
    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});
    onSubmit();
  };

  const productSummary = product.priceAmount
    ? `$${product.priceAmount} per ${product.priceQuantity} ${unit}${
        product.minimumOrder ? ` • Min. ${product.minimumOrder}` : ""
      }`
    : "";

  const deliverySummary = [
    delivery.deliveryOptions
      .map((option) => (option === "We deliver to customers" ? "Delivery" : "Collection"))
      .join(" + "),
    delivery.paymentMethods.join(", "),
  ]
    .filter(Boolean)
    .join(" • ");

  const customersSummary = [customers.customerTypes.join(", "), customers.orderMethod]
    .filter(Boolean)
    .join(" • ");

  const marketingNotesCount = [marketing.whatWorkedWell, marketing.whatDidntWork].filter(Boolean).length;
  const marketingSummary =
    marketing.hasAdvertised === "yes"
      ? [
          marketing.platformsUsed.join(", "),
          marketingNotesCount ? `${marketingNotesCount} note${marketingNotesCount > 1 ? "s" : ""}` : "",
        ]
          .filter(Boolean)
          .join(" • ")
      : "Not previously advertised";

  const assetsSummary = assets.length ? `${assets.length} file${assets.length > 1 ? "s" : ""} uploaded` : "";

  return (
    <StepShell
      heading="Review & Submit"
      supportingText="Check your information and submit."
      onNext={handleSubmit}
      onBack={onBack}
      nextLabel="Submit Campaign Setup →"
      submitting={submitting}
      formError={submitError}
    >
      <div>
        <SummaryRow title="Product & Pricing" summary={productSummary} step={1} onEdit={onEditStep} />
        <SummaryRow title="Delivery & Payment" summary={deliverySummary} step={2} onEdit={onEditStep} />
        <SummaryRow title="Customers & Sales" summary={customersSummary} step={3} onEdit={onEditStep} />
        <SummaryRow title="Previous Marketing" summary={marketingSummary} step={4} onEdit={onEditStep} />
        <SummaryRow title="Campaign Assets" summary={assetsSummary} step={5} onEdit={onEditStep} />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-sm font-medium text-fog">
          Who should we contact if we need to clarify anything about this campaign?
        </p>

        <TextField
          label="Contact name"
          required
          value={contact.contactName}
          onChange={(e) => update("contactName", e.target.value)}
          error={errors.contactName?.[0]}
        />
        <TextField
          label="WhatsApp number"
          required
          value={contact.contactWhatsapp}
          onChange={(e) => update("contactWhatsapp", e.target.value)}
          placeholder="e.g. +263 77 000 0000"
          error={errors.contactWhatsapp?.[0]}
        />
        <TextField
          label="Which WhatsApp number should receive customer enquiries?"
          required
          hint="Can be the same number as above."
          value={contact.customerWhatsapp}
          onChange={(e) => update("customerWhatsapp", e.target.value)}
          placeholder="e.g. +263 77 000 0000"
          error={errors.customerWhatsapp?.[0]}
        />
      </div>

      <label className="mt-8 flex items-start gap-3 text-sm text-mist">
        <input
          type="checkbox"
          checked={contact.confirmed}
          onChange={(e) => update("confirmed", e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded accent-purple"
        />
        <span>I confirm that the information provided is correct to the best of my knowledge.</span>
      </label>
      {errors.confirmed?.[0] ? (
        <p className="mt-2 text-sm text-purple">{errors.confirmed[0]}</p>
      ) : null}
    </StepShell>
  );
}
