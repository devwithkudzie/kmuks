import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRight, Check, Cog, Lightbulb, type LucideIcon } from "lucide-react";
import { CaseStudyCard } from "@/components/site/cards";
import { EvidenceCarousel } from "@/components/site/EvidenceCarousel";
import { CallToAction, Eyebrow, focus, TextLink } from "@/components/site/ui";
import { caseStudyBySlug, categoryLabels, publishedCaseStudies, type CaseStudy } from "@/content/case-studies";
import { solutionBySlug } from "@/lib/content";

export function generateStaticParams() {
  return publishedCaseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = caseStudyBySlug((await params).slug);
  if (!study) return {};
  return {
    title: `${study.title} — Case Study`,
    description: study.overview,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: { title: study.title, description: study.tagline, ...(study.image ? { images: [study.image.src] } : {}) },
  };
}

/** A numbered case study section: label on the left, content on the right (stacked on mobile). */
function Part({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-14 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-fog">{title}</h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-mist sm:text-lg">
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

const glanceColumns: Record<number, string> = { 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5" };

/** Minutes to read the visible case study text, at about 200 words a minute. */
function readMinutes(study: CaseStudy) {
  const text = [
    study.problem,
    ...study.approach,
    ...(study.decisions ?? []).flatMap((item) => [item.title, item.body]),
    ...topFeatures(study.features),
    ...(study.engineering ?? []).flatMap((item) => [item.title, item.body]),
    ...(study.stack ?? []).flatMap((group) => group.items.flatMap((item) => [item.name, item.role])),
    ...(study.results ?? []),
    ...(study.lessons ?? []),
    ...(study.next ?? []),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

/** The key-decision card style, reused for solution highlights. */
function DecisionCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body?: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-night p-5">
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
      <div>
        <p className="font-medium text-fog">{title}</p>
        {body ? <p className="mt-1 text-sm leading-relaxed text-mist">{body}</p> : null}
      </div>
    </div>
  );
}

/**
 * The solution's top three items: the first item of each feature group in turn,
 * so a "for the client" / "for the admin" split stays balanced.
 */
function topFeatures(features: CaseStudy["features"], limit = 3) {
  const groups = (features ?? []).map((feature) => [...feature.items]);
  const picked: string[] = [];
  while (picked.length < limit && groups.some((items) => items.length)) {
    for (const items of groups) {
      const next = items.shift();
      if (next && picked.length < limit) picked.push(next);
    }
  }
  return picked;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-fog/90">
          <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = caseStudyBySlug((await params).slug);
  if (!study) notFound();
  const solution = study.solutionSlug ? solutionBySlug(study.solutionSlug) : undefined;
  const others = publishedCaseStudies.filter((item) => item.slug !== study.slug).slice(0, 3);

  const hasApproach = Boolean(study.approach.length || study.decisions?.length);
  const highlights = topFeatures(study.features);
  const hasResults = Boolean(study.results?.length || study.lessons?.length || study.next?.length);
  const sections = [
    { id: "problem", label: "The problem", show: Boolean(study.problem) },
    { id: "approach", label: "Approach", show: hasApproach },
    { id: "solution", label: "Solution", show: highlights.length > 0 },
    { id: "engineering", label: "How I engineered it", show: Boolean(study.engineering?.length) },
    { id: "evidence", label: "Evidence", show: Boolean(study.evidence?.length) },
    { id: "technologies", label: "Technologies", show: Boolean(study.stack?.length) },
    { id: "results", label: "Results & lessons", show: hasResults },
  ].filter((section) => section.show);
  const number = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");

  const meta = [
    { label: "Role", value: study.role },
    { label: "Type", value: study.type },
    { label: "Stage", value: study.stage },
    { label: "Client", value: study.client },
    { label: "Read time", value: `${readMinutes(study)} min read` },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <>
      {/* 1 · Hero: the project's name and its product, nothing else. */}
      <section className="field-grid overflow-hidden border-b border-line">
        <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-12 sm:px-8 sm:pt-12 sm:pb-16">
          <Link href="/case-studies" className={`text-sm font-medium text-accent transition hover:text-fog ${focus}`}>
            ← All case studies
          </Link>
          <div className="mt-8 max-w-4xl sm:mt-10">
            <Eyebrow>{categoryLabels[study.category]} · Case study</Eyebrow>
            <h1 className="mt-4 text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-fog">
              {study.title}
            </h1>
            {study.links?.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {study.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(/^https?:/.test(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          {study.image ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-night shadow-2xl shadow-purple/20 sm:mt-12">
              <Image src={study.image.src} alt={study.image.alt} fill preload sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover object-top" />
            </div>
          ) : null}
        </div>
      </section>

      {/* 2 · At a glance: role, type, stage, client and how long the page takes to read. */}
      <section aria-label="Project details" className="border-b border-line bg-canvas">
        <dl className={`mx-auto grid max-w-6xl divide-y divide-line sm:px-8 md:divide-x md:divide-y-0 ${glanceColumns[meta.length] ?? "md:grid-cols-4"}`}>
          {meta.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-6 px-5 py-4 md:block md:py-7 md:first:pl-0">
              <dt className="shrink-0 text-xs font-medium tracking-[0.16em] text-mist uppercase">{item.label}</dt>
              <dd className="text-right font-medium text-fog md:mt-1.5 md:text-left">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Jump links for readers who want a specific part. */}
      {sections.length > 1 ? (
        <nav aria-label="Case study sections" className="sticky top-16 z-40 border-b border-line bg-canvas/90 backdrop-blur">
          <ul className="hero-rail-scroll mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 py-3 text-sm whitespace-nowrap sm:px-8">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={`text-mist transition hover:text-accent ${focus}`}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {study.problem ? (
          <section id="problem" className="scroll-mt-24 py-12 sm:py-16">
            <Eyebrow>{number("problem")} · The problem</Eyebrow>
            <p className="mt-4 max-w-4xl text-[clamp(1.35rem,3vw,2rem)] leading-snug font-semibold tracking-tight text-balance text-fog">
              {study.problem}
            </p>
          </section>
        ) : null}

        {hasApproach ? (
          <Part id="approach" label={`${number("approach")} · Approach`} title="How I approached it">
            <Paragraphs items={study.approach} />
            {study.decisions?.length ? (
              <div className="mt-10">
                <h3 className="font-semibold text-fog">Key decisions</h3>
                <div className="mt-4 space-y-3">
                  {study.decisions.map((decision) => (
                    <DecisionCard key={decision.title} icon={Lightbulb} title={decision.title} body={decision.body} />
                  ))}
                </div>
              </div>
            ) : null}
          </Part>
        ) : null}

        {highlights.length ? (
          <Part id="solution" label={`${number("solution")} · Solution`} title="What I built">
            <div className="space-y-3">
              {highlights.map((item) => (
                <DecisionCard key={item} icon={Check} title={item} />
              ))}
            </div>
          </Part>
        ) : null}

        {study.engineering?.length ? (
          <Part id="engineering" label={`${number("engineering")} · Engineering`} title="How I engineered it">
            <div className="grid gap-5 md:grid-cols-2">
              {study.engineering.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
                  <span className="flex size-10 items-center justify-center rounded-full bg-purple/10">
                    <Cog aria-hidden className="size-5 text-accent" />
                  </span>
                  <p className="mt-4 font-semibold text-fog">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
                </div>
              ))}
            </div>
          </Part>
        ) : null}

        {study.evidence?.length ? (
          <Part id="evidence" label={`${number("evidence")} · Evidence`} title="See it working">
            <EvidenceCarousel slides={study.evidence} />
          </Part>
        ) : null}

        {study.stack?.length ? (
          <Part id="technologies" label={`${number("technologies")} · Technologies`} title="Under the hood">
            <div className="grid gap-5 md:grid-cols-2">
              {study.stack.map((group) => (
                <div key={group.group} className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
                  <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">{group.group}</p>
                  <dl className="mt-4 space-y-4">
                    {group.items.map((item) => (
                      <div key={item.name}>
                        <dt className="font-semibold text-fog">{item.name}</dt>
                        <dd className="mt-0.5 text-sm text-mist">{item.role}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Part>
        ) : null}

        {hasResults ? (
          <Part id="results" label={`${number("results")} · Results & lessons`} title="What it achieved">
            <div className="space-y-8">
              {study.results?.length ? <CheckList items={study.results} /> : null}
              {study.lessons?.length ? (
                <div>
                  <h3 className="font-semibold text-fog">What I learned</h3>
                  <div className="mt-3">
                    <Paragraphs items={study.lessons} />
                  </div>
                </div>
              ) : null}
              {study.next?.length ? (
                <div>
                  <h3 className="font-semibold text-fog">What&rsquo;s next</h3>
                  <div className="mt-3">
                    <CheckList items={study.next} />
                  </div>
                </div>
              ) : null}
            </div>
          </Part>
        ) : null}

        {solution ? (
          <div className="border-t border-line py-10">
            <TextLink href={`/solutions/${solution.slug}`}>Related solution: {solution.title}</TextLink>
          </div>
        ) : null}
      </div>

      {others.length ? (
        <section className="border-t border-line bg-night">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl font-bold tracking-tight text-fog">More case studies</h2>
              <TextLink href="/case-studies">View all</TextLink>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <CaseStudyCard key={item.slug} study={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction />
    </>
  );
}
