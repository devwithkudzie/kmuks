import type { Metadata } from "next";
import { InsightCard } from "@/components/site/InsightCard";
import { CallToAction, PageIntro, Section } from "@/components/site/ui";
import { getInsights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles on customer acquisition, lead management, automation and practical AI — written by Kudziemuks.",
  alternates: { canonical: "/insights" },
};

// Re-check hourly so articles scheduled for a future date appear without a redeploy.
export const revalidate = 3600;

export default function InsightsPage() {
  const insights = getInsights();
  return (
    <>
      <PageIntro eyebrow="Insights" title="Ideas on winning customers with software.">
        <p>Practical articles on customer acquisition, lead management, automation and where AI genuinely helps.</p>
      </PageIntro>
      <Section>
        {insights.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <InsightCard key={insight.slug} insight={insight} />
            ))}
          </div>
        ) : (
          <p className="text-mist">New articles are on the way.</p>
        )}
      </Section>
      <CallToAction />
    </>
  );
}
