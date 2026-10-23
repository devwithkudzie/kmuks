import type { Metadata } from "next";
import Image from "next/image";
import { ChartColumn, CircleCheck, Magnet, MessageCircle, Target } from "lucide-react";
import heroPhoto from "../../../public/hero.jpg";
import { CaseStudyCard, SolutionCard } from "@/components/site/cards";
import { CallToAction, Eyebrow, PrimaryButton, SecondaryButton, Section, SectionHeading, TextLink } from "@/components/site/ui";
import { ClientTestimonials, CustomerJourney, LatestInsights, Packages, ToolStrip, WhyKudziemuks } from "@/components/site/home";
import { solutions } from "@/lib/content";
import { featuredCaseStudies } from "@/content/case-studies";
import { getInsights } from "@/lib/insights";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

// Re-check hourly so the latest insights include newly scheduled articles.
export const revalidate = 3600;

// Get chosen → Capture → Convert → Measure, at a glance.
const capabilities = [
  { icon: Target, title: "Get chosen", body: "Be the business people pick" },
  { icon: Magnet, title: "Capture", body: "Never miss an enquiry" },
  { icon: MessageCircle, title: "Convert", body: "Follow up automatically" },
  { icon: ChartColumn, title: "Measure", body: "See what makes you money" },
];

// The path of one enquiry through a connected system, shown on the hero photo.
const flow = ["Enquiry captured", "AI qualifies the lead", "Follow-up sent"];

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* The photo is pinned like a sheet of paper on the grid, top corner folded. */}
      <div className="drop-shadow-2xl">
        <figure className="paper-fold rounded-2xl border border-line bg-white p-3 sm:p-4">
          <div className="relative aspect-[4/3.2] overflow-hidden rounded-xl">
            <Image
              src={heroPhoto}
              alt="Two colleagues reviewing work together at a computer"
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-[60%_center]"
            />
          </div>
          {/* Right-aligned: the floating card below overlaps the caption's left side. */}
          <figcaption className="px-1 pt-3 text-right font-mono text-[0.68rem] tracking-[0.14em] text-mist uppercase">
            Fig. 01 · kudziemuks
          </figcaption>
        </figure>
      </div>
      <div className="absolute -bottom-10 -left-2 w-64 -rotate-2 rounded-2xl border border-line bg-white/95 p-4 shadow-xl shadow-purple/15 backdrop-blur sm:-left-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-fog">From enquiry to customer</p>
          <span className="inline-flex items-center gap-1 text-[0.7rem] text-emerald-700">
            <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" /> Live
          </span>
        </div>
        <ol className="mt-3 space-y-2">
          {flow.map((step) => (
            <li key={step} className="flex items-center gap-2 text-xs text-mist">
              <CircleCheck aria-hidden className="size-4 shrink-0 text-accent" />
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="field-grid overflow-hidden border-b border-line">
        <div className="relative mx-auto grid max-w-6xl gap-16 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-24">
          <div>
            <div className="animate-fade-up">
              <Eyebrow>Positioning · CRM · Automation</Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 text-[clamp(2.6rem,6.2vw,4.2rem)] leading-[1] font-bold tracking-[-0.05em] text-balance text-fog"
              style={{ animationDelay: "0.1s" }}
            >
              I help businesses{" "}
              {/* A lime highlighter stroke under the promise. */}
              <span className="-mx-1 box-decoration-clone bg-[linear-gradient(transparent_62%,rgb(217_249_157)_62%,rgb(217_249_157)_90%,transparent_90%)] px-1 text-accent">
                win more customers.
              </span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-pretty text-mist sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
              Positioning that gets you chosen, and systems that make sure no enquiry slips away before it becomes a
              sale.
            </p>
            <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
              <PrimaryButton href="/start-a-project?solution=customer-leak-audit">Get a Free Customer Leak Audit</PrimaryButton>
              <SecondaryButton href="/case-studies">See Case Studies</SecondaryButton>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section aria-label="What I help with" className="border-b border-line bg-canvas">
        {/* Phones: a swipeable row that snaps item by item. Large screens: four columns. */}
        <ul className="hero-rail-scroll mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 py-8 sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line lg:overflow-visible lg:py-12">
          {capabilities.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex w-[70%] shrink-0 snap-start items-center gap-4 rounded-2xl border border-line bg-night px-4 py-4 sm:w-[42%] lg:w-auto lg:justify-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-6 lg:py-0"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple/10">
                <Icon aria-hidden className="size-6 text-accent" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-fog">{title}</span>
                <span className="block text-sm text-mist">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Section tone="night">
        <SectionHeading
          eyebrow="Solutions"
          title="Systems that turn enquiries into sales."
          intro="Capture every enquiry, follow up on every lead, and see exactly which marketing makes you money. I set up and connect the tools, and build custom software where the tools fall short."
          action={<TextLink href="/solutions">View all solutions</TextLink>}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </div>
      </Section>

      <ToolStrip />
      <CustomerJourney />
      <Packages />
      <WhyKudziemuks />
      <ClientTestimonials />

      <Section>
        <SectionHeading
          eyebrow="Case studies"
          title="Engineering real business capabilities."
          intro="Professional work and my own products — the problem, how I solved it and how it's built."
          action={<TextLink href="/case-studies">View all case studies</TextLink>}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredCaseStudies().map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </Section>

      <LatestInsights insights={getInsights()} />

      <CallToAction />
    </>
  );
}
