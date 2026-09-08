import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
