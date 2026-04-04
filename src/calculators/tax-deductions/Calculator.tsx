"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const CATEGORIES = [
  { key: "homeOffice", label: "Home Office", helpText: "Simplified method: $5/sq ft, max 300 sq ft ($1,500)" },
  { key: "equipment", label: "Equipment & Software", helpText: "Computer, phone, monitors, subscriptions, tools" },
  { key: "internet", label: "Internet & Phone", helpText: "Business percentage of your bills" },
  { key: "travel", label: "Travel & Transportation", helpText: "Business travel, mileage (70 cents/mile for 2026)" },
  { key: "education", label: "Education & Training", helpText: "Courses, books, conferences related to your work" },
  { key: "health", label: "Health Insurance", helpText: "100% deductible for self-employed if not eligible for employer plan" },
  { key: "retirement", label: "Retirement (SEP-IRA / Solo 401k)", helpText: "Up to 25% of net SE income or $69,000" },
  { key: "marketing", label: "Marketing & Advertising", helpText: "Website, ads, business cards, portfolio hosting" },
  { key: "professional", label: "Professional Services", helpText: "Accountant, lawyer, bookkeeper fees" },
  { key: "other", label: "Other Deductions", helpText: "Coworking, supplies, meals (50%), etc." },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function TaxDeductionCalculator() {
  const [grossIncome, setGrossIncome] = useState(80000);
  const [taxRate, setTaxRate] = useState(30);
  const [expenses, setExpenses] = useState<Record<CategoryKey, number>>({
    homeOffice: 1500,
    equipment: 2000,
    internet: 1200,
    travel: 500,
    education: 300,
    health: 6000,
    retirement: 0,
    marketing: 600,
    professional: 500,
    other: 400,
  });

  const results = useMemo(() => {
    const totalDeductions = Object.values(expenses).reduce((sum, v) => sum + v, 0);
    const taxSavings = totalDeductions * (taxRate / 100);
    const effectiveIncome = grossIncome - totalDeductions;
    const monthlyTaxSavings = taxSavings / 12;

    const sorted = CATEGORIES.map((c) => ({
      ...c,
      value: expenses[c.key],
      saving: expenses[c.key] * (taxRate / 100),
    })).sort((a, b) => b.value - a.value);

    return { totalDeductions, taxSavings, effectiveIncome, monthlyTaxSavings, sorted };
  }, [grossIncome, taxRate, expenses]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  const updateExpense = (key: CategoryKey, value: number) => {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CalculatorLayout
      name="Freelance Tax Deduction Estimator"
      slug="tax-deductions"
      category="taxes"
      description="Enter your business expenses by category and see how much they save you in taxes. Every dollar you deduct reduces your taxable income."
    >
      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <InputField
          label="Gross Annual Income"
          value={grossIncome}
          onChange={setGrossIncome}
          type="currency"
          min={0}
          step={5000}
        />
        <InputField
          label="Estimated Tax Rate"
          value={taxRate}
          onChange={setTaxRate}
          type="percentage"
          min={0}
          max={60}
          helpText="Combined federal + SE + state"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-4">Deductible Expenses</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <InputField
            key={cat.key}
            label={cat.label}
            value={expenses[cat.key]}
            onChange={(v) => updateExpense(cat.key, v)}
            type="currency"
            min={0}
            step={100}
            helpText={cat.helpText}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Total Deductions"
          value={fmt(results.totalDeductions)}
          subtext="Reduces your taxable income"
        />
        <ResultCard
          label="Estimated Tax Savings"
          value={fmt(results.taxSavings)}
          highlight
          subtext={`${fmt(results.monthlyTaxSavings)}/month`}
        />
        <ResultCard
          label="Taxable Income"
          value={fmt(results.effectiveIncome)}
          subtext={`Down from ${fmt(grossIncome)}`}
        />
      </div>

      {/* Visual breakdown */}
      <div className="mt-8 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Deduction Breakdown</h3>
        {results.sorted
          .filter((c) => c.value > 0)
          .map((cat) => (
            <div key={cat.key} className="flex items-center gap-3">
              <div className="w-32 truncate text-sm text-gray-600">{cat.label}</div>
              <div className="flex-1 h-4 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${results.totalDeductions > 0 ? (cat.value / results.totalDeductions) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="w-20 text-right text-sm tabular-nums font-medium text-gray-900">
                {fmt(cat.value)}
              </div>
              <div className="w-20 text-right text-xs tabular-nums text-green-600">
                saves {fmt(cat.saving)}
              </div>
            </div>
          ))}
      </div>

      <SEOContent>
        <h2>Common Freelance Tax Deductions</h2>
        <p>As a self-employed worker, you can deduct ordinary and necessary business expenses from your taxable income. Every dollar you deduct saves you money on both self-employment tax (15.3%) and income tax. A $1,000 deduction at a 30% combined tax rate saves you $300 in taxes.</p>

        <h2>Top Deductions Freelancers Miss</h2>
        <ul>
          <li><strong>Home office deduction</strong> -- The simplified method lets you deduct $5 per square foot of dedicated office space, up to 300 sq ft ($1,500). You do not need a separate room -- a dedicated desk area qualifies.</li>
          <li><strong>Health insurance premiums</strong> -- If you are self-employed and not eligible for a spouse employer plan, 100% of your health, dental, and vision premiums are deductible. This is one of the largest deductions available.</li>
          <li><strong>Retirement contributions</strong> -- SEP-IRA contributions (up to 25% of net income, max $69,000) or Solo 401(k) contributions reduce your taxable income significantly.</li>
          <li><strong>Self-employment tax deduction</strong> -- You can deduct half of your SE tax from gross income. This happens automatically but many freelancers forget to account for it.</li>
          <li><strong>Professional development</strong> -- Courses, books, conferences, and certifications related to your work are fully deductible.</li>
        </ul>

        <h2>How to Track Deductions</h2>
        <p>The IRS requires documentation for every deduction. The easiest approach is to use a dedicated business bank account and credit card, then categorize expenses monthly. Keep digital copies of all receipts. Apps like QuickBooks Self-Employed or Wave can automate most of this tracking.</p>
      </SEOContent>

      <FAQ items={[
        { question: "What qualifies as a business deduction for freelancers?", answer: "Any expense that is ordinary (common in your industry) and necessary (helpful for your business) qualifies as a deduction. This includes equipment, software, internet, phone, travel, education, marketing, insurance, and home office costs. The expense must be primarily for business use." },
        { question: "Can I deduct my internet and phone bill?", answer: "You can deduct the business percentage of your internet and phone bills. If you use your internet 60% for work and 40% for personal use, you can deduct 60% of the cost. Keep a log of your usage to support the deduction if audited." },
        { question: "How does the home office deduction work?", answer: "There are two methods: the simplified method ($5/sq ft, max $1,500) and the regular method (calculate actual expenses based on the percentage of your home used for business). The simplified method is easier but the regular method can yield a larger deduction if your home expenses are high." },
        { question: "What records do I need to keep for deductions?", answer: "Keep receipts, bank statements, and invoices for all business expenses. For vehicle deductions, maintain a mileage log. For home office, know your office square footage. The IRS recommends keeping records for at least 3 years from the date you file your return." },
        { question: "Can I deduct meals and entertainment?", answer: "Business meals are 50% deductible when you discuss business with a client, prospect, or colleague. Entertainment expenses (concerts, sporting events) are generally no longer deductible after the 2017 tax reform. Keep receipts and note who you met with and the business purpose." },
      ]} />
    </CalculatorLayout>
  );
}
