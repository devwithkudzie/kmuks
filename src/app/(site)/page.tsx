import type { Metadata } from "next";
import Image from "next/image";
import { Bot, ChartColumn, CircleCheck, Magnet, Plug } from "lucide-react";
import heroPhoto from "../../../public/hero.jpg";
import { ProjectCard, SolutionCard } from "@/components/site/cards";
import { CallToAction, Eyebrow, PrimaryButton, SecondaryButton, Section, SectionHeading, TextLink } from "@/components/site/ui";
import { ClientTestimonials, LatestInsights, WhyKudziemuks } from "@/components/site/home";
import { HowIWork } from "@/components/site/HowIWork";
import { projects, solutions } from "@/lib/content";
import { getInsights } from "@/lib/insights";

export const metadata: Metadata = {
  title: { absolute: "Kudziemuks | AI-Powered Software Engineering" },
  description:
    "I build AI-powered software and customer acquisition systems to help businesses capture leads, manage prospects and improve conversion processes.",
  alternates: { canonical: "/" },
};

// Re-check hourly so the latest insights include newly scheduled articles.
export const revalidate = 3600;

const capabilities = [
  { icon: Magnet, title: "Lead generation", body: "Capture more relevant enquiries" },
  { icon: Bot, title: "AI & automation", body: "Reduce manual follow-up" },
  { icon: Plug, title: "Connected systems", body: "Link tools and data" },
  { icon: ChartColumn, title: "Conversion insights", body: "See where deals stall" },
];

// The path of one enquiry through a connected system, shown on the hero photo.
const flow = ["Enquiry captured", "AI qualifies the lead", "Follow-up sent"];

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Purple arcs behind the photo, echoing a growth curve. */}
      <div aria-hidden className="absolute -top-8 -right-8 size-[85%] rounded-full border-[14px] border-purple/15" />
      <div aria-hidden className="absolute -bottom-10 -left-6 size-40 rounded-full border-[10px] border-purple/25" />
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] shadow-2xl shadow-purple/20">
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
      <div className="absolute -bottom-8 left-4 w-64 rounded-2xl border border-line bg-canvas p-4 shadow-xl shadow-purple/15 sm:left-8">
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
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#f7f5fd_0%,#ffffff_70%)]">
        <div className="relative mx-auto grid max-w-6xl gap-16 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-24">
          <div>
            <div className="animate-fade-up">
              <Eyebrow>Software · AI · Growth systems</Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 text-[clamp(2.4rem,6.2vw,4.1rem)] leading-[1.04] font-bold tracking-[-0.035em] text-balance text-fog"
              style={{ animationDelay: "0.1s" }}
            >
              I engineer systems that help businesses <span className="text-accent">win customers.</span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-pretty text-mist sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
              I build AI-powered software and customer acquisition systems that help businesses capture leads, manage
              prospects and improve conversion processes.
            </p>
            <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
              <PrimaryButton href="/start-a-project">Discuss a Project</PrimaryButton>
              <SecondaryButton href="/projects">Explore My Work</SecondaryButton>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section aria-label="What I help with" className="border-b border-line bg-canvas">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-line lg:py-12">
          {capabilities.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-4 lg:justify-center lg:px-6">
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
          title="Software solutions built around business growth."
          intro="I build custom software, AI-powered applications and connected business systems that help companies attract customers, manage sales processes and operate more efficiently."
          action={<TextLink href="/solutions">View all solutions</TextLink>}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </div>
      </Section>

      <WhyKudziemuks />
      <HowIWork />
      <ClientTestimonials />

      <Section>
        <SectionHeading
          eyebrow="Projects"
          title="Engineering real business capabilities."
          intro="Real systems and clearly labelled concepts — showing how I approach business problems with software."
          action={<TextLink href="/projects">View all projects</TextLink>}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <LatestInsights insights={getInsights()} />

      <CallToAction />
    </>
  );
}
