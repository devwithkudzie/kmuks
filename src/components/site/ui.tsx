import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

const buttonBase = `inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium transition ${focus}`;

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${buttonBase} bg-purple text-white hover:bg-violet`}>
      {children}
      <ArrowUpRight aria-hidden className="size-4" />
    </Link>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${buttonBase} border border-line text-fog hover:border-fog/40 hover:bg-night`}>
      {children}
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
  return <p className="text-[0.7rem] font-medium tracking-[0.24em] text-accent uppercase">{children}</p>;
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
        <Heading className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] font-bold tracking-tight text-balance text-fog">
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
    <section className="border-b border-line bg-[linear-gradient(180deg,#f7f5fd_0%,#ffffff_75%)]">
      <div
        className={`mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20 ${image ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}
      >
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance text-fog">
            {title}
          </h1>
          {children ? <div className="mt-7 max-w-2xl space-y-4 text-base leading-relaxed text-mist sm:text-lg">{children}</div> : null}
        </div>
        {image ? (
          <div className="relative">
            <div aria-hidden className="absolute -top-5 -right-5 size-2/3 rounded-full border-[10px] border-purple/15" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl shadow-purple/15">
              <Image src={image.src} alt={image.alt} fill preload sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Section({ children, tone = "canvas", id }: { children: ReactNode; tone?: "canvas" | "night"; id?: string }) {
  return (
    <section id={id} className={`border-t border-line ${tone === "night" ? "bg-night" : "bg-canvas"}`}>
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
  title = "Have a customer acquisition problem worth solving?",
  body = "Tell me where your current process breaks down, what you want to improve and what the business needs to achieve. I'll help you work out whether custom software, AI integration or automation is the right approach.",
  href = "/start-a-project",
}: {
  title?: string;
  body?: string;
  href?: string;
}) {
  return (
    <section className="border-t border-line bg-[radial-gradient(ellipse_at_bottom,rgb(109_40_217/0.12),transparent_65%)]">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <h2 className="text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] font-bold tracking-tight text-balance text-fog">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg">{body}</p>
        <div className="mt-9 flex justify-center">
          <PrimaryButton href={href}>Discuss a Project</PrimaryButton>
        </div>
        <p className="mt-4 text-xs text-mist">No assumptions about the solution before understanding the problem.</p>
      </div>
    </section>
  );
}
