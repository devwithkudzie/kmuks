"use client";

import { useState } from "react";
import { StepShell } from "../StepShell";
import { TextField, TextAreaField, SelectField, CheckboxListField } from "../fields";
import { deliveryPaymentSchema, type DeliveryPaymentValues } from "@/lib/client-setup/schema";
import { DELIVERY_OPTIONS, DELIVERY_TIME_OPTIONS, PAYMENT_METHODS } from "@/lib/client-setup/constants";

export function DeliveryPaymentStep({
  productName,
  values,
  onChange,
  onNext,
  onBack,
}: {
  productName: string;
  values: DeliveryPaymentValues;
  onChange: (values: DeliveryPaymentValues) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const update = <K extends keyof DeliveryPaymentValues>(
    key: K,
    value: DeliveryPaymentValues[K],
  ) => onChange({ ...values, [key]: value });

  const handleNext = () => {
    const result = deliveryPaymentSchema.safeParse(values);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <StepShell
      heading="Delivery & Payment"
      supportingText={`How customers get their ${productName.toLowerCase()} and pay.`}
      onNext={handleNext}
      onBack={onBack}
      nextLabel="Continue to Customers & Sales →"
    >
      <CheckboxListField
        label="Delivery options"
        required
        values={values.deliveryOptions}
        onChange={(v) => update("deliveryOptions", v as DeliveryPaymentValues["deliveryOptions"])}
        options={DELIVERY_OPTIONS}
        error={errors.deliveryOptions?.[0]}
      />

      <TextAreaField
        label="Delivery areas"
        optional
        value={values.deliveryAreas}
        onChange={(e) => update("deliveryAreas", e.target.value)}
        placeholder="e.g. Harare, Chitungwiza, Ruwa and nearby areas"
      />

      <SelectField
        label="Typical delivery time"
        optional
        value={values.deliveryTime}
        onChange={(v) => update("deliveryTime", v)}
        options={DELIVERY_TIME_OPTIONS}
      />

      <CheckboxListField
        label="Accepted payment methods"
        required
        values={values.paymentMethods}
        onChange={(v) => update("paymentMethods", v as DeliveryPaymentValues["paymentMethods"])}
        options={PAYMENT_METHODS}
        error={errors.paymentMethods?.[0]}
      />
      {values.paymentMethods.includes("Other") ? (
        <TextField
          label="Other payment method"
          value={values.paymentMethodOther}
          onChange={(e) => update("paymentMethodOther", e.target.value)}
        />
      ) : null}

      <TextAreaField
        label="Payment notes"
        optional
        value={values.paymentNotes}
        onChange={(e) => update("paymentNotes", e.target.value)}
        placeholder="e.g. 70% upfront for new customers."
      />
    </StepShell>
  );
}
