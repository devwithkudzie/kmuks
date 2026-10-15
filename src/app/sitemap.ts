import { site } from "@/lib/site";
import { getInsights } from "@/lib/insights";
import { projects, solutions } from "@/lib/content";
import type { MetadataRoute } from "next";

// Hourly, so scheduled articles join the sitemap on their publish date.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...[
      { path: "/solutions", priority: 0.9 },
      ...solutions.map((solution) => ({ path: `/solutions/${solution.slug}`, priority: 0.8 })),
      { path: "/projects", priority: 0.8 },
      ...projects.map((project) => ({ path: `/projects/${project.slug}`, priority: 0.7 })),
      { path: "/about", priority: 0.6 },
      { path: "/start-a-project", priority: 0.8 },
    ].map(({ path, priority }) => ({
      url: `${site.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
    })),
    {
      url: `${site.siteUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${site.siteUrl}/free-website`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...getInsights().map((insight) => ({
      url: `${site.siteUrl}/insights/${insight.slug}`,
      lastModified: new Date(insight.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
