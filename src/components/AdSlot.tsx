"use client";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

// Ad slot placeholder -- ready for a quality ad network (Google AdSense, Ezoic, etc.)
// Adsterra was removed due to low-quality scam ads (popunders, fake virus warnings).
export default function AdSlot({ size = "inline" }: AdSlotProps) {
  return (
    <div
      className={`w-full overflow-hidden ${
        size === "sidebar" ? "min-h-0" : "min-h-0"
      }`}
    />
  );
}
