"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { trackCta } from "@/lib/track";
import { site, whatsappHref, type SocialProfile } from "@/lib/site";

type IntakeContextValue = {
  open: (source: string) => void;
};

const IntakeContext = createContext<IntakeContextValue | null>(null);

const onlinePlatforms = [
  { id: "Website", prefix: "", placeholder: "yourbusiness.com" },
  { id: "Facebook", prefix: "facebook.com/", placeholder: "yourbusiness" },
  { id: "Instagram", prefix: "instagram.com/", placeholder: "yourbusiness" },
  { id: "LinkedIn", prefix: "linkedin.com/", placeholder: "company/yourbusiness" },
  { id: "TikTok", prefix: "tiktok.com/@", placeholder: "yourbusiness" },
  { id: "X", prefix: "x.com/", placeholder: "yourbusiness" },
] as const;

const field =
  "mt-2 w-full rounded-md border border-white/5 bg-night px-4 py-3 text-sm text-fog outline-none transition placeholder:text-mist/50 focus:bg-white/10 focus:ring-2 focus:ring-purple";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

export function useWhatsAppIntake() {
  const context = useContext(IntakeContext);
  if (!context) {
    throw new Error("useWhatsAppIntake must be used inside WhatsAppIntakeProvider");
  }
  return context;
}

export function WhatsAppButton({
  source,
  onOpen,
  className,
  children,
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  source: string;
  onOpen?: () => void;
}) {
  const { open } = useWhatsAppIntake();

  return (
    <button
      type={type}
      className={className}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onOpen?.();
        open(source);
      }}
    >
      {children}
    </button>
  );
}

