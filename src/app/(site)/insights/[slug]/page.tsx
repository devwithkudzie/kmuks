import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InsightCard } from "@/components/site/InsightCard";
import { Markdown } from "@/components/site/Markdown";
import { Eyebrow, focus } from "@/components/site/ui";
import { formatInsightDate, getAdjacentInsights, getInsightBySlug, getInsights } from "@/lib/insights";

// Re-check hourly so a scheduled article's page goes live on its date.
export const revalidate = 3600;

export function generateStaticParams() {
  return getInsights().map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const insight = getInsightBySlug((await params).slug);
  if (!insight) return {};
  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.date,
      ...(insight.cover ? { images: [insight.cover] } : {}),
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();
  const { newer, older } = getAdjacentInsights(slug);
  const more = getInsights().filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl px-5 pt-14 pb-20 sm:px-8 sm:pt-20">
        <Link href="/insights" className={`text-sm font-medium text-accent transition hover:text-fog ${focus}`}>
          ← All insights
        </Link>
        <div className="mt-10">
          <Eyebrow>{insight.category}</Eyebrow>
          <h1 className="mt-4 text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.12] font-bold tracking-tight text-balance text-fog">
            {insight.title}
          </h1>
          <p className="mt-5 text-sm text-mist">
            <time dateTime={insight.date}>{formatInsightDate(insight.date)}</time> · {insight.readTime}
          </p>
        </div>
        {insight.cover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <Image src={insight.cover} alt="" fill preload sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
        ) : null}
        <div className="mt-10">
          <Markdown source={insight.body} />
        </div>

        <div className="mt-14 rounded-2xl border border-purple/30 bg-purple/10 p-6 sm:p-8">
          <p className="text-lg font-bold tracking-tight text-fog sm:text-xl">Losing opportunities between the enquiry and the sale?</p>
          <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
            I build systems that capture leads, automate follow-up and show where opportunities stall. Tell me where your
            process breaks down.
          </p>
          <Link
            href="/start-a-project"
            className={`mt-6 inline-flex min-h-12 items-center rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
          >
            Discuss a Project
          </Link>
        </div>

        {newer || older ? (
          <nav aria-label="More articles" className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              {older ? (
                <Link href={`/insights/${older.slug}`} className={`group block ${focus}`}>
                  <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">← Previous</p>
                  <p className="mt-2 font-semibold text-fog transition group-hover:text-accent">{older.title}</p>
                </Link>
              ) : null}
            </div>
            <div className="sm:text-right">
              {newer ? (
                <Link href={`/insights/${newer.slug}`} className={`group block ${focus}`}>
                  <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">Next →</p>
                  <p className="mt-2 font-semibold text-fog transition group-hover:text-accent">{newer.title}</p>
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </article>

      {more.length ? (
        <section className="border-t border-line bg-night">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-fog">More insights</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <InsightCard key={item.slug} insight={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
