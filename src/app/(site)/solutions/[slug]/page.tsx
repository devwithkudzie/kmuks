import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ProjectCard } from "@/components/site/cards";
import { CallToAction, PageIntro, PrimaryButton, Section, SectionHeading, TextLink } from "@/components/site/ui";
import { projectBySlug, solutionBySlug, solutions } from "@/lib/content";

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const solution = solutionBySlug((await params).slug);
  if (!solution) return {};
  return {
    title: solution.title,
    description: solution.intro,
    alternates: { canonical: `/solutions/${solution.slug}` },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const solution = solutionBySlug((await params).slug);
  if (!solution) notFound();
  const project = solution.projectSlug ? projectBySlug(solution.projectSlug) : undefined;
  const others = solutions.filter((item) => item.slug !== solution.slug);

  return (
    <>
      <PageIntro eyebrow={`Solutions · ${solution.stage}`} title={solution.title} image={solution.image}>
        <p>{solution.intro}</p>
        <div className="pt-4">
          <PrimaryButton href={`/start-a-project?solution=${solution.slug}`}>Discuss a Project</PrimaryButton>
        </div>
      </PageIntro>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="The problem" title="Where opportunities get lost." />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-mist sm:text-lg">
              {solution.problem.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">What I build</p>
            <ul className="mt-5 space-y-3">
              {solution.capabilities.map((capability) => (
                <li key={capability} className="flex gap-3 text-fog">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="night">
        <SectionHeading eyebrow="How it works" title="The solution, step by step." />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {solution.approach.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
              <p className="font-mono text-xs text-accent">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-fog">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist sm:text-base">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Who it suits" title="Built for businesses like these." />
            <ul className="mt-8 space-y-4">
              {solution.suits.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line pb-4 text-fog">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-purple/30 bg-purple/10 p-6">
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Example</p>
              <p className="mt-3 text-fog">{solution.example}</p>
            </div>
          </div>
          {project ? (
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Related project</p>
              <div className="mt-5">
                <ProjectCard project={project} />
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      <Section tone="night">
        <SectionHeading eyebrow="Also explore" title="Other solutions" action={<TextLink href="/solutions">All solutions</TextLink>} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {others.map((item) => (
            <TextLink key={item.slug} href={`/solutions/${item.slug}`}>
              {item.title}
            </TextLink>
          ))}
        </div>
      </Section>

      <CallToAction href={`/start-a-project?solution=${solution.slug}`} />
    </>
  );
}
