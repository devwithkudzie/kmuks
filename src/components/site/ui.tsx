import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

const buttonBase = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-[0.95rem] font-semibold transition ${focus}`;

/** Ink pill that turns purple on hover. */
export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${buttonBase} bg-fog px-7 text-white shadow-lg shadow-fog/10 hover:bg-purple`}>
      {children}
      <ArrowUpRight aria-hidden className="size-4" />
    </Link>
  );
}

/** Quiet text link with an arrow, sitting beside a primary button. */
export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`group ${buttonBase} px-2 text-fog hover:text-accent`}>
      {children}
      <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:text-fog ${focus}`}
    >
      {children}
      <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[0.72rem] font-semibold tracking-[0.22em] text-mist uppercase">
      <span aria-hidden className="size-1.5 shrink-0 bg-purple" />
      {children}
    </p>
  );
}

/** Section opener: eyebrow, heading and optional intro, with an optional link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-fog">
          {title}
        </Heading>
        {intro ? <p className="mt-5 text-base leading-relaxed text-pretty text-mist sm:text-lg">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Top of an inner page. */
export function PageIntro({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  image?: { src: string; alt: string };
}) {
  return (
    <section className="field-grid border-b border-line">
      <div
        className={`mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20 ${image ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}
      >
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-fog">
            {title}
          </h1>
          {children ? <div className="mt-7 max-w-2xl space-y-4 text-base leading-relaxed text-mist sm:text-lg">{children}</div> : null}
        </div>
        {image ? (
          {/* The shadow sits on a wrapper: the folded corner's clip would cut it off the card itself. */}
          <div className="drop-shadow-xl">
            <div className="paper-fold rounded-2xl border border-line bg-white p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={image.src} alt={image.alt} fill preload sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const sectionTones = {
  canvas: "bg-canvas",
  night: "bg-night",
  // The drafting grid from the hero, softened, for sections that explain a process.
  grid: "field-grid field-grid-soft",
};

export function Section({ children, tone = "canvas", id }: { children: ReactNode; tone?: keyof typeof sectionTones; id?: string }) {
  return (
    <section id={id} className={`border-t border-line ${sectionTones[tone]}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">{children}</div>
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line px-3 py-1 text-xs text-mist">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Closing call to action used at the bottom of pages. */
export function CallToAction({
  title = "Where are you losing customers?",
  body = "Get a free Customer Leak Audit. I'll check how your business handles enquiries, what happens after a quote, and where customers slip away, then show you what to fix first.",
  href = "/start-a-project?solution=customer-leak-audit",
  label = "Get a Free Customer Leak Audit",
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="field-grid field-grid-soft border-t border-line">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <h2 className="text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.08] font-bold tracking-[-0.04em] text-balance text-fog">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg">{body}</p>
        <div className="mt-9 flex justify-center">
          <PrimaryButton href={href}>{label}</PrimaryButton>
        </div>
        <p className="mt-4 text-xs text-mist">No assumptions about the solution before understanding the problem.</p>
      </div>
    </section>
  );
}
