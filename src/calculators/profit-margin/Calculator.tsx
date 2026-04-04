"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState(10000);
  const [cogs, setCogs] = useState(4000);
  const [operatingExpenses, setOperatingExpenses] = useState(2000);

  const results = useMemo(() => {
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;

    return { grossProfit, netProfit, grossMargin, netMargin, markup };
  }, [revenue, cogs, operatingExpenses]);

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");
  const pct = (n: number) => n.toFixed(1) + "%";

  // Visual bar width
  const barPct = (n: number) => Math.max(0, Math.min(100, n));

  return (
    <CalculatorLayout
      name="Profit Margin Calculator"
      slug="profit-margin"
      category="profit"
      description="Calculate gross margin, net margin, and markup from your revenue and costs. See exactly where your money goes."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <SliderInput
          label="Revenue"
          value={revenue}
          onChange={setRevenue}
          type="currency"
          min={0}
          step={500}
          helpText="Total income or sales"
        />
        <SliderInput
          label="Cost of Goods/Services"
          value={cogs}
          onChange={setCogs}
          type="currency"
          min={0}
          step={500}
          helpText="Direct costs to deliver"
        />
        <SliderInput
          label="Operating Expenses"
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
          subtext={`${fmt(results.grossProfit)} profit`}
        />
        <ResultCard
          label="Net Margin"
          value={pct(results.netMargin)}
          highlight={results.netMargin > 0}
          subtext={`${fmt(results.netProfit)} ${results.netProfit >= 0 ? "profit" : "loss"}`}
        />
        <ResultCard
          label="Markup"
          value={pct(results.markup)}
          subtext="On cost of goods"
        />
      </div>

      {/* Visual breakdown */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Revenue Breakdown</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Cost of Goods/Services</span>
              <span className="font-medium text-gray-900">{fmt(cogs)}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-400 transition-all duration-300"
                style={{ width: `${barPct(revenue > 0 ? (cogs / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Operating Expenses</span>
              <span className="font-medium text-gray-900">{fmt(operatingExpenses)}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${barPct(revenue > 0 ? (operatingExpenses / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Net Profit</span>
              <span className={`font-medium ${results.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {fmt(results.netProfit)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${results.netProfit >= 0 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${barPct(revenue > 0 ? (Math.abs(results.netProfit) / revenue) * 100 : 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-700">Margin vs Markup</h3>
        <p className="mt-1 text-sm text-gray-600">
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
