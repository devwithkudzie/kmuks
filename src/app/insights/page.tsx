import Link from "next/link";
import type { Metadata } from "next";
import { insights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on customer growth, messaging and marketing that actually brings in customers.",
};

export default function InsightsPage() {
  return (
    <section className="relative z-20 bg-canvas text-fog">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          Insights
        </p>
        <h1 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] tracking-tight text-pretty">
          Notes on customer growth and marketing that works.
        </h1>

        <ol className="mt-16 space-y-12 sm:space-y-16">
          {insights.map((insight) => (
            <li key={insight.slug} className="border-t border-white/10 pt-10">
              <Link href={`/insights/${insight.slug}`} className="group block">
                <p className="text-[0.7rem] font-medium tracking-[0.18em] text-mist uppercase">
                  {new Date(insight.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {insight.readTime}
                </p>
                <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-fog transition group-hover:text-purple sm:text-3xl">
                  {insight.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
                  {insight.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-purple transition group-hover:text-violet">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
