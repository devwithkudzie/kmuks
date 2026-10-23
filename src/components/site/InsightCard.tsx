import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Insight } from "@/lib/insights";
import { focus } from "@/components/site/ui";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className={`paper-fold group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition hover:border-purple/60 ${focus}`}
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-night">
        {insight.cover ? (
          <Image src={insight.cover} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
        ) : (
          // No cover image: a simple branded panel instead of a stock photo.
          <div className="field-grid flex h-full items-center justify-center">
            <BookOpen aria-hidden className="size-10 text-accent" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.7rem] font-medium tracking-[0.18em] text-accent uppercase">{insight.category}</p>
        <h3 className="mt-2 font-semibold leading-snug tracking-tight text-fog">{insight.title}</h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-accent group-hover:text-fog">
          Read more
          <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
