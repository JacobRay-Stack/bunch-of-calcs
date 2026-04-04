"use client";

import { useState } from "react";

interface ShareResultsProps {
  calculatorName: string;
  results: Record<string, string>;
}

export default function ShareResults({
  calculatorName,
  results,
}: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    const lines = Object.entries(results)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
    return `${calculatorName} Results\n${"─".repeat(30)}\n${lines}\n\nCalculated at BunchofCalcs.com`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generateText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const firstResult = Object.entries(results)[0];
    const text = firstResult
      ? `Just calculated my ${calculatorName.toLowerCase()}: ${firstResult[1]}. Try it free at`
      : `Check out this ${calculatorName.toLowerCase()}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? "Copied!" : "Copy Results"}
      </button>
      <button
        onClick={handleTwitter}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </button>
    </div>
  );
}
