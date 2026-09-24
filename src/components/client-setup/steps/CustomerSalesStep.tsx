"use client";

import { useState } from "react";
import { StepShell } from "../StepShell";
import { TextField, TextAreaField, RadioField, CheckboxListField } from "../fields";
import { customerSalesSchema, type CustomerSalesValues } from "@/lib/client-setup/schema";
import { CUSTOMER_TYPES, ORDER_METHODS } from "@/lib/client-setup/constants";

export function CustomerSalesStep({
  values,
  onChange,
  onNext,
  onBack,
}: {
  values: CustomerSalesValues;
  onChange: (values: CustomerSalesValues) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const update = <K extends keyof CustomerSalesValues>(key: K, value: CustomerSalesValues[K]) =>
    onChange({ ...values, [key]: value });

  const handleNext = () => {
    const result = customerSalesSchema.safeParse(values);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <StepShell
      heading="Customers & Sales"
      supportingText="Who you sell to and how customers order."
      onNext={handleNext}
      onBack={onBack}
      nextLabel="Continue to Previous Marketing →"
    >
      <CheckboxListField
        label="Main customers"
        required
        values={values.customerTypes}
        onChange={(v) => update("customerTypes", v as CustomerSalesValues["customerTypes"])}
        options={CUSTOMER_TYPES}
        error={errors.customerTypes?.[0]}
      />
      {values.customerTypes.includes("Other") ? (
        <TextField
          label="Other customer type"
          value={values.customerTypeOther}
          onChange={(e) => update("customerTypeOther", e.target.value)}
        />
      ) : null}

      <RadioField
        label="How do customers usually order?"
        value={values.orderMethod}
        onChange={(v) => update("orderMethod", v as CustomerSalesValues["orderMethod"])}
        name="orderMethod"
        options={ORDER_METHODS.map((method) => ({ id: method, label: method }))}
      />
      {values.orderMethod === "Other" ? (
        <TextField
          label="Other ordering method"
          value={values.orderMethodOther}
          onChange={(e) => update("orderMethodOther", e.target.value)}
        />
      ) : null}

      <TextAreaField
        label="Any notes about customers or sales?"
        optional
        value={values.notes}
        onChange={(e) => update("notes", e.target.value)}
        placeholder={`e.g. Most orders come through WhatsApp.`}
      />
    </StepShell>
  );
}
