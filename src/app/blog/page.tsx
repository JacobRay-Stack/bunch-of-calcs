import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Freelancer guides, tax tips, and pricing strategies from Bunch of Calcs.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Guides, tax tips, and pricing strategies for freelancers and solopreneurs.
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">Posts coming soon.</p>
      ) : (
        <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <article key={post.slug} className="py-6">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {post.category}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                {post.calculatorName && (
                  <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                    Try the {post.calculatorName} &rarr;
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
