import { ClipboardList, Compass, Hammer, RefreshCw, Rocket, Search } from "lucide-react";
import { Section, SectionHeading, TextLink } from "@/components/site/ui";
import { engagements, workSteps } from "@/lib/content";

// One icon per step, in order; extra steps fall back to the rocket.
const stepIcons = [Search, Compass, Rocket];
const columns: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };
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
        intro="I start with the business problem, not the technology."
        action={full ? undefined : <TextLink href="/about#how-i-work">More about how I work</TextLink>}
      />
      {/* Phones: stacked rows (icon, step, number). Desktop: equal columns, one per step. */}
      <ol className={`mt-12 space-y-3 md:grid md:gap-5 md:space-y-0 ${columns[workSteps.length] ?? "md:grid-cols-3"}`}>
        {workSteps.map((step, index) => {
          const Icon = stepIcons[index] ?? Rocket;
          return (
            <li
              key={step}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-xl border border-line bg-canvas px-4 py-3.5 shadow-sm md:grid-cols-[auto_1fr] md:content-start md:gap-y-5 md:rounded-2xl md:p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-purple/10 md:size-12">
                <Icon aria-hidden className="size-5 text-accent md:size-6" />
              </span>
              <h3 className="font-semibold leading-snug text-fog md:col-span-2 md:row-start-2">{step}</h3>
              <span className="text-lg font-semibold tracking-tight text-fog/20 md:col-start-2 md:row-start-1 md:justify-self-end md:text-2xl">
                0{index + 1}
              </span>
            </li>
          );
        })}
      </ol>
      {full ? (
        <div className="mt-16">
          <h3 className="text-xl font-semibold tracking-tight text-fog">Ways to work together</h3>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {engagements.map((engagement, index) => {
              const Icon = engagementIcons[index];
              return (
                <div key={engagement} className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple text-white">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h4 className="font-semibold leading-snug text-fog">{engagement}</h4>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
