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
import { trackCta } from "@/lib/track";
import { whatsappHref } from "@/lib/site";

type IntakeContextValue = {
  open: (source: string) => void;
};

const IntakeContext = createContext<IntakeContextValue | null>(null);

const packageChoices = [
  { id: "thought-leader", label: "Thought Leader" },
  { id: "growth-engine", label: "Growth Engine" },
  { id: "pan-african", label: "Pan-African Authority" },
] as const;

const packageIds: Set<string> = new Set(packageChoices.map((item) => item.id));

const field =
  "mt-2 w-full rounded-lg border border-white/10 bg-night px-4 py-3 text-sm text-fog outline-none transition placeholder:text-mist/50 focus:border-purple";

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
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [interest, setInterest] = useState("");
  const [other, setOther] = useState("");
  const [interestError, setInterestError] = useState(false);
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const otherSelected = interest === "other";

  const resetForm = () => {
    setName("");
    setRole("");
    setInterest("");
    setOther("");
    setInterestError(false);
  };

  const openIntake = useCallback((nextSource: string) => {
    setSource(nextSource);
    setInterest(packageIds.has(nextSource) ? nextSource : "");
    setOther("");
    setInterestError(false);
    setOpen(true);
  }, []);

  const closeIntake = useCallback(() => {
    setOpen(false);
    resetForm();
  }, []);

  const selectInterest = (id: string) => {
    setInterestError(false);
    setInterest(id);
    if (id !== "other") setOther("");
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!interest) {
      setInterestError(true);
      return;
    }
    if (otherSelected && !other.trim()) return;

    const label =
      interest === "other"
        ? "Other"
        : (packageChoices.find((item) => item.id === interest)?.label ?? interest);

    trackCta("whatsapp");
    window.open(
      whatsappHref(source, {
        name: name.trim(),
        role: role.trim(),
        interests: [label],
        other: otherSelected ? other.trim() : undefined,
      }),
      "_blank",
      "noopener,noreferrer",
    );
    closeIntake();
  };

  return (
    <IntakeContext.Provider value={{ open: openIntake }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
            onClick={closeIntake}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[min(40rem,90svh)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-canvas text-fog shadow-[0_24px_80px_rgb(0_0_0/0.55)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(109_40_217/0.18),transparent_55%)]"
            />
            <form className="relative px-5 py-6 sm:px-6 sm:py-7" onSubmit={onSubmit}>
              <h2
                id={titleId}
                className="text-2xl font-bold tracking-tight"
              >
                Let’s start with what you need.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Tell me a little about what you&rsquo;re working on and what
                you&rsquo;d like help with.
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
                  className={field}
                />
              </label>

              <label className="mt-4 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                What I do
                <input
                  required
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Founder, consultant, agency…"
                  className={field}
                />
              </label>

              <fieldset className="mt-5">
                <legend className="text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                  Packages I’m interested in
                </legend>
                <ul className="mt-3 space-y-2">
                  {packageChoices.map((item) => (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-night/60 px-3 py-3 text-sm text-fog">
                        <input
                          type="radio"
                          name="interest"
                          checked={interest === item.id}
                          onChange={() => selectInterest(item.id)}
                          className="size-4 accent-purple"
                        />
                        {item.label}
                      </label>
                    </li>
                  ))}
                  <li>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-night/60 px-3 py-3 text-sm text-fog">
                      <input
                        type="radio"
                        name="interest"
                        checked={otherSelected}
                        onChange={() => selectInterest("other")}
                        className="size-4 accent-purple"
                      />
                      Other
                    </label>
                  </li>
                </ul>
                {interestError ? (
                  <p className="mt-2 text-sm text-purple">
                    Select a package, or Other.
                  </p>
                ) : null}
                {otherSelected ? (
                  <label className="mt-3 block text-[0.7rem] tracking-[0.16em] text-mist uppercase">
                    Tell me what you’re interested in
                    <textarea
                      required
                      name="other"
                      rows={3}
                      value={other}
                      onChange={(event) => setOther(event.target.value)}
                      placeholder="What you need help with…"
                      className={`${field} resize-none`}
                    />
                  </label>
                ) : null}
              </fieldset>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeIntake}
                  className={`inline-flex min-h-12 items-center justify-center px-3 text-sm text-mist transition hover:text-fog ${focus}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </IntakeContext.Provider>
  );
}
