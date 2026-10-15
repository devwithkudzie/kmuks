import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { StatusBadge } from "@/components/site/cards";
import { CallToAction, Eyebrow, Section, Tags, TextLink } from "@/components/site/ui";
import { projectBySlug, projects, solutionBySlug } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-line py-10 md:grid-cols-[14rem_1fr] md:gap-10">
      <h2 className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{label}</h2>
      <div className="text-base leading-relaxed text-mist sm:text-lg">{children}</div>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-fog/90">
          <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  const solution = solutionBySlug(project.solutionSlug);

  return (
    <>
      <section className="border-b border-line bg-[linear-gradient(180deg,#f7f5fd_0%,#ffffff_75%)]">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24">
          <Eyebrow>Case study</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance text-fog">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge project={project} />
            <Tags items={project.tags} />
          </div>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{project.summary}</p>
          {project.image ? (
            <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-night">
              <Image src={project.image.src} alt={project.image.alt} fill preload sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover object-top" />
            </div>
          ) : null}
        </div>
      </section>

      <Section>
        <div className="border-b border-line">
          <Block label="The challenge">
            <p>{project.challenge}</p>
          </Block>
          <Block label="The approach">
            <p>{project.approach}</p>
          </Block>
          <Block label="My contribution">
            <CheckList items={project.contribution} />
          </Block>
          <Block label="The engineering">
            <CheckList items={project.engineering} />
          </Block>
          <Block label={project.status === "Concept" ? "Status" : "The result"}>
            <p className="text-fog">{project.result}</p>
          </Block>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
          {solution ? <TextLink href={`/solutions/${solution.slug}`}>Related solution: {solution.title}</TextLink> : null}
          <TextLink href="/projects">All projects</TextLink>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
