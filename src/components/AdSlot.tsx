"use client";

import { useId, useEffect, useRef } from "react";

const AD_KEY = "1d3b5e2d540ed8029ef30f824b9ddce4";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

const MIN_HEIGHTS: Record<string, string> = {
  banner: "min-h-[90px]",
  sidebar: "min-h-[250px]",
  inline: "min-h-[50px]",
};

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  const instanceId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = `container-${AD_KEY}-${instanceId.replace(/:/g, "")}`;

  useEffect(() => {
    if (!containerRef.current || containerRef.current.querySelector("script")) return;
    const script = document.createElement("script");
    script.src = `https://pl29062184.profitablecpmratenetwork.com/${AD_KEY}/invoke.js`;
    script.async = true;
    script.dataset.cfasync = "false";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`w-full overflow-hidden ${MIN_HEIGHTS[size]} ${size === "banner" ? "my-4" : size === "sidebar" ? "my-2" : "my-3"}`}>
      <div id={containerId} ref={containerRef} />
    </div>
  );
}
