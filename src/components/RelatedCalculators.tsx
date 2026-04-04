"use client";

import Link from "next/link";
import calculators from "@/calculators";

interface RelatedCalculatorsProps {
  currentSlug: string;
  maxItems?: number;
}

const categoryLabels: Record<string, string> = {
  pricing: "Pricing",
  taxes: "Taxes",
  profit: "Profit",
  planning: "Planning",
};

export default function RelatedCalculators({
  currentSlug,
  maxItems = 3,
}: RelatedCalculatorsProps) {
  const current = calculators.find((c) => c.slug === currentSlug);
  if (!current) return null;

  const related = calculators
    .filter((c) => c.slug !== currentSlug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 0 : 1;
      const bMatch = b.category === current.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Related Calculators</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
          >
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {categoryLabels[calc.category] || calc.category}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {calc.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
              {calc.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
