"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Frequently Asked Questions
      </h2>
      <dl className="mt-4 divide-y divide-gray-200 dark:divide-gray-700" role="list">
        {items.map((item, i) => {
          const id = `faq-${slugify(item.question)}`;
          const isOpen = openIndex === i;
          return (
            <div key={i} id={id} className="py-4 scroll-mt-20">
              <dt>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-answer`}
                  className="flex w-full items-center justify-between text-left py-1"
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.question}
                  </span>
                  <svg
                    className={`ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </dt>
              {isOpen && (
                <dd
                  id={`${id}-answer`}
                  role="region"
                  aria-labelledby={id}
                  className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                >
                  {item.answer}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
}
