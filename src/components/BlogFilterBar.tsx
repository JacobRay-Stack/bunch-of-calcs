"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import AdSlot from "./AdSlot";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Taxes: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-500" },
  Pricing: { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300", ring: "ring-teal-500" },
  Planning: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", ring: "ring-purple-500" },
  Profit: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-500" },
};

const DEFAULT_COLORS = { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-300", ring: "ring-gray-500" };

function getCategoryColors(category: string) {
  return CATEGORY_COLORS[category] || DEFAULT_COLORS;
}

interface BlogFilterBarProps {
  posts: BlogPost[];
}

export default function BlogFilterBar({ posts }: BlogFilterBarProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category))).sort()];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          const colors = cat === "All" ? DEFAULT_COLORS : getCategoryColors(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Post grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, i) => {
          const colors = getCategoryColors(post.category);
          return (
            <div key={post.slug}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-teal-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600"
                >
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span className={`rounded-full px-2 py-0.5 font-medium ${colors.bg} ${colors.text}`}>
                      {post.category}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-teal-600 dark:text-gray-100 dark:group-hover:text-teal-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {post.calculatorName && (
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                        Try the {post.calculatorName} &rarr;
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {post.readingTime} min read
                    </p>
                  </div>
                </Link>
              </article>
              {/* Ad slot after every 6th card */}
              {(i + 1) % 6 === 0 && i < filtered.length - 1 && (
                <div className="sm:col-span-2 lg:col-span-3 mt-6">
                  <AdSlot size="banner" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
