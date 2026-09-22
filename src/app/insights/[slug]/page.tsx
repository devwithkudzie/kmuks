import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdjacentInsights, getInsightBySlug, insights } from "@/lib/insights";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const { previous, next } = getAdjacentInsights(slug);
  const otherInsights = insights.filter((item) => item.slug !== slug);

  return (
    <div className="relative z-20 bg-canvas text-fog">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Link
          href="/insights"
          className="text-sm font-medium text-purple transition hover:text-violet"
        >
          ← Insights
        </Link>

        <div className="mt-8 grid gap-16 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-12">
          <article>
            <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">
              {formatDate(insight.date)} · {insight.readTime}
            </p>
            <h1 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] font-bold leading-[1.12] tracking-tight text-pretty">
              {insight.title}
            </h1>

            <div className="mt-10 space-y-6">
              {insight.body.map((paragraph, index) => (
                <p key={index} className="max-w-2xl text-lg leading-loose text-mist">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-14 rounded-lg bg-purple/10 p-6 sm:p-8">
              <p className="text-lg font-bold tracking-tight text-fog sm:text-xl">
                Not sure what&rsquo;s stopping your marketing from bringing in
                more customers?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
                Start with a Free Customer Growth Review and find out what to
                focus on next.
              </p>
              <WhatsAppButton
                source="insights"
                className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet"
              >
                Get Your Free Customer Growth Review
              </WhatsAppButton>
            </div>

            {previous || next ? (
              <div className="mt-16 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
                <div>
                  {previous ? (
                    <Link
                      href={`/insights/${previous.slug}`}
                      className="group block"
                    >
                      <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">
                        ← Previous
                      </p>
                      <p className="mt-2 text-sm font-medium text-fog transition group-hover:text-purple sm:text-base">
                        {previous.title}
                      </p>
                    </Link>
                  ) : null}
                </div>
                <div className="sm:text-right">
                  {next ? (
                    <Link href={`/insights/${next.slug}`} className="group block">
                      <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">
                        Next →
                      </p>
                      <p className="mt-2 text-sm font-medium text-fog transition group-hover:text-purple sm:text-base">
                        {next.title}
                      </p>
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>

          {otherInsights.length > 0 ? (
            <aside className="border-t border-white/10 pt-8 lg:sticky lg:top-28 lg:border-t-0 lg:pt-0">
              <p className="text-[0.7rem] font-medium tracking-[0.18em] text-purple uppercase">
                More Insights
              </p>
              <ul className="mt-5 space-y-6">
                {otherInsights.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/insights/${item.slug}`} className="group block">
                      <p className="text-[0.65rem] font-medium tracking-[0.16em] text-mist uppercase">
                        {formatDate(item.date)}
                      </p>
                      <p className="mt-2 text-sm font-medium leading-snug text-fog transition group-hover:text-purple">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
