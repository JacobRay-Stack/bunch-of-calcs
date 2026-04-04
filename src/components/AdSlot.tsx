"use client";

import Script from "next/script";

const AD_KEY = "1d3b5e2d540ed8029ef30f824b9ddce4";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  return (
    <div className={`w-full overflow-hidden ${size === "banner" ? "my-4" : size === "sidebar" ? "my-2" : "my-3"}`}>
      <div id={`container-${AD_KEY}`} />
      <Script
        src={`https://pl29062184.profitablecpmratenetwork.com/${AD_KEY}/invoke.js`}
        strategy="afterInteractive"
        data-cfasync="false"
      />
    </div>
  );
}
