import type { MetadataRoute } from "next";
import { getEnrichedShoes } from "@/lib/data";
import { intentPages } from "@/lib/intent-pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hardloopschoenvergelijken.nl";

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/schoenen",
    "/keuzehulp",
    "/vergelijken",
    "/advies",
    "/methodologie",
    "/over-ons",
    "/contact",
    "/onafhankelijkheid",
    "/privacy",
    "/cookies"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7
    })),
    ...intentPages.map((page) => ({
      url: absoluteUrl(`/advies/${page.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...getEnrichedShoes().map((shoe) => ({
      url: absoluteUrl(`/schoenen/${shoe.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.72
    }))
  ];
}
