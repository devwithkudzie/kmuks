import { site } from "@/lib/site";
import { insights } from "@/lib/insights";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.siteUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...insights.map((insight) => ({
      url: `${site.siteUrl}/insights/${insight.slug}`,
      lastModified: new Date(insight.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
