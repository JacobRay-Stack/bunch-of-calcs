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

const homepageFaq = [
  { question: "Are these calculators really free?", answer: "Yes, all 11 calculators are completely free with no signup required. We make money through ads, not subscriptions." },
  { question: "How accurate are the tax calculators?", answer: "Our tax calculators use 2026 IRS tax brackets, self-employment tax rates, and standard deductions. They provide estimates -- consult a tax professional for exact filing numbers." },
  { question: "Who are these calculators built for?", answer: "Freelancers, independent contractors, solopreneurs, and anyone with 1099 income. Whether you are just starting out or have been freelancing for years, these tools help you price your work and plan for taxes." },
  { question: "Can I use these calculators for my business?", answer: "Absolutely. The profit margin, break-even, and project pricing calculators work for any small business or solo operation. The tax calculators are specific to US self-employment income." },
];

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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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

      {/* SEO content */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Why Use Our Freelance Calculators?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Freelancing comes with financial complexity that traditional employees never deal with. You pay both halves of employment taxes, buy your own health insurance, fund your own retirement, and price your own work with no salary benchmark to lean on. These calculators take the guesswork out of the math so you can make informed decisions about your rates, taxes, and profitability.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Every calculator is built specifically for freelancers, independent contractors, and solopreneurs. They use current 2026 tax rates, account for self-employment tax, and factor in the hidden costs that most generic calculators miss. No signups, no paywalls, no email capture -- just the numbers you need.
        </p>
      </div>

      {/* Homepage FAQ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Frequently Asked Questions
        </h2>
        <dl className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
          {homepageFaq.map((item, i) => (
            <div key={i} className="py-4">
              <dt className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
