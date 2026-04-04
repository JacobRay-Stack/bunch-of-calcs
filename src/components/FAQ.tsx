"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Frequently Asked Questions
      </h2>
      <dl className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item, i) => (
          <div key={i} className="py-4">
            <dt>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.question}
                </span>
                <svg
                  className={`ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </dt>
            {openIndex === i && (
              <dd className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
