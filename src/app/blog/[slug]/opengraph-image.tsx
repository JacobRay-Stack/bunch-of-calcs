import { ImageResponse } from "next/og";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "Bunch of Calcs Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categoryColors: Record<string, { bg: string; accent: string }> = {
  Taxes: { bg: "#9f1239", accent: "#fecdd3" },
  Pricing: { bg: "#0D9488", accent: "#ccfbf1" },
  Profit: { bg: "#d97706", accent: "#fef3c7" },
  Planning: { bg: "#7c3aed", accent: "#ede9fe" },
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title || "Blog Post";
  const category = post?.category || "Taxes";
  const readingTime = post?.readingTime || 5;
  const colors = categoryColors[category] || categoryColors.Taxes;

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, #0f172a 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 40,
              background: colors.accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase" as const,
              display: "flex",
            }}
          >
            {category} · {readingTime} min read
          </div>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            marginBottom: 24,
            maxWidth: 950,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "white", display: "flex" }}>
            BunchofCalcs
          </div>
          <div style={{ fontSize: 22, color: "#64748b", display: "flex" }}>
            bunchofcalcs.com/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
