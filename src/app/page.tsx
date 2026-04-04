import Link from "next/link";
import calculators from "@/calculators";
import AdSlot from "@/components/AdSlot";

const categoryLabels: Record<string, string> = {
  pricing: "Pricing",
  taxes: "Taxes",
  profit: "Profit",
  planning: "Planning",
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Free Calculators for Freelancers
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Simple, fast tools to help you price your work, estimate taxes, and
          run your freelance business smarter.
        </p>
      </div>

      <div className="mt-8">
        <AdSlot size="banner" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/50"
          >
            <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {categoryLabels[calc.category] || calc.category}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {calc.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{calc.description}</p>
          </Link>
        ))}
      </div>

      {calculators.length < 4 && (
        <p className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">
          More calculators coming soon.
        </p>
      )}
    </div>
  );
}
