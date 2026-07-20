import type { MetadataRoute } from "next";
import { getAllPlots } from "@/lib/land";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const plots = getAllPlots();
  const latest = plots
    .map((plot) => plot.publishedAt)
    .sort()
    .at(-1);

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/land`,
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...plots.map((plot) => ({
      url: `${SITE_URL}/land/${plot.slug}`,
      lastModified: new Date(plot.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
