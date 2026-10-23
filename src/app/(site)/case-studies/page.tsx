import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/site/cards";
import { CallToAction, Eyebrow } from "@/components/site/ui";
import { publishedCaseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Software Engineering Case Studies",
  description:
    "Professional engineering work and independent products — the problem, how I solved it, and how it's built.",
  alternates: { canonical: "/case-studies" },
};

const groups = [
  {
    category: "professional" as const,
    title: "Professional work",
    intro: "Systems I've built or contributed to for clients and teams.",
  },
  {
    category: "personal" as const,
    title: "Products I've built",
    intro: "Independent products where I own the problem, design and engineering.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="field-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8 sm:pt-24 sm:pb-16">
          <Eyebrow>Case studies</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,6vw,4rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-fog">
            Real problems, engineered solutions.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist sm:mt-6 sm:text-lg">
            The problem, how I solved it, and how it&rsquo;s built.
          </p>
        </div>
      </section>

      {groups.map((group, index) => {
        const studies = publishedCaseStudies.filter((study) => study.category === group.category);
        if (!studies.length) return null;
        return (
          <section
            key={group.category}
            id={group.category}
            className={`border-t border-line ${index % 2 ? "bg-night" : "bg-canvas"}`}
          >
            <div className="mx-auto max-w-6xl py-8 sm:px-8 sm:py-20">
              <div className="flex items-baseline justify-between gap-4 px-5 sm:px-0">
                <h2 className="text-xl font-bold tracking-tight text-fog sm:text-3xl">{group.title}</h2>
                <span className="text-sm text-mist">{studies.length}</span>
              </div>
              <p className="mt-3 hidden max-w-2xl text-mist sm:block">{group.intro}</p>
              {/* Phones: full-width cards stacked edge to edge. Larger screens: a grid. */}
              <div className="mt-5 grid sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {studies.map((study) => (
                  <div key={study.slug} className="-mt-px first:mt-0 sm:mt-0">
                    <CaseStudyCard study={study} edge />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CallToAction />
    </>
  );
}
