import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Blog",
  description: "Freelancer guides, tax tips, and pricing strategies from Bunch of Calcs.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Guides, tax tips, and pricing strategies for freelancers and solopreneurs.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">Posts coming soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <>
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
                >
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                  {post.calculatorName && (
                    <p className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Try the {post.calculatorName} &rarr;
                    </p>
                  )}
                </Link>
              </article>
              {/* Ad slot after first row (every 3 posts on desktop, every 2 on tablet) */}
              {i === 2 && posts.length > 3 && (
                <div key="ad-break" className="sm:col-span-2 lg:col-span-3">
                  <AdSlot size="banner" />
                </div>
              )}
            </>
          ))}
        </div>
      )}

      {/* Bottom ad slot */}
      <div className="mt-10">
        <AdSlot size="banner" />
      </div>
    </div>
  );
}
