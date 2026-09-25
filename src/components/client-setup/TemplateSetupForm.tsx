"use client";
import { useEffect, useState } from "react";
import type { CampaignConfig } from "@/lib/client-setup/campaigns";
import { contactSchema } from "@/lib/client-setup/schema";
import {
  formatAnswer,
  isFieldVisible,
  validateAnswers,
  type FormTemplate,
  type TemplateAnswers,
  type TemplateField,
} from "@/lib/client-setup/templates";
import { CampaignHeader } from "./CampaignHeader";
import { SetupChecklist, type StepStatus } from "./SetupChecklist";
import { StepProgress } from "./StepProgress";
import { StepShell } from "./StepShell";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { TextField } from "./fields";
import { focusRing } from "./styles";
import { TemplateFieldInput } from "./TemplateFields";
import { markFormSubmitted, redirectIfSubmitted } from "./submitted";

type Contact = { contactName: string; contactWhatsapp: string; customerWhatsapp: string; confirmed: boolean };
const emptyContact: Contact = { contactName: "", contactWhatsapp: "", customerWhatsapp: "", confirmed: false };

export function TemplateSetupForm({ token, campaign, template }: { token: string; campaign: CampaignConfig; template: FormTemplate }) {
  const storageKey = `client-template:${token}`;
  const sections = [...new Set(template.fields.map((field) => field.section))];
  const stepLabels = [...sections, "Review & Submit"];
  const reviewStep = stepLabels.length;
  const fieldsFor = (section: string) => template.fields.filter((field) => field.section === section);
  const sectionErrors = (section: string, values: TemplateAnswers) =>
    validateAnswers(template, values, fieldsFor(section)).errors;

  const [answers, setAnswers] = useState<TemplateAnswers>({});
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [step, setStepState] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [draftId, setDraftId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [submissionId, setSubmissionId] = useState("");

  useEffect(() => {
    if (redirectIfSubmitted(token)) return;
    let saved: { answers?: TemplateAnswers; contact?: Partial<Contact>; draftId?: unknown; step?: number; maxStepReached?: number } | null = null;
    try { saved = JSON.parse(localStorage.getItem(storageKey) ?? "null"); } catch { /* Storage may be unavailable. */ }
    const clamp = (value: unknown) => Math.min(Math.max(typeof value === "number" ? value : 1, 1), reviewStep);
    // localStorage only exists after mount, so adopting a saved draft needs a one-time setState here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved?.answers) setAnswers(saved.answers);
    if (saved?.contact) setContact({ ...emptyContact, ...saved.contact });
    setStepState(clamp(saved?.step));
    setMaxStepReached(Math.max(clamp(saved?.maxStepReached), clamp(saved?.step)));
    setDraftId(typeof saved?.draftId === "string" ? saved.draftId : crypto.randomUUID());
    setHydrated(true);
  }, [storageKey, reviewStep, token]);

  useEffect(() => {
    if (!hydrated || submissionId) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, contact, draftId, step, maxStepReached }));
    } catch { /* Storage may be unavailable. */ }
  }, [answers, contact, draftId, step, maxStepReached, hydrated, storageKey, submissionId]);

  const setStep = (next: number) => {
    setStepState(next);
    setMaxStepReached((max) => Math.max(max, next));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    const found = sectionErrors(sections[step - 1], answers);
    if (Object.keys(found).length) { setErrors(found); return; }
    setStep(step + 1);
  };

  async function submit() {
    // Re-check every section: a saved draft may skip straight to review.
    const firstInvalid = sections.findIndex((section) => Object.keys(sectionErrors(section, answers)).length);
    if (firstInvalid !== -1) {
      setStep(firstInvalid + 1);
      setErrors(sectionErrors(sections[firstInvalid], answers));
      return;
    }
    const contactCheck = contactSchema.safeParse(contact);
    if (!contactCheck.success) {
      const fieldErrors = contactCheck.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? ""])));
      return;
    }
    setErrors({}); setSubmitError(undefined); setBusy(true);
    try {
      const response = await fetch("/api/client-setup/template-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, clientDraftId: draftId, answers, contact }),
      });
      const body = await response.json();
      if (!response.ok) {
        const fieldErrors: Record<string, string> = body.fieldErrors ?? {};
        const badSection = sections.findIndex((section) => fieldsFor(section).some((field) => fieldErrors[field.id]));
        if (badSection !== -1) { setStep(badSection + 1); setErrors(fieldErrors); return; }
        setSubmitError(body.error ?? "Could not submit.");
        return;
      }
      setSubmissionId(body.submissionId);
      markFormSubmitted(token);
      try { localStorage.removeItem(storageKey); } catch { /* Non-fatal. */ }
    } catch {
      setSubmitError("Could not reach the server. Your answers are still saved; please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated) return null;
  if (submissionId) return <SubmissionSuccess campaign={campaign} submissionId={submissionId} />;

  // Visited steps reflect their current required-field validation.
  const statuses: StepStatus[] = stepLabels.map((_, index) => {
    const number = index + 1;
    if (number === step) return "current";
    if (number > maxStepReached || number === reviewStep) return "upcoming";
    return Object.keys(sectionErrors(sections[index], answers)).length ? "upcoming" : "completed";
  });

  const renderField = (field: TemplateField) => (
    <TemplateFieldInput
      key={field.id}
      template={template}
      field={field}
      answers={answers}
      product={campaign.product}
      error={errors[field.id]}
      onChange={(next) => setAnswers((old) => ({ ...old, [field.id]: next }))}
    />
  );

  const updateContact = <K extends keyof Contact>(key: K, value: Contact[K]) => setContact((old) => ({ ...old, [key]: value }));
  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <div>
      <CampaignHeader campaign={campaign} />

      <div className="mt-10 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="hidden lg:sticky lg:top-12 lg:block">
          <SetupChecklist steps={stepLabels} statuses={statuses} onSelectStep={setStep} />
        </aside>

        <div className="min-w-0 lg:max-w-2xl">
          <StepProgress step={step} total={stepLabels.length} />

          <div className="mt-8 lg:mt-0">
            {step < reviewStep ? (
              <StepShell
                heading={sections[step - 1]}
                supportingText="Your answers are saved on this device as you go."
                onBack={step > 1 ? () => setStep(step - 1) : undefined}
                onNext={goNext}
                nextLabel={`Continue to ${stepLabels[step]} →`}
                formError={hasFieldErrors ? "Please check the highlighted questions above." : undefined}
              >
                {fieldsFor(sections[step - 1]).map(renderField)}
              </StepShell>
            ) : (
              <StepShell
                heading="Review & Submit"
                supportingText="Check your information and submit."
                onBack={() => setStep(step - 1)}
                onNext={submit}
                nextLabel="Submit Campaign Setup →"
                submitting={busy}
                formError={submitError}
              >
                <div>
                  {sections.map((section, index) => {
                    const summary = fieldsFor(section)
                      .filter((field) => isFieldVisible(template, field, answers))
                      .map((field) => formatAnswer(field, answers[field.id], campaign.product))
                      .filter(Boolean)
                      .join(" • ");
                    return (
                      <div key={section} className="flex items-center justify-between gap-4 border-t border-white/10 py-4 first:border-t-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-fog">{section}</p>
                          <p className="mt-0.5 text-xs wrap-break-word text-mist/70">{summary || "Nothing added yet."}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(index + 1)}
                          className={`shrink-0 text-sm font-medium text-purple transition hover:text-violet ${focusRing}`}
                        >
                          Edit
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm font-medium text-fog">
                    Who should we contact if we need to clarify anything about this campaign?
                  </p>
                  <TextField
                    label="Contact name"
                    required
                    maxLength={200}
                    value={contact.contactName}
                    onChange={(e) => updateContact("contactName", e.target.value)}
                    error={errors.contactName}
                  />
                  <TextField
                    label="WhatsApp number"
                    required
                    maxLength={200}
                    value={contact.contactWhatsapp}
                    onChange={(e) => updateContact("contactWhatsapp", e.target.value)}
                    placeholder="e.g. +263 77 000 0000"
                    error={errors.contactWhatsapp}
                  />
                  <TextField
                    label="Which WhatsApp number should receive customer enquiries?"
                    required
                    hint="Can be the same number as above."
                    maxLength={200}
                    value={contact.customerWhatsapp}
                    onChange={(e) => updateContact("customerWhatsapp", e.target.value)}
                    placeholder="e.g. +263 77 000 0000"
                    error={errors.customerWhatsapp}
                  />
                </div>

                <label className="mt-8 flex items-start gap-3 text-sm text-mist">
                  <input
                    type="checkbox"
                    checked={contact.confirmed}
                    onChange={(e) => updateContact("confirmed", e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 rounded accent-purple"
                  />
                  <span>I confirm that the information provided is correct to the best of my knowledge.</span>
                </label>
                {errors.confirmed ? <p className="mt-2 text-sm text-purple">{errors.confirmed}</p> : null}
              </StepShell>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
