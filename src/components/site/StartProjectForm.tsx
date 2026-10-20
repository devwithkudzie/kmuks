"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/client-setup/fields";
import { focusRing } from "@/components/client-setup/styles";
import { markFormSubmitted, redirectIfSubmitted } from "@/components/client-setup/submitted";
import { BUDGETS, TIMELINES } from "@/lib/enquiry";
import { site } from "@/lib/site";
import { trackCta } from "@/lib/track";

type Option = { slug: string; title: string };
type Values = {
  name: string;
  email: string;
  phone: string;
  company: string;
  solution: string;
  goal: string;
  problem: string;
  tools: string;
  timeline: string;
  budget: string;
};

const SUBMITTED_KEY = "start-a-project";
const NOT_SURE = "Not sure yet";

export function StartProjectForm({ solutions, initialSolution }: { solutions: Option[]; initialSolution: string }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    company: "",
    solution: initialSolution,
    goal: "",
    problem: "",
    tools: "",
    timeline: "",
    budget: "",
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // sessionStorage only exists after mount; show the form unless this tab already sent one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!redirectIfSubmitted(SUBMITTED_KEY)) setReady(true);
  }, []);

  const set = (key: keyof Values) => (value: string) => setValues((old) => ({ ...old, [key]: value }));
  const solutionTitles = [...solutions.map((solution) => solution.title), NOT_SURE];
  const selectedTitle = solutions.find((solution) => solution.slug === values.solution)?.title ?? (values.solution === "" ? "" : NOT_SURE);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    setErrors({});
    const query = new URLSearchParams(window.location.search);
    try {
      const response = await fetch("/api/start-a-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          page: window.location.pathname,
          utm: {
            source: query.get("utm_source") ?? "",
            medium: query.get("utm_medium") ?? "",
            campaign: query.get("utm_campaign") ?? "",
          },
          website,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.error ?? "Could not send your enquiry. Please try again.");
        const first = Object.keys(body.fieldErrors ?? {})[0];
        if (first) document.getElementById(`enquiry-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      trackCta("project-enquiry");
      markFormSubmitted(SUBMITTED_KEY);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <div className="min-h-[40rem]" aria-hidden />;

  if (done) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-night px-6 py-14 text-center sm:px-10">
        <CheckCircle2 aria-hidden className="mx-auto size-12 text-accent" />
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-fog sm:text-3xl">Enquiry sent.</h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-mist">
          Thank you for sharing the details. I&rsquo;ll review your enquiry and follow up about the next steps.
        </p>
        <Link
          href="/case-studies"
          className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet ${focusRing}`}
        >
          See case studies
        </Link>
      </div>
    );
  }

  const wrap = (key: string, node: React.ReactNode) => (
    <div id={`enquiry-${key}`} className="scroll-mt-24">
      {node}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-night p-5 sm:p-8">
      <p className="text-xs text-mist">
        <span className="text-accent">*</span> Required
      </p>
      <fieldset disabled={busy} className="mt-6 space-y-7">
        <div className="grid gap-7 sm:grid-cols-2">
          {wrap("name", <TextField label="Name" required autoComplete="name" maxLength={120} value={values.name} onChange={(e) => set("name")(e.target.value)} placeholder="e.g. Tendai Moyo" error={errors.name} />)}
          {wrap("email", <TextField label="Work email" required type="email" autoComplete="email" maxLength={200} value={values.email} onChange={(e) => set("email")(e.target.value)} placeholder="you@company.com" error={errors.email} />)}
          {wrap("company", <TextField label="Company or business" required autoComplete="organization" maxLength={160} value={values.company} onChange={(e) => set("company")(e.target.value)} placeholder="e.g. Fresh Cuts Barbershop" error={errors.company} />)}
          {wrap("phone", <TextField label="Phone or WhatsApp" optional type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={values.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="e.g. +263 77 000 0000" error={errors.phone} />)}
        </div>
        {wrap(
          "solution",
          <SelectField
            label="What are you interested in?"
            optional
            value={selectedTitle}
            options={solutionTitles}
            placeholder="Choose one…"
            onChange={(title) => set("solution")(solutions.find((solution) => solution.title === title)?.slug ?? (title ? "not-sure" : ""))}
          />,
        )}
        {wrap("goal", <TextAreaField label="What are you trying to achieve?" required maxLength={2000} rows={3} value={values.goal} onChange={(e) => set("goal")(e.target.value)} placeholder="e.g. Track which marketers bring in our customers and pay commission accurately." error={errors.goal} />)}
        {wrap("problem", <TextAreaField label="What is the main problem?" required maxLength={2000} rows={3} value={values.problem} onChange={(e) => set("problem")(e.target.value)} placeholder="e.g. Enquiries come in on WhatsApp and we lose track of who followed up." error={errors.problem} />)}
        {wrap("tools", <TextAreaField label="What systems or tools do you currently use?" optional maxLength={1000} rows={2} value={values.tools} onChange={(e) => set("tools")(e.target.value)} placeholder="e.g. WhatsApp Business, Google Sheets, Facebook ads" error={errors.tools} />)}
        <div className="grid gap-7 sm:grid-cols-2">
          {wrap("timeline", <SelectField label="Expected timeline" optional value={values.timeline} options={TIMELINES} placeholder="Choose…" onChange={set("timeline")} />)}
          {wrap("budget", <SelectField label="Indicative budget" optional value={values.budget} options={BUDGETS} placeholder="Choose…" onChange={set("budget")} />)}
        </div>

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        {formError ? (
          <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            className={`inline-flex min-h-13 w-full items-center justify-center rounded-lg bg-purple px-6 text-base font-semibold text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}
          >
            {busy ? "Sending…" : "Send Enquiry"}
          </button>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-mist">
            <Lock aria-hidden className="size-3.5 shrink-0" />
            Your details are sent securely, straight to {site.handle}.
          </p>
        </div>
      </fieldset>
    </form>
  );
}
