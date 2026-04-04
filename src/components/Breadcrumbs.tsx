import Link from "next/link";

interface BreadcrumbsProps {
  category: string;
  calculatorName: string;
}

const categoryLabels: Record<string, string> = {
  pricing: "Pricing",
  taxes: "Taxes",
  profit: "Profit",
  planning: "Planning",
};

export default function Breadcrumbs({
  category,
  calculatorName,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-500 dark:text-gray-400">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span className="text-gray-400 dark:text-gray-500">
            {categoryLabels[category] || category}
          </span>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span className="text-gray-700 dark:text-gray-300">{calculatorName}</span>
        </li>
      </ol>
    </nav>
  );
}
