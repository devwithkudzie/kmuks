import type { Metadata } from "next";
import { StartProjectForm } from "@/components/site/StartProjectForm";
import { Eyebrow } from "@/components/site/ui";
import { packages } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Get a Free Customer Leak Audit or Start a Project | Kudziemuks" },
  description:
    "Tell me where your business is losing customers. Request a free Customer Leak Audit, or ask about lead capture, CRM and follow-up automation, or revenue tracking.",
  alternates: { canonical: "/start-a-project" },
};

const next = [
  "I review what you've shared.",
  "If I can help, I follow up to understand the problem in more detail.",
  "I recommend an approach and the next step — no assumptions about the solution beforehand.",
];

export default async function StartAProjectPage({ searchParams }: { searchParams: Promise<{ solution?: string }> }) {
  const { solution = "" } = await searchParams;
  const initialSolution = packages.some((item) => item.slug === solution) ? solution : "";
  const isAudit = initialSolution === "customer-leak-audit";

  return (
    <section className="field-grid">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:pb-28">
        <div>
          <Eyebrow>{isAudit ? "Free Customer Leak Audit" : "Start a project"}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-fog">
            {isAudit ? "Find out where you\u2019re losing customers." : "Let\u2019s find where you\u2019re losing customers."}
          </h1>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-mist sm:text-lg">
            <p>
              Enquiries going unanswered, quotes that go quiet, ads you can&rsquo;t trace to a sale? Tell me where the
              process breaks down.
            </p>
            <p>
              I&rsquo;ll review what you share, check how your business handles enquiries, and come back with what to fix
              first and the next step.
            </p>
          </div>
          <div className="mt-10 border-t border-line pt-8">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">What happens next</p>
            <ol className="mt-5 space-y-4">
              {next.map((step, index) => (
                <li key={step} className="flex gap-4 text-sm text-mist sm:text-base">
                  <span className="font-mono text-accent">0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <StartProjectForm
          solutions={packages.map(({ slug, title }) => ({ slug, title }))}
          initialSolution={initialSolution}
        />
      </div>
    </section>
  );
}
