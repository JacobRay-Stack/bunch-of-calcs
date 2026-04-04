"use client";

import { useEffect, useRef } from "react";

const AD_KEY = "1d3b5e2d540ed8029ef30f824b9ddce4";
const AD_SCRIPT_SRC = `https://pl29062184.profitablecpmratenetwork.com/${AD_KEY}/invoke.js`;

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = AD_SCRIPT_SRC;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`w-full overflow-hidden ${size === "banner" ? "my-4" : size === "sidebar" ? "my-2" : "my-3"}`}>
      <div
        ref={containerRef}
        id={`container-${AD_KEY}`}
      />
    </div>
  );
}
