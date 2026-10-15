import { ClipboardList, Code, Compass, Hammer, RefreshCw, Rocket, Search } from "lucide-react";
import { Section, SectionHeading, TextLink } from "@/components/site/ui";
import { engagements, workSteps } from "@/lib/content";

const stepIcons = [Search, Compass, Code, Rocket];
const engagementIcons = [ClipboardList, Hammer, RefreshCw];

/**
 * "How I Work": the four steps, used on the homepage and the About page.
 * `full` adds the ways to work together (About page); otherwise it links there.
 */
export function HowIWork({ full = false, tone = "night" }: { full?: boolean; tone?: "canvas" | "night" }) {
  return (
    <Section tone={tone} id="how-i-work">
      <SectionHeading
        eyebrow="How I work"
        title="From business problem to working system."
        intro="I don't assume every problem needs AI or custom software. I start with the business objective and the process, then decide what to build, integrate or simplify."
        action={full ? undefined : <TextLink href="/about#how-i-work">More about how I work</TextLink>}
      />
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {workSteps.map((step, index) => {
          const Icon = stepIcons[index];
          return (
            <li key={step.title} className="rounded-2xl border border-line bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple/10">
                  <Icon aria-hidden className="size-6 text-accent" />
                </span>
                <span className="text-2xl font-semibold tracking-tight text-fog/20">0{index + 1}</span>
              </div>
              <h3 className="mt-5 font-semibold text-fog">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{step.body}</p>
            </li>
          );
        })}
      </ol>
      {full ? (
        <div className="mt-16">
          <h3 className="text-xl font-semibold tracking-tight text-fog">Ways to work together</h3>
          <p className="mt-2 max-w-2xl text-sm text-mist sm:text-base">
            Pricing depends on the problem, so I agree scope after understanding it rather than publishing fixed packages.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {engagements.map((engagement, index) => {
              const Icon = engagementIcons[index];
              return (
                <div key={engagement.title} className="rounded-2xl border border-line bg-canvas p-6 shadow-sm">
                  <span className="flex size-12 items-center justify-center rounded-full bg-purple text-white">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h4 className="mt-5 font-semibold text-fog">{engagement.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{engagement.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
