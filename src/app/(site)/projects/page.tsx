import type { Metadata } from "next";
import { ProjectCard } from "@/components/site/cards";
import { CallToAction, PageIntro, Section } from "@/components/site/ui";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Software Engineering Projects",
  description:
    "Case studies in customer acquisition software, workflow automation and business applications — what I built, how, and what it does.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="Projects" title="Projects & engineering.">
        <p>
          I approach software engineering as a way to solve real problems. These projects show how applications, data,
          integrations and AI can support better business processes.
        </p>
        <p className="text-sm">
          Each project is labelled honestly: client work and live systems are in use; concepts are designs that have not
          yet been built.
        </p>
      </PageIntro>
      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
      <CallToAction />
    </>
  );
}
