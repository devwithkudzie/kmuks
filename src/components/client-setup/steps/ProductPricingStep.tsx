"use client";

import { useState } from "react";
import { StepShell } from "../StepShell";
import { FieldWrapper, RadioField, TextAreaField } from "../fields";
import { fieldClass, labelClass } from "../styles";
import { productPricingSchema, type ProductPricingValues } from "@/lib/client-setup/schema";
import { unitWordFor } from "@/lib/client-setup/constants";

// fieldClass bakes in `w-full`, which — being generated later in Tailwind's
// stylesheet — wins over an appended `w-24` regardless of className order.
// These compact inputs need their own class without that width utility.
const compactFieldClass = fieldClass.replace(/\bw-full\b/, "").replace(/\bmt-2\b/, "");

export function ProductPricingStep({
  productName,
  values,
  onChange,
  onNext,
}: {
  productName: string;
  values: ProductPricingValues;
  onChange: (values: ProductPricingValues) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const unit = unitWordFor(productName);

  const update = <K extends keyof ProductPricingValues>(key: K, value: ProductPricingValues[K]) =>
    onChange({ ...values, [key]: value });

  const handleNext = () => {
    const result = productPricingSchema.safeParse(values);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <StepShell
      heading="Product & Pricing"
      supportingText={`Key details about your ${productName}.`}
      onNext={handleNext}
      nextLabel="Continue to Delivery & Payment →"
    >
      <FieldWrapper
        label="Price"
        required
        hint={`e.g. $85 per 1,000 ${unit}`}
        error={errors.priceAmount?.[0] ?? errors.priceQuantity?.[0]}
      >
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`${labelClass} inline w-auto normal-case`}>$</span>
          <input
            value={values.priceAmount}
            onChange={(e) => update("priceAmount", e.target.value)}
            placeholder="85"
            className={`${compactFieldClass} w-24`}
          />
          <span className="text-sm text-mist">per</span>
          <input
            value={values.priceQuantity}
            onChange={(e) => update("priceQuantity", e.target.value)}
            placeholder="1,000"
            className={`${compactFieldClass} w-24`}
          />
          <span className="text-sm text-mist">{unit}</span>
        </div>
      </FieldWrapper>

      <FieldWrapper label="Minimum order" required error={errors.minimumOrder?.[0]}>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={values.minimumOrder}
            onChange={(e) => update("minimumOrder", e.target.value)}
            placeholder="1,000"
            className={`${compactFieldClass} w-24`}
          />
          <span className="text-sm text-mist">{unit}</span>
        </div>
      </FieldWrapper>

      <RadioField
        label="Bulk pricing"
        required
        value={values.bulkPricing}
        onChange={(v) => update("bulkPricing", v as ProductPricingValues["bulkPricing"])}
        name="bulkPricing"
        options={[
          { id: "same", label: "Same price" },
          { id: "varies", label: "Changes for larger orders" },
        ]}
      />
      {values.bulkPricing === "varies" ? (
        <TextAreaField
          label="Bulk pricing details"
          value={values.bulkPricingDetails}
          onChange={(e) => update("bulkPricingDetails", e.target.value)}
          placeholder={`e.g. $80 per 1,000 ${unit} for orders above 10,000 ${unit}`}
        />
      ) : null}

      <TextAreaField
        label="Product details"
        optional
        value={values.productDetails}
        onChange={(e) => update("productDetails", e.target.value)}
        placeholder={`e.g. Standard ${productName.toLowerCase()} suitable for general construction.`}
      />

      <RadioField
        label="Special offer"
        value={values.hasSpecialOffer}
        onChange={(v) => update("hasSpecialOffer", v as "yes" | "no")}
        name="hasSpecialOffer"
        options={[
          { id: "no", label: "No" },
          { id: "yes", label: "Yes" },
        ]}
      />
      {values.hasSpecialOffer === "yes" ? (
        <TextAreaField
          label="Offer details"
          value={values.offerDetails}
          onChange={(e) => update("offerDetails", e.target.value)}
          placeholder={`e.g. Free delivery for orders above 20,000 ${unit}.`}
        />
      ) : null}
    </StepShell>
  );
}
