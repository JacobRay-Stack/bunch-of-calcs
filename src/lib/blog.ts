import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: number;
  calculatorLink?: string;
  calculatorName?: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function parseFrontmatter(raw: string): { metadata: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: raw };

  const metadata: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    metadata[key] = value;
  }

  return { metadata, content: match[2].trim() };
}

function calcReadingTime(content: string): number {
  return Math.ceil(content.split(/\s+/).length / 200);
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { metadata, content } = parseFrontmatter(raw);
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: metadata.title || filename,
        description: metadata.description || "",
        date: metadata.date || "",
        category: metadata.category || "general",
        readingTime: calcReadingTime(content),
        calculatorLink: metadata.calculatorLink,
        calculatorName: metadata.calculatorName,
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPostWithContent | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { metadata, content } = parseFrontmatter(raw);

  return {
    slug,
    title: metadata.title || slug,
    description: metadata.description || "",
    date: metadata.date || "",
    category: metadata.category || "general",
    readingTime: calcReadingTime(content),
    calculatorLink: metadata.calculatorLink,
    calculatorName: metadata.calculatorName,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
