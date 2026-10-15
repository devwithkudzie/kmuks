import type { Metadata } from "next";
import { StartProjectForm } from "@/components/site/StartProjectForm";
import { Eyebrow } from "@/components/site/ui";
import { solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Start a Software Engineering Project | Kudziemuks" },
  description:
    "Tell me about your customer acquisition challenge, manual process or AI application idea, and I'll follow up about the right approach and next step.",
  alternates: { canonical: "/start-a-project" },
};

const next = [
  "I review what you've shared.",
  "If I can help, I follow up to understand the problem in more detail.",
  "I recommend an approach and the next step — no assumptions about the solution beforehand.",
];

export default async function StartAProjectPage({ searchParams }: { searchParams: Promise<{ solution?: string }> }) {
  const { solution = "" } = await searchParams;
  const initialSolution = solutions.some((item) => item.slug === solution) ? solution : "";

  return (
    <section className="bg-[linear-gradient(180deg,#f7f5fd_0%,#ffffff_75%)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:pb-28">
        <div>
          <Eyebrow>Start a project</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-fog">
            Let&rsquo;s discuss what you need to build.
          </h1>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-mist sm:text-lg">
            <p>
              Have a customer acquisition challenge, a manual business process to improve, or an idea for an AI-powered
              application?
            </p>
            <p>
              Share a little about the problem. I&rsquo;ll review the requirements and work out whether I can help, what
              approach makes sense and what the next step should be.
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
          solutions={solutions.map(({ slug, title }) => ({ slug, title }))}
          initialSolution={initialSolution}
        />
      </div>
    </section>
  );
}
