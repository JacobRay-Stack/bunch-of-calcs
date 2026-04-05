import type { Metadata } from "next";
import Image from "next/image";
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Taxes: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300" },
  Pricing: { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300" },
  Planning: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
  Profit: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
};

const CATEGORY_HEROES: Record<string, string> = {
  Taxes: "/blog/hero-taxes.png",
  Pricing: "/blog/hero-pricing.png",
  Profit: "/blog/hero-profit.png",
  Planning: "/blog/hero-planning.png",
};

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const calculatorSlug = post.calculatorLink?.replace(/^\//, "") || "";
  const catColors = CATEGORY_COLORS[post.category] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-300" };
  const heroSrc = CATEGORY_HEROES[post.category] || CATEGORY_HEROES.Taxes;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400">
          &larr; Back to blog
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl">
        <Image
          src={heroSrc}
          alt=""
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        {/* Main content */}
        <article className="min-w-0">
          <header>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span className={`rounded-full px-2 py-0.5 font-medium ${catColors.bg} ${catColors.text}`}>
                {post.category}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {post.readingTime} min read
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {post.description}
            </p>
          </header>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-teal-600 dark:prose-a:text-teal-400">
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
            <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-6 text-center dark:border-teal-800 dark:bg-teal-950">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Ready to run the numbers?
              </p>
              <Link
                href={post.calculatorLink}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                Try the {post.calculatorName} &rarr;
              </Link>
            </div>
          )}

          {calculatorSlug && (
            <ServiceRecommendations calculatorSlug={calculatorSlug} />
          )}

          {calculatorSlug && (
            <RelatedCalculators currentSlug={calculatorSlug} />
          )}

          <EmailCapture />
        </article>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0">
          <div className="lg:sticky lg:top-6 space-y-6">
            <AdSlot size="sidebar" />

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
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                >
                  Open Calculator &rarr;
                </Link>
              </div>
            )}

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

            <AdSlot size="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
