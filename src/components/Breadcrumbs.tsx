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

const SITE_URL = "https://www.bunchofcalcs.com";

export default function Breadcrumbs({
  category,
  calculatorName,
}: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabels[category] || category,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculatorName,
      },
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-500 dark:text-gray-400">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
