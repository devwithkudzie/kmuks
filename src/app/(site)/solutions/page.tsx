import type { Metadata } from "next";
import { SolutionCard } from "@/components/site/cards";
import { CallToAction, PageIntro, Section, SectionHeading } from "@/components/site/ui";
import { solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lead Capture, CRM & Revenue Tracking Solutions",
  description:
    "Lead capture systems, CRM and follow-up automation, and revenue tracking — set up around how your business wins customers.",
  alternates: { canonical: "/solutions" },
};

const fit = [
  { title: "Lead Capture Systems", role: "Catch every enquiry and record where it came from" },
  { title: "CRM & Follow-Up Automation", role: "Follow up on every lead until it becomes a sale" },
  { title: "Revenue Tracking", role: "See which marketing makes you money" },
];

export default function SolutionsPage() {
  return (
    <>
      <PageIntro eyebrow="Solutions" title="Systems that help you win more customers.">
        <p>
          I set up and connect the systems that capture every enquiry, follow up on every lead and show which marketing
          makes you money.
        </p>
        <p>
          I work with tools like Zoho CRM, ClickUp, n8n and WhatsApp Business, and build custom software and AI only
          where the tools fall short. The solution starts with the problem, not the technology.
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
