import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bunch of Calcs - Free Calculators for Freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          Bunch of Calcs
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#93c5fd",
            marginBottom: 40,
          }}
        >
          Free Calculators for Freelancers
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {["Rates", "Taxes", "Invoices", "Profit", "Pricing"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px 24px",
                color: "white",
                fontSize: 22,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "#64748b",
            fontSize: 20,
          }}
        >
          bunchofcalcs.com
        </div>
      </div>
    ),
    { ...size }
  );
}
