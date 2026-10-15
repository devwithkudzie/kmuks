import type { Metadata } from "next";
import { SolutionCard } from "@/components/site/cards";
import { CallToAction, PageIntro, Section, SectionHeading } from "@/components/site/ui";
import { solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Customer Acquisition & AI Software Solutions",
  description:
    "Customer acquisition systems, sales and workflow automation, and AI-powered business applications — engineered around how your business wins customers.",
  alternates: { canonical: "/solutions" },
};

const fit = [
  { title: "Customer Acquisition Systems", role: "Attract and track opportunities" },
  { title: "Sales & Workflow Automation", role: "Manage leads, orders and follow-ups" },
  { title: "AI-Powered Business Applications", role: "Improve information handling and visibility" },
];

export default function SolutionsPage() {
  return (
    <>
      <PageIntro eyebrow="Solutions" title="AI & software solutions for customer acquisition.">
        <p>
          I design and engineer software systems that help businesses capture leads, organise prospects and improve the
          processes that turn enquiries into customers.
        </p>
        <p>
          My work combines custom software development, practical AI integration and business process automation. The
          solution starts with the problem — not the technology.
        </p>
      </PageIntro>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </div>
      </Section>

      <Section tone="night">
        <SectionHeading
          eyebrow="How they fit together"
          title="Three complementary solutions, one connected system."
          intro="A business can engage me for one of these or combine them into a larger system — from the first enquiry to the sale and the reporting behind it."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {fit.map((item, index) => (
            <li key={item.title} className="bg-night p-6 sm:p-8">
              <p className="font-mono text-xs text-accent">0{index + 1}</p>
              <p className="mt-3 font-semibold text-fog">{item.title}</p>
              <p className="mt-2 text-sm text-mist">{item.role}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CallToAction />
    </>
  );
}
