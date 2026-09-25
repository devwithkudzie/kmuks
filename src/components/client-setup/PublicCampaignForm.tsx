"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import { site } from "@/lib/site";
import { validateAnswers, type FormTemplate, type TemplateAnswers } from "@/lib/client-setup/templates";
import { focusRing } from "./styles";
import { TemplateFieldInput } from "./TemplateFields";
import { markFormSubmitted, redirectIfSubmitted } from "./submitted";

export type Utm = { source: string; medium: string; campaign: string; content: string };

export function PublicCampaignForm({ token, template, product, utm }: {
  token: string;
  template: FormTemplate;
  product: string;
  utm: Utm;
}) {
  const { copy } = template;
  const [answers, setAnswers] = useState<TemplateAnswers>({});
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // sessionStorage only exists after mount; show the form unless this tab already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!redirectIfSubmitted(token)) setReady(true);
  }, [token]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const checked = validateAnswers(template, answers);
    if (Object.keys(checked.errors).length) {
      setErrors(checked.errors);
      setFormError("Please check the highlighted questions.");
      document.getElementById(`field-${Object.keys(checked.errors)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({}); setFormError(undefined); setBusy(true);
    try {
      const response = await fetch("/api/campaigns/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers, utm, website }),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.error ?? "Could not send your application. Please try again.");
        return;
      }
      markFormSubmitted(token);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const minutes = Math.max(1, Math.round((template.fields.length * 15) / 60));
  const cardClass =
    "border-y border-white/10 bg-night px-5 py-8 sm:rounded-2xl sm:border sm:px-8 sm:py-10 sm:shadow-2xl sm:shadow-black/40";

  if (!ready) return null;

  if (done) {
    return (
      <div className="mx-auto w-full max-w-xl sm:px-6 sm:py-16">
        <div
          role="status"
          className="bg-night px-5 py-16 text-center sm:rounded-2xl sm:border sm:border-white/10 sm:px-8 sm:py-12 sm:shadow-2xl sm:shadow-black/40"
        >
          <CheckCircle2 aria-hidden className="mx-auto size-12 text-purple-300" />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-balance text-fog sm:text-3xl">
            {copy.successHeading || "Thank you!"}
          </h1>
          {copy.successBody ? (
            <p className="mt-3 text-base leading-relaxed text-pretty text-mist">{copy.successBody}</p>
          ) : null}
          <Link
            href="/"
            className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-purple px-6 text-base font-semibold text-white transition hover:bg-violet sm:w-auto ${focusRing}`}
          >
            Visit kudziemuks.com →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl pb-10 sm:px-6 sm:py-14">
      <div className="px-5 pt-8 text-center sm:px-0 sm:pt-0">
        <p className="inline-flex rounded-full border border-purple/40 bg-purple/10 px-3 py-1 text-xs font-medium text-purple-200">
          {template.name}
        </p>
        <h1 className="mt-4 text-[clamp(1.75rem,6vw,2.5rem)] leading-tight font-bold tracking-tight text-balance text-fog">
          {copy.heading || template.name}
        </h1>
        {copy.intro
          ? copy.intro.split(/\n{2,}/).map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-relaxed text-pretty text-mist">{paragraph}</p>
            ))
          : null}

      </div>

      <form onSubmit={submit} noValidate className={`${cardClass} mt-8`}>
        <div className="mb-7 flex items-center justify-between gap-4 text-xs text-mist">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" /> Takes about {minutes} minute{minutes === 1 ? "" : "s"}
          </span>
          <span><span className="text-purple-300">*</span> Required</span>
        </div>
        <fieldset disabled={busy}>
          {template.fields.map((field) => (
            <div key={field.id} id={`field-${field.id}`} className="mt-7 scroll-mt-24 first:mt-0">
              <TemplateFieldInput
                template={template}
                field={field}
                answers={answers}
                product={product}
                error={errors[field.id]}
                onChange={(next) => setAnswers((old) => ({ ...old, [field.id]: next }))}
              />
            </div>
          ))}

          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>

          {formError ? (
            <p role="alert" className="mt-8 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            className={`mt-8 inline-flex min-h-13 w-full items-center justify-center rounded-lg bg-purple px-6 text-base font-semibold text-white shadow-lg shadow-purple/20 transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {busy ? "Sending…" : copy.submitLabel || "Submit"}
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-mist">
            <Lock aria-hidden className="size-3.5 shrink-0" />
            Your details are sent securely, straight to {site.handle}.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
