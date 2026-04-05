import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import AdSlot from "@/components/AdSlot";
import EmailCapture from "@/components/EmailCapture";
import RelatedCalculators from "@/components/RelatedCalculators";
import ServiceRecommendations from "@/components/ServiceRecommendations";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  // Extract the calculator slug from the link (e.g. "/emergency-fund" -> "emergency-fund")
  const calculatorSlug = post.calculatorLink?.replace(/^\//, "") || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          &larr; Back to blog
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        {/* Main content */}
        <article className="min-w-0">
          <header>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {post.category}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {post.description}
            </p>
          </header>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={i}>{paragraph.replace("## ", "")}</h2>;
              }
              if (paragraph.startsWith("### ")) {
                return <h3 key={i}>{paragraph.replace("### ", "")}</h3>;
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i}>
                    {paragraph.split("\n").map((line, j) => (
                      <li key={j}>{line.replace(/^- /, "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>

          {/* Inline ad after article content */}
          <div className="mt-8">
            <AdSlot size="banner" />
          </div>

          {post.calculatorLink && post.calculatorName && (
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Ready to run the numbers?
              </p>
              <Link
                href={post.calculatorLink}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Try the {post.calculatorName} &rarr;
              </Link>
            </div>
          )}

          {/* Service recommendations (affiliate links) below article */}
          {calculatorSlug && (
            <ServiceRecommendations calculatorSlug={calculatorSlug} />
          )}

          {/* Related calculators below article */}
          {calculatorSlug && (
            <RelatedCalculators currentSlug={calculatorSlug} />
          )}

          {/* Email capture at bottom of content */}
          <EmailCapture />
        </article>

        {/* Sidebar -- sticky on desktop, flows below on mobile */}
        <aside className="mt-10 lg:mt-0">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Sidebar ad */}
            <AdSlot size="sidebar" />

            {/* Calculator CTA in sidebar */}
            {post.calculatorLink && post.calculatorName && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Free Calculator
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Run the numbers yourself with our {post.calculatorName}.
                </p>
                <Link
                  href={post.calculatorLink}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Open Calculator &rarr;
                </Link>
              </div>
            )}

            {/* Email capture in sidebar */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Freelancer Tax Cheat Sheet
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                One-page PDF with current tax rates, deduction categories, and quarterly due dates.
              </p>
              <EmailCapture
                headline=""
                description=""
              />
            </div>

            {/* Second sidebar ad */}
            <AdSlot size="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
