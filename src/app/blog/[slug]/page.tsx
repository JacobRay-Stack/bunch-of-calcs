import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import EmailCapture from "@/components/EmailCapture";

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

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          &larr; Back to blog
        </Link>
      </div>

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
        {/* Render MDX content as HTML -- for now just the raw markdown text */}
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

      {post.calculatorLink && post.calculatorName && (
        <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-800 dark:bg-blue-950">
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

      <EmailCapture />
    </article>
  );
}
