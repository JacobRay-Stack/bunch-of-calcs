"use client";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  // Adsterra native banner auto-injects ads via the global script in <head>.
  // This component provides spacing and structure for the page layout.
  // If no ads render, the empty div collapses so there's no awkward blank space.
  return (
    <div
      className={`w-full overflow-hidden ${
        size === "sidebar" ? "min-h-0" : "min-h-0"
      }`}
    />
  );
}
