import { CHECKLIST_STEPS } from "./SetupChecklist";

export function StepProgress({ step }: { step: number }) {
  const total = CHECKLIST_STEPS.length;

  return (
    <div className="lg:hidden">
      <p className="text-xs tracking-wide text-mist/70">
        Step {step} of {total}
      </p>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full transition ${
              index < step ? "bg-purple" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
