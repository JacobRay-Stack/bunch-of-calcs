"use client";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg ${
        size === "sidebar" ? "min-h-64" : "min-h-16"
      }`}
      id={`adsterra-${size}-${Math.random().toString(36).slice(2, 8)}`}
    />
  );
}
