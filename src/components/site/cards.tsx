import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Magnet, Workflow, type LucideIcon } from "lucide-react";
import type { Project, Solution } from "@/lib/content";
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

const statusStyles: Record<Project["status"], string> = {
  Built: "border-purple/40 bg-purple/10 text-accent",
  Live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-700",
  Concept: "border-line bg-night text-mist",
};

export function StatusBadge({ project }: { project: Project }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide uppercase ${statusStyles[project.status]}`}>
      {project.statusLabel}
    </span>
  );
}

/** Concept projects have no real interface yet, so they show their flow instead of a mock screenshot. */
function ConceptDiagram({ project }: { project: Project }) {
  const steps = ["Referral link", "Customer purchase", "Order verified", "Commission recorded"];
  return (
    <div role="img" aria-label={`${project.title} flow: ${steps.join(", then ")}`} className="flex h-full flex-col justify-center gap-2 p-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-purple/50 text-xs text-accent">{index + 1}</span>
          <span className="flex-1 rounded-md border border-dashed border-fog/15 px-3 py-2 text-xs text-mist">{step}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:border-purple/50 hover:shadow-lg hover:shadow-purple/10 ${focus}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-night">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <ConceptDiagram project={project} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <StatusBadge project={project} />
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-fog">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{project.brief}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-accent group-hover:text-fog">
          Find out more
          <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
