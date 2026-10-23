import type { Metadata } from "next";
import Image from "next/image";
import { Bot, Code, Database, Server } from "lucide-react";
import portrait from "../../../../public/potrait.jpeg";
import { CallToAction, Eyebrow, Section, SectionHeading } from "@/components/site/ui";
import { techStack } from "@/lib/content";
import { HowIWork } from "@/components/site/HowIWork";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Kudziemuks | Software & AI Engineer" },
  description:
    "Kudzaishe Prosper Mukungurutse — a software engineer helping businesses win more customers with positioning, lead capture, CRM and follow-up systems.",
  alternates: { canonical: "/about" },
};

const stackIcons = [Code, Database, Bot, Server];

export default function AboutPage() {
  return (
    <>
      <section className="field-grid border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-16 sm:px-8 sm:pt-24 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:pb-24">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-5 text-[clamp(2.2rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance text-fog">
              Software engineering grounded in business problems.
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-mist sm:text-lg">
              <p>
                I&rsquo;m {site.fullName} — known as Kudzie. I&rsquo;m a software engineer interested in how technology
                can solve practical business problems.
              </p>
              <p>
                My work brings together software development, backend systems, APIs, data and AI integration to build
                applications that support how businesses operate and grow.
              </p>
              <p>
                I&rsquo;m particularly interested in customer acquisition: how businesses attract potential customers,
                capture enquiries, manage relationships and turn opportunities into sales.
              </p>
              <p>
                Rather than adding AI for its own sake, I focus on where software and intelligent automation can make a
                process more effective, consistent or measurable.
              </p>
              <p className="text-fog">
                Through Kudziemuks, I work directly with businesses to understand their challenges and engineer solutions
                suited to their needs.
              </p>
            </div>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-line lg:self-start">
            <div className="relative aspect-[4/5]">
              <Image
                src={portrait}
                alt={`${site.fullName} (Kudzie)`}
                fill
                preload
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="border-t border-line px-4 py-3 text-[0.7rem] tracking-[0.18em] text-mist uppercase">
              {site.fullName}
            </figcaption>
          </figure>
        </div>
      </section>

      <Section tone="night">
        <SectionHeading eyebrow="Technical capabilities" title="The tools behind the work." intro="Grouped by what they're used for, not as a wall of logos." />
        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((group, index) => {
            const Icon = stackIcons[index] ?? Code;
            return (
            <div key={group.area} className="rounded-2xl border border-line bg-canvas p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-full bg-purple/10">
                <Icon aria-hidden className="size-5 text-accent" />
              </span>
              <dt className="mt-4 text-sm font-semibold text-fog">{group.area}</dt>
              <dd className="mt-4">
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-mist">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            );
          })}
        </dl>
      </Section>

      <HowIWork full tone="canvas" />

      <CallToAction />
    </>
  );
}
