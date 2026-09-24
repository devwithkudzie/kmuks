"use client";

import { useState } from "react";
import { StepShell } from "../StepShell";
import { TextField, TextAreaField, RadioField, CheckboxListField } from "../fields";
import { previousMarketingSchema, type PreviousMarketingValues } from "@/lib/client-setup/schema";
import { AD_PLATFORMS } from "@/lib/client-setup/constants";

export function PreviousMarketingStep({
  productName,
  values,
  onChange,
  onNext,
  onBack,
}: {
  productName: string;
  values: PreviousMarketingValues;
  onChange: (values: PreviousMarketingValues) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const update = <K extends keyof PreviousMarketingValues>(
    key: K,
    value: PreviousMarketingValues[K],
  ) => onChange({ ...values, [key]: value });

  const handleNext = () => {
    const result = previousMarketingSchema.safeParse(values);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});
    onNext();
  };

  const hasAdvertised = values.hasAdvertised === "yes";

  return (
    <StepShell
      heading="Previous Marketing"
      supportingText="What you've done before (if any)."
      onNext={handleNext}
      onBack={onBack}
      nextLabel="Continue to Campaign Assets →"
    >
      <RadioField
        label={`Have you promoted your ${productName} before?`}
        required
        value={values.hasAdvertised}
        onChange={(v) => update("hasAdvertised", v as "yes" | "no")}
        name="hasAdvertised"
        error={errors.hasAdvertised?.[0]}
      />

      {hasAdvertised ? (
        <>
          <CheckboxListField
            label="Where did you promote?"
            hint="Select all that apply."
            values={values.platformsUsed}
            onChange={(v) => update("platformsUsed", v as PreviousMarketingValues["platformsUsed"])}
            options={AD_PLATFORMS}
          />
          {values.platformsUsed.includes("Other") ? (
            <TextField
              label="Other platform"
              value={values.platformOther}
              onChange={(e) => update("platformOther", e.target.value)}
            />
          ) : null}

          <TextAreaField
            label="What worked well?"
            optional
            value={values.whatWorkedWell}
            onChange={(e) => update("whatWorkedWell", e.target.value)}
            placeholder="e.g. Project photos and testimonials."
          />

          <TextAreaField
            label="What didn't work well?"
            optional
            value={values.whatDidntWork}
            onChange={(e) => update("whatDidntWork", e.target.value)}
            placeholder="e.g. Boosted posts didn't bring many serious enquiries."
          />
        </>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-mist/70">
        We&rsquo;ll never ask for Facebook, Meta, email or other account
        passwords. Facebook Page / Meta Business / Ad Account access is
        handled separately during setup.
      </p>
    </StepShell>
  );
}
