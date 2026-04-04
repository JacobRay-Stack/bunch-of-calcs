"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const INDUSTRY_BENCHMARKS = [
  { label: "Freelance Services", min: 50, max: 80 },
  { label: "SaaS", min: 70, max: 90 },
  { label: "E-commerce", min: 30, max: 50 },
  { label: "Consulting", min: 40, max: 70 },
] as const;

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState(10000);
  const [cogs, setCogs] = useState(4000);
  const [operatingExpenses, setOperatingExpenses] = useState(2000);
  const [selectedIndustry, setSelectedIndustry] = useState(0);
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");

  const displayMultiplier = viewMode === "annual" ? 12 : 1;
  const displayRevenue = revenue * displayMultiplier;
  const displayCogs = cogs * displayMultiplier;
  const displayExpenses = operatingExpenses * displayMultiplier;

  const results = useMemo(() => {
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;

    // What-if scenarios
    const raise10Revenue = revenue * 1.1;
    const raise10NetProfit = raise10Revenue - cogs - operatingExpenses;
    const raise10Margin = raise10Revenue > 0 ? (raise10NetProfit / raise10Revenue) * 100 : 0;

    const cut10Costs = cogs * 0.9;
    const cut10NetProfit = revenue - cut10Costs - operatingExpenses;
    const cut10Margin = revenue > 0 ? (cut10NetProfit / revenue) * 100 : 0;

    return { grossProfit, netProfit, grossMargin, netMargin, markup, raise10Margin, raise10NetProfit, cut10Margin, cut10NetProfit };
  }, [revenue, cogs, operatingExpenses]);

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");
  const pct = (n: number) => n.toFixed(1) + "%";

  const barPct = (n: number) => Math.max(0, Math.min(100, n));

  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry];
  const marginComparison =
    results.netMargin < benchmark.min
      ? "below"
      : results.netMargin > benchmark.max
      ? "above"
      : "within";

  return (
    <CalculatorLayout
      name="Profit Margin Calculator"
      slug="profit-margin"
      category="profit"
      description="Calculate gross margin, net margin, and markup from your revenue and costs. See exactly where your money goes."
    >
      {/* View toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("annual")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "annual"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <SliderInput
          label={`Revenue (${viewMode})`}
          value={revenue}
          onChange={setRevenue}
          type="currency"
          min={0}
          step={500}
          helpText="Total income or sales"
        />
        <SliderInput
          label={`Cost of Goods/Services (${viewMode})`}
          value={cogs}
          onChange={setCogs}
          type="currency"
          min={0}
          step={500}
          helpText="Direct costs to deliver"
        />
        <SliderInput
          label={`Operating Expenses (${viewMode})`}
          value={operatingExpenses}
          onChange={setOperatingExpenses}
          type="currency"
          min={0}
          step={500}
          helpText="Overhead, rent, software, etc."
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Gross Margin"
          value={pct(results.grossMargin)}
          highlight
          subtext={`${fmt(results.grossProfit * displayMultiplier)} profit${viewMode === "annual" ? "/yr" : "/mo"}`}
        />
        <ResultCard
          label="Net Margin"
          value={pct(results.netMargin)}
          highlight={results.netMargin > 0}
          subtext={`${fmt(results.netProfit * displayMultiplier)} ${results.netProfit >= 0 ? "profit" : "loss"}${viewMode === "annual" ? "/yr" : "/mo"}`}
        />
        <ResultCard
          label="Markup"
          value={pct(results.markup)}
          subtext="On cost of goods"
        />
      </div>

      {/* Industry benchmarks */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Industry Comparison</h3>
        <div className="mt-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(Number(e.target.value))}
            className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {INDUSTRY_BENCHMARKS.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-sm text-blue-700 dark:text-blue-400">
          {benchmark.label} typically has {benchmark.min}-{benchmark.max}% net margins. Your {pct(results.netMargin)} is{" "}
          <strong className={marginComparison === "below" ? "text-red-600 dark:text-red-400" : marginComparison === "above" ? "text-green-600 dark:text-green-400" : ""}>
            {marginComparison} the typical range
          </strong>.
          {marginComparison === "below" && " Consider raising prices or cutting costs."}
        </p>
      </div>

      {/* What-if scenarios */}
      <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">What If?</h3>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-4 text-center bg-blue-50 dark:bg-blue-950">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Current</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{pct(results.netMargin)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{fmt(results.netProfit * displayMultiplier)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Raise Prices 10%</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{pct(results.raise10Margin)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{fmt(results.raise10NetProfit * displayMultiplier)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Cut Costs 10%</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{pct(results.cut10Margin)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{fmt(results.cut10NetProfit * displayMultiplier)}</p>
          </div>
        </div>
      </div>

      {/* Visual breakdown */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue Breakdown</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Cost of Goods/Services</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{fmt(displayCogs)}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-400 transition-all duration-300"
                style={{ width: `${barPct(revenue > 0 ? (cogs / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Operating Expenses</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{fmt(displayExpenses)}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${barPct(revenue > 0 ? (operatingExpenses / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Net Profit</span>
              <span className={`font-medium ${results.netProfit >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {fmt(results.netProfit * displayMultiplier)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${results.netProfit >= 0 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${barPct(revenue > 0 ? (Math.abs(results.netProfit) / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Margin vs Markup</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          <strong>Margin</strong> is profit as a percentage of revenue (what you keep from each dollar earned).{" "}
          <strong>Markup</strong> is profit as a percentage of cost (how much you add on top of your costs).
          A 50% markup = 33.3% margin. They&apos;re related but not the same.
        </p>
      </div>

      <SEOContent>
        <h2>What Is Profit Margin?</h2>
        <p>Profit margin is the percentage of revenue that remains as profit after subtracting costs. It tells you how much money you actually keep from every dollar you earn. A 30% profit margin means you keep $0.30 of every $1.00 in revenue -- the other $0.70 goes to costs.</p>
        <p>There are two main types: gross profit margin (revenue minus direct costs) and net profit margin (revenue minus all costs including overhead). For freelancers, gross margin tells you if your pricing covers the direct cost of delivering work, while net margin tells you if your business is profitable overall.</p>

        <h2>Profit Margin vs Markup: The Difference</h2>
        <p>Margin and markup are often confused but they measure different things. Margin is profit divided by revenue. Markup is profit divided by cost. They always produce different numbers from the same data:</p>
        <ul>
          <li>If you buy something for $60 and sell it for $100: margin is 40% ($40/$100) but markup is 66.7% ($40/$60)</li>
          <li>A 50% markup always equals a 33.3% margin</li>
          <li>A 100% markup equals a 50% margin</li>
          <li>Margin can never exceed 100%, but markup can be any number</li>
        </ul>

        <h2>What Is a Good Profit Margin?</h2>
        <p>Profit margins vary significantly by industry and business type:</p>
        <ul>
          <li><strong>Freelance services</strong> -- 50-80% gross margin is typical since your main cost is your time</li>
          <li><strong>SaaS businesses</strong> -- 70-90% gross margins are common due to low marginal costs</li>
          <li><strong>Retail and e-commerce</strong> -- 30-50% gross margin depending on product type</li>
          <li><strong>Restaurants</strong> -- 3-9% net margin (one of the tightest in any industry)</li>
        </ul>
        <p>For freelancers, a healthy net profit margin after all expenses (including taxes and health insurance) is 30-50%. If yours is below 20%, your rates may be too low or your expenses too high.</p>
      </SEOContent>

      <FAQ items={[
        { question: "How do I calculate profit margin?", answer: "Profit margin = (Revenue - Costs) / Revenue x 100. For example, if you charge $5,000 for a project and your costs are $2,000, your profit margin is ($5,000 - $2,000) / $5,000 x 100 = 60%." },
        { question: "What is the difference between gross and net profit margin?", answer: "Gross profit margin only subtracts direct costs (costs of delivering the service or product). Net profit margin subtracts all costs including overhead like rent, software subscriptions, insurance, and taxes. Net margin is always lower than gross margin and gives a more complete picture of profitability." },
        { question: "What profit margin should freelancers aim for?", answer: "Freelancers should aim for a gross margin of 50-80% and a net margin of 30-50% after all business expenses. If your margins are lower, consider raising your rates, reducing expenses, or improving efficiency." },
        { question: "How can I increase my profit margin?", answer: "There are two ways: increase revenue (raise rates, upsell additional services, work faster) or decrease costs (eliminate unnecessary subscriptions, find cheaper tools, reduce overhead). For most freelancers, raising rates is the fastest path to better margins." },
        { question: "Is a high profit margin always good?", answer: "Generally yes, but an extremely high margin could mean you are underinvesting in your business (not spending on marketing, tools, or professional development) or underpricing your services. The goal is sustainable profitability, not the highest possible number." },
      ]} />
    </CalculatorLayout>
  );
}
