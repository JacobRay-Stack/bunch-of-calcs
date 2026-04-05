import { ImageResponse } from "next/og";
import { getCalculatorBySlug } from "@/calculators";

export const runtime = "edge";
export const alt = "Bunch of Calcs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Category colors for visual differentiation
const categoryColors: Record<string, { bg: string; accent: string }> = {
  taxes: { bg: "#1e3a5f", accent: "#fbbf24" },
  pricing: { bg: "#1a2e45", accent: "#34d399" },
  profit: { bg: "#1e2d3d", accent: "#60a5fa" },
  planning: { bg: "#1e2d3d", accent: "#a78bfa" },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  const name = calc?.name || "Calculator";
  const description = calc?.description || "";
  const colors = categoryColors[calc?.category || "taxes"] || categoryColors.taxes;

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
              fontSize: 24,
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase" as const,
            }}
          >
            Free Calculator
          </div>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          {description}
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
          <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
            BunchofCalcs
          </div>
          <div style={{ fontSize: 22, color: "#64748b" }}>
            bunchofcalcs.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