export function WhatsAppIntakeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("work-with-me");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [businessDescription, setBusinessDescription] = useState("");
  const [onlineProfiles, setOnlineProfiles] = useState<SocialProfile[]>([]);

  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setStep(1);
    setName("");
    setBusinessName("");
    setWhatsapp("");
    setHoneypot("");
    setSubmitting(false);
    setSubmitError("");
    setBusinessDescription("");
    setOnlineProfiles([]);
  };

  const openIntake = useCallback((nextSource: string) => {
    setSource(nextSource);
    resetForm();
    setOpen(true);
  }, []);

  const closeIntake = useCallback(() => {
    setOpen(false);
    resetForm();
  }, []);

  const togglePlatform = (platformId: string) => {
    setOnlineProfiles((prev) =>
      prev.some((profile) => profile.platform === platformId)
        ? prev.filter((profile) => profile.platform !== platformId)
        : [...prev, { platform: platformId, url: "" }],
    );
  };

  const updateProfileUrl = (platformId: string, url: string) => {
    setOnlineProfiles((prev) =>
      prev.map((profile) =>
        profile.platform === platformId ? { ...profile, url } : profile,
      ),
    );
  };

  useEffect(() => {
    if (!open) return;

    firstFieldRef.current?.focus();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeIntake();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeIntake]);

  const onContinueStep1 = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !businessName.trim() || !whatsapp.trim()) return;
    setStep(2);
  };

  const onContinueStep2 = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!businessDescription.trim()) return;
    setStep(3);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const fullOnlineProfiles = onlineProfiles
      .filter((profile) => profile.url.trim())
      .map((profile) => ({
        platform: profile.platform,
        url: `${onlinePlatforms.find((p) => p.id === profile.platform)?.prefix ?? ""}${profile.url.trim()}`,
      }));
    const query = new URLSearchParams(window.location.search);

    try {
      const response = await fetch("/api/work-with-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          page: window.location.pathname,
          name: name.trim(),
          businessName: businessName.trim(),
          whatsapp: whatsapp.trim(),
          businessDescription: businessDescription.trim(),
          onlineProfiles: fullOnlineProfiles,
          utm: {
            source: query.get("utm_source") ?? "",
            medium: query.get("utm_medium") ?? "",
            campaign: query.get("utm_campaign") ?? "",
          },
          website: honeypot,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(body.error ?? "Could not send your details. Please try again.");
        return;
      }
      trackCta("form");
      setStep(4);
    } catch {
      setSubmitError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IntakeContext.Provider value={{ open: openIntake }}>
      {children}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-80 overflow-y-auto bg-canvas text-fog"
        >
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgb(109_40_217/0.18),transparent_55%)]"
          />

          <button
            type="button"
            aria-label="Close"
            onClick={closeIntake}
            className="fixed top-5 right-5 z-10 inline-flex size-10 items-center justify-center text-mist transition hover:bg-white/10 hover:text-fog"
          >
            <X className="size-6" aria-hidden />
          </button>

          <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-24 sm:px-0">
            {step === 1 ? (
              <form onSubmit={onContinueStep1}>
                <p className="text-[0.7rem] font-medium tracking-[0.16em] text-purple uppercase">
                  Step 1 of 3
                </p>
                <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight">
                  About you
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Let&rsquo;s start with the basics.
                </p>

                <label className="mt-6 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                  Name
                  <input
                    ref={firstFieldRef}
                    required
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className={field}
                  />
                </label>

                <label className="mt-4 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                  Business name
                  <input
                    required
                    name="businessName"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your business name"
                    className={field}
                  />
                </label>

                <label className="mt-4 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                  WhatsApp number
                  <input
                    required
                    type="tel"
                    name="whatsapp"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="\+?[\d\s()\-]{7,20}"
                    title="Enter a valid WhatsApp number, e.g. +263 77 000 0000"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    placeholder="e.g. +263 77 000 0000"
                    className={field}
                  />
                </label>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
                  >
                    Continue →
                  </button>
                </div>
              </form>
            ) : step === 2 ? (
              <form onSubmit={onContinueStep2}>
                <p className="text-[0.7rem] font-medium tracking-[0.16em] text-purple uppercase">
                  Step 2 of 3
                </p>
                <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight">
                  About your business
                </h2>

                <label className="mt-6 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                  What does your business do?
                  <textarea
                    required
                    name="businessDescription"
                    rows={6}
                    value={businessDescription}
                    onChange={(event) => setBusinessDescription(event.target.value)}
                    placeholder="Tell me briefly what you sell or offer"
                    className={`${field} resize-y`}
                  />
                </label>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
                  >
                    Continue →
                  </button>
                </div>
              </form>
            ) : step === 3 ? (
              <form onSubmit={onSubmit}>
                <p className="text-[0.7rem] font-medium tracking-[0.16em] text-purple uppercase">
                  Step 3 of 3
                </p>
                <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight">
                  Where can I find your business online?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  All optional — tap any that apply.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {onlinePlatforms.map((platform) => {
                    const active = onlineProfiles.some(
                      (profile) => profile.platform === platform.id,
                    );
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => togglePlatform(platform.id)}
                        className={`rounded-lg px-4 py-2 text-sm transition ${
                          active
                            ? "bg-purple text-white"
                            : "bg-night text-mist hover:bg-white/10 hover:text-fog"
                        }`}
                      >
                        {platform.id}
                      </button>
                    );
                  })}
                </div>

                {onlineProfiles.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {onlineProfiles.map((profile) => {
                      const platformInfo = onlinePlatforms.find(
                        (p) => p.id === profile.platform,
                      );
                      return (
                        <div key={profile.platform} className="flex items-center gap-3">
                          <label
                            htmlFor={`online-${profile.platform}`}
                            className="w-20 shrink-0 text-[0.7rem] tracking-[0.16em] text-mist uppercase"
                          >
                            {profile.platform}
                          </label>
                          <div className="flex flex-1 items-center rounded-md border border-white/5 bg-night transition focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-purple">
                            {platformInfo?.prefix ? (
                              <span className="pl-4 text-sm text-mist/70 select-none">
                                {platformInfo.prefix}
                              </span>
                            ) : null}
                            <input
                              id={`online-${profile.platform}`}
                              value={profile.url}
                              onChange={(event) =>
                                updateProfileUrl(profile.platform, event.target.value)
                              }
                              placeholder={platformInfo?.placeholder}
                              className={`min-w-0 flex-1 bg-transparent py-3 pr-4 text-sm text-fog outline-none placeholder:text-mist/50 ${
                                platformInfo?.prefix ? "pl-1" : "pl-4"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Honeypot: invisible to people, tempting to bots. */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
                  </label>
                </div>

                {submitError ? (
                  <p role="alert" className="mt-6 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {submitError}
                  </p>
                ) : null}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
                  >
                    {submitting ? "Sending…" : "Get My Free Customer Growth Review"}
                  </button>
                </div>
              </form>
            ) : (
              <div role="status" className="text-center">
                <p className="text-[0.7rem] font-medium tracking-[0.16em] text-purple uppercase">Received</p>
                <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight">
                  Thanks, {name.trim().split(/\s+/)[0]}!
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  I&rsquo;ve got your details for {businessName.trim()}. I&rsquo;ll review your business and message
                  you on WhatsApp at {whatsapp.trim()}.
                </p>
                <button
                  type="button"
                  onClick={closeIntake}
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
                >
                  Back to the site
                </button>
                <a
                  href={whatsappHref(source)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-mist underline-offset-4 hover:text-fog hover:underline"
                >
                  Prefer to chat now? Message {site.handle} on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </IntakeContext.Provider>
  );
}
