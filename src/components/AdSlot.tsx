"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    const script = document.createElement("script");
    script.src =
      "https://pl29062183.profitablecpmratenetwork.com/e5/1f/ab/e51fab29190e120897df56472090d051.js";
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-lg ${
        size === "sidebar" ? "min-h-64" : "min-h-16"
      }`}
    />
  );
}
