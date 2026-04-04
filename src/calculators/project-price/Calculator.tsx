"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

export default function ProjectPriceCalculator() {
  const [hourlyRate, setHourlyRate] = useState(75);
  const [estimatedHours, setEstimatedHours] = useState(40);
  const [expenses, setExpenses] = useState(200);
  const [profitMargin, setProfitMargin] = useState(20);
  const [bufferPct, setBufferPct] = useState(15);

  const results = useMemo(() => {
    const laborCost = hourlyRate * estimatedHours;
    const buffer = laborCost * (bufferPct / 100);
    const subtotal = laborCost + buffer + expenses;
    const profit = subtotal * (profitMargin / 100);
    const totalQuote = subtotal + profit;
    const effectiveHourly = estimatedHours > 0 ? totalQuote / estimatedHours : 0;
    const perDay = estimatedHours > 0 ? totalQuote / (estimatedHours / 8) : 0;

    return { laborCost, buffer, subtotal, profit, totalQuote, effectiveHourly, perDay };
  }, [hourlyRate, estimatedHours, expenses, profitMargin, bufferPct]);

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="Project Price Calculator"
      slug="project-price"
      category="pricing"
      description="Turn your hourly rate into a professional project quote. Includes a scope-creep buffer and profit margin."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Your Hourly Rate"
          value={hourlyRate}
          onChange={setHourlyRate}
          type="currency"
          min={0}
          step={5}
        />
        <InputField
          label="Estimated Hours"
          value={estimatedHours}
          onChange={setEstimatedHours}
          min={1}
          step={1}
          helpText="Best guess for the full project"
        />
        <InputField
          label="Project Expenses"
          value={expenses}
          onChange={setExpenses}
          type="currency"
          min={0}
          step={50}
          helpText="Stock images, hosting, domains, etc."
        />
        <InputField
          label="Scope Creep Buffer"
          value={bufferPct}
          onChange={setBufferPct}
          type="percentage"
          min={0}
          max={100}
          helpText="Extra padding for unexpected work (15-25% typical)"
        />
        <InputField
          label="Profit Margin"
          value={profitMargin}
          onChange={setProfitMargin}
          type="percentage"
          min={0}
          max={100}
          helpText="Your profit on top of costs"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Quote the Client"
          value={fmt(results.totalQuote)}
          highlight
          subtext="Your total project price"
        />
        <ResultCard
          label="Effective Hourly Rate"
          value={fmt(results.effectiveHourly)}
          subtext="What you actually earn per hour"
        />
        <ResultCard
          label="Effective Day Rate"
          value={fmt(results.perDay)}
          subtext="Based on 8-hour days"
        />
      </div>

      {/* Quote breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Quote Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between px-5 py-3 text-sm text-gray-700">
            <span>Labor ({estimatedHours}hrs x {fmt(hourlyRate)})</span>
            <span className="tabular-nums font-medium">{fmt(results.laborCost)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm text-gray-700">
            <span>Scope Buffer ({bufferPct}%)</span>
            <span className="tabular-nums font-medium">{fmt(results.buffer)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm text-gray-700">
            <span>Expenses</span>
            <span className="tabular-nums font-medium">{fmt(expenses)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm text-gray-600 bg-gray-50">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium">{fmt(results.subtotal)}</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm text-gray-700">
            <span>Profit Margin ({profitMargin}%)</span>
            <span className="tabular-nums font-medium text-green-600">+{fmt(results.profit)}</span>
          </div>
          <div className="flex justify-between px-5 py-4 text-base font-bold text-gray-900 bg-blue-50">
            <span>Total Project Quote</span>
            <span className="tabular-nums">{fmt(results.totalQuote)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-800">Pricing tip</h3>
        <p className="mt-1 text-sm text-amber-700">
          Always include a scope-creep buffer. Projects almost never take exactly the estimated hours.
          A 15-25% buffer protects your profit without scaring the client -- it&apos;s built into your quote,
          not listed as a separate line item.
        </p>
      </div>

      <SEOContent>
        <h2>How to Price a Freelance Project</h2>
        <p>Project pricing is both an art and a science. The science is calculating your costs and desired profit. The art is understanding what the client values and pricing accordingly. This calculator handles the science -- you handle the art.</p>
        <p>The basic formula: (Hourly Rate x Estimated Hours) + Scope Buffer + Expenses + Profit Margin = Project Quote. Each component serves a purpose, and skipping any of them means leaving money on the table or losing money on the project.</p>

        <h2>Why You Need a Scope Creep Buffer</h2>
        <p>Scope creep is when a project grows beyond the original agreement. It happens on almost every project -- the client adds "just one more thing" or the requirements evolve as you work. A 15-25% buffer protects your profit margin when this happens.</p>
        <p>The key is to build the buffer into your quote, not list it separately. A $5,000 quote with a built-in 20% buffer means you estimated 33 hours but quoted based on 40. If scope creep happens, you are covered. If it does not, you earn more per hour than expected.</p>

        <h2>When to Use Hourly vs Project Pricing</h2>
        <ul>
          <li><strong>Project pricing works best</strong> when the scope is clear, the deliverables are defined, and you have experience with similar projects. It rewards efficiency and gives clients cost certainty.</li>
          <li><strong>Hourly pricing works best</strong> when the scope is uncertain, the project is open-ended, or you are doing ongoing retainer work. It protects you when requirements change frequently.</li>
          <li><strong>Value-based pricing</strong> is the most advanced approach -- pricing based on the outcome or value delivered rather than time spent. This works best when you can quantify the ROI for the client.</li>
        </ul>
      </SEOContent>

      <FAQ items={[
        { question: "How do I estimate hours for a freelance project?", answer: "Break the project into individual tasks and estimate each one separately. Add them up, then add 15-25% for tasks you did not anticipate. If you have done similar projects before, use your actual time from those as a baseline. When in doubt, your first estimate is almost always too low -- multiply by 1.5 as a reality check." },
        { question: "Should I include revisions in my project quote?", answer: "Yes. Define the number of revision rounds included in your quote (typically 2-3 rounds). Additional revisions beyond that should be billed at your hourly rate. State this clearly in your proposal to set expectations upfront." },
        { question: "What profit margin should I add to my project quote?", answer: "A 15-25% profit margin on top of your costs is standard for freelance work. This is separate from your hourly rate -- your rate already covers your salary and taxes. The profit margin accounts for business growth, savings, and the risk of the project taking longer than expected." },
        { question: "How do I handle expenses in a project quote?", answer: "List project-specific expenses (stock photos, hosting, domains, premium plugins) as a separate line item in your proposal. Some freelancers mark up expenses by 10-15%, others pass them through at cost. Either approach is standard -- just be transparent about it." },
        { question: "What if the client says my quote is too high?", answer: "Before lowering your price, try reducing scope instead. Ask which features or deliverables are most important and offer a phased approach: Phase 1 at a lower price covers the essentials, Phase 2 can be added later. Never lower your rate -- lower the scope to match the budget." },
      ]} />
    </CalculatorLayout>
  );
}
