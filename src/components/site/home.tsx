import Image from "next/image";
import { ChartColumn, Check, Magnet, MessageCircle, Network, Quote, Target, Workflow } from "lucide-react";
import portrait from "../../../public/potrait.jpeg";
import { InsightCard } from "@/components/site/InsightCard";
import { Eyebrow, PrimaryButton, Section, SectionHeading, TextLink, focus } from "@/components/site/ui";
import Link from "next/link";
import { journey, packages, tools } from "@/lib/content";
import type { Insight } from "@/lib/insights";
import { site } from "@/lib/site";
import { testimonials } from "@/content/testimonials";

const principles = [
  { icon: Target, text: "I start with your real problem, not with a tool" },
  { icon: Workflow, text: "I build around how your business already works" },
  { icon: Network, text: "I connect your website, apps and tools so they work as one" },
];

export function WhyKudziemuks() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <figure className="relative mx-auto w-full max-w-sm lg:mx-0">
          <div className="relative aspect-square">
            {/* Purple arcs around the portrait. */}
            <div aria-hidden className="absolute -inset-4 rotate-[35deg] rounded-full border-[12px] border-transparent border-t-purple border-r-purple/60" />
            <div aria-hidden className="absolute -inset-9 -rotate-[25deg] rounded-full border-[6px] border-transparent border-b-purple/30 border-l-purple/20" />
            <div className="absolute inset-0 overflow-hidden rounded-full border-8 border-canvas shadow-2xl shadow-purple/20">
              <Image
                src={portrait}
                alt={`${site.fullName}, founder of Kudziemuks`}
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 384px, 30vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <figcaption className="relative mt-10 text-center">
            <p className="font-semibold text-fog">{site.fullName}</p>
            <p className="text-sm text-mist">Software engineer · Founder, Kudziemuks</p>
          </figcaption>
        </figure>

        <div>
          <Eyebrow>Why Kudziemuks</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] font-bold tracking-tight text-balance text-fog">
            More customers, not more technology.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg">
            I don&rsquo;t pick a tool first and then look for a use for it. I start with where you&rsquo;re losing
            customers, then set up the tools you need, and build custom software only where the tools fall short.
          </p>
          <ul className="mt-9 space-y-3">
            {principles.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 rounded-xl border border-line bg-panel px-4 py-3.5 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple/10">
                  <Icon aria-hidden className="size-5 text-accent" />
                </span>
                <span className="font-medium text-fog">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-lg font-semibold text-balance text-fog">
              The goal isn&rsquo;t more technology. It&rsquo;s technology that earns its place.
            </p>
            <div className="shrink-0">
              <PrimaryButton href="/start-a-project?solution=customer-leak-audit">Get a Free Leak Audit</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The tools I set up and connect. Names only, no logos. */
export function ToolStrip() {
  return (
    <section aria-label="Tools I work with" className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:gap-8">
        <p className="shrink-0 text-xs font-medium tracking-[0.18em] text-mist uppercase">Tools I set up and connect</p>
        <ul className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li key={tool} className="rounded-full border border-line bg-night px-3.5 py-1.5 text-sm font-medium text-fog">
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const journeyIcons = [Target, Magnet, MessageCircle, ChartColumn];

/** Get chosen → Capture → Convert → Measure: the path every engagement follows. */
export function CustomerJourney() {
  return (
    <Section tone="night" id="how-i-help">
      <SectionHeading
        eyebrow="How I help"
        title="From first impression to closed sale."
        intro="Most businesses don't have a marketing problem. They lose customers between the first impression and the sale. I work on the whole journey."
      />
      <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {journey.map(({ stage, body }, index) => {
          const Icon = journeyIcons.at(index) ?? Target;
          return (
            <li key={stage} className="relative flex flex-col rounded-2xl border border-line bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple/10">
                  <Icon aria-hidden className="size-6 text-accent" />
                </span>
                <span className="text-2xl font-semibold tracking-tight text-fog/20">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-fog">{stage}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{body}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Service packages. Prices are deliberately not shown for now. */
export function Packages() {
  return (
    <Section id="packages">
      <SectionHeading
        eyebrow="Ways to work together"
        title="Start small, or fix the whole journey."
        intro="Most clients start with a free Customer Leak Audit. It shows where customers are slipping away, so you know exactly what to fix first."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <Link
            key={item.slug}
            href={`/start-a-project?solution=${item.slug}`}
            className={`group flex flex-col rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple/10 sm:p-7 ${
              item.highlight ? "border-purple bg-purple/5" : "border-line bg-panel hover:border-purple/50"
            } ${focus}`}
          >
            {item.slug === "customer-leak-audit" ? (
              <span className="mb-4 self-start rounded-full bg-purple px-3 py-1 text-xs font-medium text-white">Start here · Free</span>
            ) : item.highlight ? (
              <span className="mb-4 self-start rounded-full border border-purple px-3 py-1 text-xs font-medium text-accent">Most complete</span>
            ) : null}
            <h3 className="text-lg font-semibold tracking-tight text-fog">{item.title}</h3>
            <p className="mt-1 text-sm text-accent">{item.tagline}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {item.includes.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-mist">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
            <span className="mt-6 text-sm font-medium text-accent group-hover:text-fog">
              {item.slug === "customer-leak-audit" ? "Request your audit" : "Ask about this"} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function ClientTestimonials() {
  const published = testimonials.filter((item) => item.published && item.quote.trim());
  if (!published.length) return null;
  return (
    <Section>
      <div className="text-center">
        <Eyebrow>What clients say</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight font-bold tracking-tight text-fog">
          Trusted by businesses I work with.
        </h2>
      </div>
      <div className={`mx-auto mt-12 grid gap-5 ${published.length === 1 ? "max-w-3xl" : "md:grid-cols-2"}`}>
        {published.map((item) => (
          <figure key={`${item.company}-${item.name}`} className="flex flex-col rounded-2xl border border-line bg-canvas p-8 sm:p-10">
            <Quote aria-hidden className="size-8 text-accent" />
            <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-pretty text-fog">&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
              {item.logo ? (
                <Image src={item.logo} alt="" width={44} height={44} className="size-11 rounded-full bg-white object-contain p-1" />
              ) : null}
              <div>
                <p className="font-semibold text-fog">{[item.name, item.role].filter(Boolean).join(", ")}</p>
                <p className="text-sm text-mist">{item.company}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function LatestInsights({ insights }: { insights: Insight[] }) {
  if (!insights.length) return null;
  return (
    <Section tone="night">
      <SectionHeading
        eyebrow="Latest insights"
        title="Ideas on winning customers with software."
        action={<TextLink href="/insights">View all insights</TextLink>}
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {insights.slice(0, 3).map((insight) => (
          <InsightCard key={insight.slug} insight={insight} />
        ))}
      </div>
    </Section>
  );
}
