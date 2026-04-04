import Link from "next/link";
import calculators from "@/calculators";
import AdSlot from "@/components/AdSlot";

const categoryOrder = ["taxes", "pricing", "profit", "planning"];
const categoryLabels: Record<string, string> = {
  pricing: "Pricing & Rates",
  taxes: "Taxes",
  profit: "Profit & Revenue",
  planning: "Planning",
};

function groupByCategory() {
  const groups: Record<string, typeof calculators> = {};
  for (const calc of calculators) {
    if (!groups[calc.category]) groups[calc.category] = [];
    groups[calc.category].push(calc);
  }
  return categoryOrder
    .filter((cat) => groups[cat])
    .map((cat) => ({ category: cat, items: groups[cat] }));
}

export default function Home() {
  const grouped = groupByCategory();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Free Calculators for Freelancers
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600 dark:text-gray-300">
          Simple, fast tools to help you price your work, estimate taxes, and
          run your freelance business smarter.
        </p>
        <Link
          href="/freelance-rate"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Try the Rate Calculator
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Social proof */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <span><strong className="text-gray-900 dark:text-gray-100">11</strong> free calculators</span>
        <span className="hidden sm:inline">--</span>
        <span><strong className="text-gray-900 dark:text-gray-100">100%</strong> free, no signup</span>
        <span className="hidden sm:inline">--</span>
        <span>Updated for <strong className="text-gray-900 dark:text-gray-100">2026</strong></span>
      </div>

      <div className="mt-8">
        <AdSlot size="banner" />
      </div>

      {grouped.map((group) => (
        <div key={group.category} className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {categoryLabels[group.category]}
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
              >
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {calc.name}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                  {calc.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
