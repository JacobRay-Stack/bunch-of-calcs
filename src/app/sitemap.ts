import type { MetadataRoute } from "next";
import calculators from "@/calculators";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://www.bunchofcalcs.com";

// Update these dates when content actually changes -- Google uses lastmod for crawl priority
const CALC_LAST_UPDATED = "2026-04-04";
const STATIC_LAST_UPDATED = "2026-04-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const calcPages = calculators.map((calc) => ({
    url: `${SITE_URL}/${calc.slug}`,
    lastModified: CALC_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogPosts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: CALC_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: CALC_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: STATIC_LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: STATIC_LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...calcPages,
    ...blogPosts,
  ];
}
