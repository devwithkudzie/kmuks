"use client";
import { useEffect, useState } from "react";
import type { CampaignConfig } from "@/lib/client-setup/campaigns";
import { validateAnswers, type FormTemplate, type TemplateAnswers } from "@/lib/client-setup/templates";
import { CampaignHeader } from "./CampaignHeader";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { CheckboxListField, SelectField, TextAreaField, TextField } from "./fields";
import { focusRing } from "./styles";

export function TemplateSetupForm({ token, campaign, template }: { token: string; campaign: CampaignConfig; template: FormTemplate }) {
  const storageKey = `client-template:${token}`;
  const [answers, setAnswers] = useState<TemplateAnswers>({});
  const [contact, setContact] = useState({ contactName: "", contactWhatsapp: "", customerWhatsapp: "" });
  const [draftId, setDraftId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  useEffect(() => {
    let saved: { answers?: TemplateAnswers; contact?: typeof contact; draftId?: unknown } | null = null;
    try { saved = JSON.parse(localStorage.getItem(storageKey) ?? "null"); } catch { /* Storage may be unavailable. */ }
    // localStorage only exists after mount, so adopting a saved draft needs a one-time setState here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved?.answers) setAnswers(saved.answers);
    if (saved?.contact) setContact(saved.contact);
    setDraftId(typeof saved?.draftId === "string" ? saved.draftId : crypto.randomUUID());
    setHydrated(true);
  }, [storageKey]);
  useEffect(() => {
    if (!hydrated || submissionId) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ answers, contact, draftId })); } catch { /* Storage may be unavailable. */ }
  }, [answers, contact, draftId, hydrated, storageKey, submissionId]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const checked = validateAnswers(template, answers);
    if (Object.keys(checked.errors).length) { setErrors(checked.errors); return; }
    setErrors({}); setBusy(true);
    try {
      const response = await fetch("/api/client-setup/template-submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, clientDraftId: draftId, answers, contact: { ...contact, confirmed } }) });
      const body = await response.json();
      if (!response.ok) { setErrors(body.fieldErrors ?? { form: body.error ?? "Could not submit." }); return; }
      setSubmissionId(body.submissionId);
      try { localStorage.removeItem(storageKey); } catch { /* Non-fatal. */ }
    } catch { setErrors({ form: "Could not reach the server. Your answers are still saved; please try again." }); }
    finally { setBusy(false); }
  }
  if (!hydrated) return null;
  if (submissionId) return <SubmissionSuccess campaign={campaign} submissionId={submissionId} />;
  const sections = [...new Set(template.fields.map((field) => field.section))];
  return (
    <div>
      <CampaignHeader campaign={campaign} />
      <p className="mt-4 text-xs text-mist">{template.name} · Your answers are saved on this device as you go.</p>
      <form onSubmit={submit} className="mt-10 max-w-3xl">
        <fieldset disabled={busy} className="space-y-10">
          {sections.map((section) => (
            <section key={section} className="rounded-xl border border-white/10 p-5 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold">{section}</h2>
              {template.fields.filter((field) => field.section === section).map((field) => {
                const common = { label: field.label, hint: field.hint, required: field.required, error: errors[field.id] };
                const value = answers[field.id];
                const change = (value: string | string[]) => setAnswers((old) => ({ ...old, [field.id]: value }));
                if (field.type === "checkboxes") return <CheckboxListField key={field.id} {...common} values={Array.isArray(value) ? value : []} options={field.options} onChange={change} />;
                if (field.type === "select") return <SelectField key={field.id} {...common} value={typeof value === "string" ? value : ""} options={field.options} onChange={change} />;
                if (field.type === "textarea") return <TextAreaField key={field.id} {...common} maxLength={4000} value={typeof value === "string" ? value : ""} onChange={(e) => change(e.target.value)} />;
                return <TextField key={field.id} {...common} maxLength={4000} value={typeof value === "string" ? value : ""} onChange={(e) => change(e.target.value)} />;
              })}
            </section>
          ))}
          <section className="rounded-xl border border-white/10 p-5 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold">Contact & Submit</h2>
            <TextField label="Contact name" required maxLength={4000} value={contact.contactName} onChange={(e) => setContact({ ...contact, contactName: e.target.value })} />
            <TextField label="Contact WhatsApp number" required maxLength={4000} value={contact.contactWhatsapp} onChange={(e) => setContact({ ...contact, contactWhatsapp: e.target.value })} />
            <TextField label="WhatsApp number for customer enquiries" required maxLength={4000} value={contact.customerWhatsapp} onChange={(e) => setContact({ ...contact, customerWhatsapp: e.target.value })} />
            <label className="mt-8 flex gap-3 text-sm"><input type="checkbox" required checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />I have reviewed my answers and confirm the information is correct.</label>
          </section>
          {Object.keys(errors).length > 0 && <p role="alert" className="text-sm text-purple">{errors.form ?? "Please check the highlighted questions above."}</p>}
          <button className={`rounded-md bg-purple px-6 py-4 text-sm font-medium disabled:opacity-50 ${focusRing}`} type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit Campaign Setup →"}</button>
        </fieldset>
      </form>
    </div>
  );
}
