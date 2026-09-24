"use client";

import type { ReactNode } from "react";
import { focusRing } from "./styles";

export function StepShell({
  heading,
  supportingText,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Previous",
  nextDisabled,
  submitting,
  formError,
}: {
  heading: string;
  supportingText?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  submitting?: boolean;
  formError?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-fog sm:text-3xl">{heading}</h2>
      {supportingText ? (
        <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{supportingText}</p>
      ) : null}

      <div className="mt-8">{children}</div>

      {formError ? (
        <p className="mt-6 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{formError}</p>
      ) : null}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 text-sm font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
          >
            {backLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || submitting}
          className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none ${focusRing}`}
        >
          {submitting ? "Please wait…" : nextLabel}
        </button>
      </div>
    </div>
  );
}
