"use client";

import { focusRing } from "./styles";

export type StepStatus = "completed" | "current" | "upcoming";

export const CHECKLIST_STEPS = [
  "Product & Pricing",
  "Delivery & Payment",
  "Customers & Sales",
  "Previous Marketing",
  "Review & Submit",
] as const;

export function SetupChecklist({
  statuses,
  onSelectStep,
}: {
  statuses: StepStatus[];
  onSelectStep: (step: number) => void;
}) {
  const completedCount = statuses.filter((status) => status === "completed").length;

  return (
    <nav aria-label="Setup checklist">
      <p className="text-[0.7rem] font-medium tracking-[0.16em] text-purple uppercase">
        Setup Checklist
      </p>
      <ol className="mt-4 space-y-1">
        {CHECKLIST_STEPS.map((label, index) => {
          const status = statuses[index];
          const stepNumber = index + 1;
          const clickable = status === "completed";

          const icon = status === "completed" ? "✓" : status === "current" ? "●" : "○";
          const iconClass =
            status === "completed"
              ? "text-purple"
              : status === "current"
                ? "text-fog"
                : "text-mist/50";
          const textClass =
            status === "current"
              ? "font-semibold text-fog"
              : status === "completed"
                ? "text-fog"
                : "text-mist/50";

          const rowClass = `flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${
            clickable ? `transition hover:bg-white/5 ${focusRing}` : "cursor-default"
          }`;

          return (
            <li key={label}>
              {clickable ? (
                <button type="button" onClick={() => onSelectStep(stepNumber)} className={rowClass}>
                  <span className={`text-sm ${iconClass}`} aria-hidden>
                    {icon}
                  </span>
                  <span className={`text-sm ${textClass}`}>{label}</span>
                </button>
              ) : (
                <div className={rowClass} aria-current={status === "current" ? "step" : undefined}>
                  <span className={`text-sm ${iconClass}`} aria-hidden>
                    {icon}
                  </span>
                  <span className={`text-sm ${textClass}`}>{label}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 px-2 text-xs text-mist/60">
        {completedCount} of {CHECKLIST_STEPS.length} completed
      </p>
    </nav>
  );
}
