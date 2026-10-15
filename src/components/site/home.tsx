import Image from "next/image";
import { Network, Quote, Sparkles, Target, Workflow } from "lucide-react";
import portrait from "../../../public/potrait.jpeg";
import { InsightCard } from "@/components/site/InsightCard";
import { Eyebrow, PrimaryButton, Section, SectionHeading, TextLink } from "@/components/site/ui";
import type { Insight } from "@/lib/insights";
import { site } from "@/lib/site";
import { testimonials } from "@/content/testimonials";

const principles = [
  {
    icon: Target,
    title: "Business outcomes first",
    body: "I focus on the underlying challenge — whether that's losing leads, managing referrals, repetitive work or disconnected business systems — before deciding what to build.",
  },
  {
    icon: Workflow,
    title: "Engineered around your process",
    body: "I build and integrate solutions around the way your business operates, rather than forcing every problem into the same off-the-shelf workflow.",
  },
  {
    icon: Sparkles,
    title: "AI with a clear purpose",
    body: "I use AI where it can make a process more useful or efficient, combining it with conventional software and automation where those are the better fit.",
  },
  {
    icon: Network,
    title: "Connected, practical systems",
    body: "I look beyond individual features to how websites, applications, data and business tools work together across the customer journey.",
  },
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
            Technology should solve a business problem.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg">
            I don&rsquo;t start with a tool and look for a reason to use it. I start by understanding the problem, then
            engineer a solution around what the business actually needs.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-purple/40 bg-purple/10">
                  <Icon aria-hidden className="size-5 text-accent" />
                </span>
                <div>
                  <h3 className="font-semibold text-fog">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-lg font-semibold text-balance text-fog">
              The goal isn&rsquo;t more technology. It&rsquo;s technology that earns its place.
            </p>
            <div className="shrink-0">
              <PrimaryButton href="/start-a-project">Discuss a Project</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
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
