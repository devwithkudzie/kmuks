import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, Magnet, Workflow, type LucideIcon } from "lucide-react";
import type { Solution } from "@/lib/content";
import type { CaseStudy } from "@/content/case-studies";
import { focus } from "@/components/site/ui";

const solutionIcons: Record<string, LucideIcon> = {
  "customer-acquisition-systems": Magnet,
  "sales-workflow-automation": Workflow,
  "ai-business-applications": Bot,
};

export function SolutionIcon({ slug, className = "size-5" }: { slug: string; className?: string }) {
  const Icon = solutionIcons[slug] ?? Magnet;
  return <Icon aria-hidden className={className} />;
}

export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:border-purple/50 hover:shadow-lg hover:shadow-purple/10 ${focus}`}
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={solution.image.src}
          alt={solution.image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6">
        <span className="-mt-7 flex size-14 items-center justify-center rounded-full border-4 border-canvas bg-purple text-white shadow-md">
          <SolutionIcon slug={solution.slug} className="size-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-fog">{solution.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{solution.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-accent group-hover:text-fog">
          Find out more
          <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * `edge` (Case Studies page): on phones the card runs edge to edge with no
 * rounding, and the image panel is skipped when there's no screenshot.
 */
export function CaseStudyCard({ study, edge = false }: { study: CaseStudy; edge?: boolean }) {
  const shape = edge
    ? "border-y border-line sm:rounded-2xl sm:border sm:shadow-sm"
    : "rounded-2xl border border-line shadow-sm";
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={`group flex h-full flex-col overflow-hidden bg-panel transition hover:border-purple/50 sm:hover:-translate-y-0.5 sm:hover:shadow-lg sm:hover:shadow-purple/10 ${shape} ${focus}`}
    >
      <div
        className={`relative aspect-[16/9] overflow-hidden border-b border-line bg-night ${edge && !study.image ? "hidden sm:block" : ""}`}
      >
        {study.image ? (
          <Image
            src={study.image.src}
            alt={study.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top_right,rgb(109_40_217/0.18),transparent_65%)]">
            <BriefcaseBusiness aria-hidden className="size-10 text-accent" />
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${edge ? "px-5 py-5 sm:p-6" : "p-6"}`}>
        <h3 className="text-lg font-semibold tracking-tight text-fog">{study.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist sm:line-clamp-none">{study.tagline}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-accent group-hover:text-fog sm:pt-5">
          Read case study
          <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
