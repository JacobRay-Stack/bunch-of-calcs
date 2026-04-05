import Link from "next/link";
import calculators from "@/calculators";
import { getAllPosts } from "@/lib/blog";
import AdSlot from "@/components/AdSlot";

const categoryOrder = ["taxes", "pricing", "business"];
const categoryLabels: Record<string, string> = {
  pricing: "Pricing & Rates",
  taxes: "Taxes",
  business: "Business & Planning",
};

// Map categories to icons (SVG paths)
const categoryIcons: Record<string, { path: string; viewBox?: string }> = {
  taxes: {
    path: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
  },
  pricing: {
    path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  business: {
    path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
};

// Individual calc icons based on what they do
const calcIcons: Record<string, string> = {
  "self-employment-tax": "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
  "1099-vs-w2": "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  "tax-deductions": "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  "side-hustle-tax": "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "quarterly-tax": "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  "freelance-rate": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "salary-converter": "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  "invoice-fees": "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  "project-price": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "profit-margin": "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  "break-even": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  "lifestyle-budget": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  "client-value": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  "emergency-fund": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "hire-calculator": "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
};

const homepageFaq = [
  { question: "Are these calculators really free?", answer: "Yes, all 15 calculators are completely free with no signup required. We make money through ads, not subscriptions." },
  { question: "How accurate are the tax calculators?", answer: `Our tax calculators use ${new Date().getFullYear()} IRS tax brackets, self-employment tax rates, and standard deductions. They provide estimates -- consult a tax professional for exact filing numbers.` },
  { question: "Who are these calculators built for?", answer: "Freelancers, independent contractors, solopreneurs, and anyone with 1099 income. Whether you are just starting out or have been freelancing for years, these tools help you price your work and plan for taxes." },
  { question: "Can I use these calculators for my business?", answer: "Absolutely. The profit margin, break-even, and project pricing calculators work for any small business or solo operation. The tax calculators are specific to US self-employment income." },
];

function groupByCategory() {
  const groups: Record<string, typeof calculators> = {};
  for (const calc of calculators) {
    // Merge "profit" and "planning" into "business"
    const cat = calc.category === "profit" || calc.category === "planning" ? "business" : calc.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(calc);
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

      {/* Hero */}
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

      {/* Trust signals - moved higher (#30) */}
      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-4 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-gray-900 dark:text-gray-100">15</strong> free calculators</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Updated for <strong className="text-gray-900 dark:text-gray-100">{new Date().getFullYear()}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Data stays in your browser</span>
          </div>
        </div>
      </div>

      {/* Why use these - moved up from bottom (#30) */}
      <div className="mt-8 text-center">
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Built specifically for freelancers, contractors, and solopreneurs. Uses current {new Date().getFullYear()} tax
          rates, accounts for self-employment tax, and factors in hidden costs that generic calculators miss.
        </p>
      </div>

      <div className="mt-6">
        <AdSlot size="banner" />
      </div>

      {/* Calculator grid with icons (#11) and merged categories (#12) */}
      {grouped.map((group) => (
        <div key={group.category} className="mt-10">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[group.category]?.path || ""} />
            </svg>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {categoryLabels[group.category]}
            </h2>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={calcIcons[calc.slug] || categoryIcons[group.category]?.path || ""} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {calc.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Detailed SEO content */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Why Use Our Freelance Calculators?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Freelancing comes with financial complexity that traditional employees never deal with. You pay both halves of{" "}
          <Link href="/self-employment-tax" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">employment taxes</Link>,
          buy your own health insurance, fund your own retirement, and{" "}
          <Link href="/freelance-rate" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">price your own work</Link>{" "}
          with no salary benchmark to lean on. These calculators take the guesswork out of the math so you can make informed decisions about your rates, taxes, and profitability.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Every calculator is built specifically for freelancers, independent contractors, and solopreneurs. They use
          current {new Date().getFullYear()} tax rates, account for{" "}
          <Link href="/self-employment-tax" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">self-employment tax</Link>,
          and factor in the hidden costs that most generic calculators miss. No signups, no paywalls -- just the numbers you need to{" "}
          <Link href="/break-even" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">break even</Link> and{" "}
          <Link href="/profit-margin" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">stay profitable</Link>.
        </p>
      </div>

      {/* Blog preview */}
      {(() => {
        const posts = getAllPosts().slice(0, 3);
        if (posts.length === 0) return null;
        return (
          <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">From the Blog</h2>
              <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View all &rarr;
              </Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
                >
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{post.category}</span>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

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
