import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import AdSlot from "@/components/AdSlot";
import BlogFilterBar from "@/components/BlogFilterBar";

export const metadata: Metadata = {
  title: "Blog",
  description: "Freelancer guides, tax tips, and pricing strategies from Bunch of Calcs.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="mt-8 text-gray-500 dark:text-gray-400">Posts coming soon.</p>
      </div>
    );
  }

  const categoryColors: Record<string, { bg: string; text: string }> = {
    Taxes: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300" },
    Pricing: { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300" },
    Planning: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
    Profit: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
  };
  const defaultColors = { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-300" };
  const fColors = categoryColors[featured.category] || defaultColors;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Guides, tax tips, and pricing strategies for freelancers and solopreneurs.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group mt-10 block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-teal-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600 sm:p-10"
      >
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            Latest
          </span>
          <time dateTime={featured.date}>
            {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <span className={`rounded-full px-2 py-0.5 font-medium ${fColors.bg} ${fColors.text}`}>
            {featured.category}
          </span>
          <span className="text-gray-400 dark:text-gray-500">{featured.readingTime} min read</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 group-hover:text-teal-600 dark:text-gray-100 dark:group-hover:text-teal-400 sm:text-3xl">
          {featured.title}
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 sm:text-lg">
          {featured.description}
        </p>
        {featured.calculatorName && (
          <p className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
            Try the {featured.calculatorName} &rarr;
          </p>
        )}
      </Link>

      {/* Ad after featured */}
      <div className="mt-8">
        <AdSlot size="banner" />
      </div>

      {/* Filter + grid for remaining posts */}
      {rest.length > 0 && (
        <div className="mt-10">
          <BlogFilterBar posts={rest} />
        </div>
      )}

      {/* Bottom ad */}
      <div className="mt-10">
        <AdSlot size="banner" />
      </div>
    </div>
  );
}
