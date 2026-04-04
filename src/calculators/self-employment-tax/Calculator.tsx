"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const SE_TAX_RATE = 0.153;
const SE_TAXABLE_PORTION = 0.9235;
const SS_WAGE_BASE = 184500;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;
const ADDITIONAL_MEDICARE_RATE = 0.009;

const FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

function calculateFederalTax(taxableIncome: number) {
  let tax = 0;
  for (const bracket of FEDERAL_BRACKETS_SINGLE) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

const FAQ_ITEMS = [
  {
    question: "What is the self-employment tax rate for 2026?",
    answer: "The self-employment tax rate is 15.3%. This breaks down into 12.4% for Social Security and 2.9% for Medicare. You pay both the employer and employee portions since you work for yourself. If your net earnings exceed $200,000, you also pay an additional 0.9% Medicare surtax on income above that threshold.",
  },
  {
    question: "Who has to pay self-employment tax?",
    answer: "You must pay self-employment tax if your net self-employment income is $400 or more per year. This applies to freelancers, independent contractors, sole proprietors, and anyone who receives 1099 income. Even if you have a day job and freelance on the side, your side income is subject to SE tax.",
  },
  {
    question: "Can I deduct half of my self-employment tax?",
    answer: "Yes. The IRS allows you to deduct 50% of your self-employment tax from your gross income. This is an above-the-line deduction, meaning you get it whether you itemize or take the standard deduction. This calculator accounts for this deduction automatically.",
  },
  {
    question: "When are quarterly tax payments due?",
    answer: "For 2026, estimated quarterly payments are due: April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15, 2027 (Q4). If you expect to owe $1,000 or more in taxes, you should make quarterly payments to avoid an underpayment penalty.",
  },
  {
    question: "How can I reduce my self-employment tax?",
    answer: "The most effective ways to reduce SE tax are: maximize business deductions to lower net income, contribute to a SEP-IRA or Solo 401(k) for retirement, deduct health insurance premiums, claim the home office deduction, and track all business expenses including mileage, equipment, and software subscriptions.",
  },
];

export default function SelfEmploymentTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(80000);
  const [deductions, setDeductions] = useState(5000);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");

  const results = useMemo(() => {
    const netIncome = grossIncome - deductions;
    const seTaxableIncome = netIncome * SE_TAXABLE_PORTION;
    const ssSideBase = Math.min(seTaxableIncome, SS_WAGE_BASE);
    const ssTax = ssSideBase * SS_RATE;
    const medicareTax = seTaxableIncome * MEDICARE_RATE;
    const additionalMedicare =
      seTaxableIncome > ADDITIONAL_MEDICARE_THRESHOLD
        ? (seTaxableIncome - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
        : 0;
    const totalSeTax = ssTax + medicareTax + additionalMedicare;
    const seDeduction = totalSeTax / 2;
    const standardDeduction = filingStatus === "single" ? 15700 : 31400;
    const taxableIncome = Math.max(0, netIncome - seDeduction - standardDeduction);
    const federalTax = calculateFederalTax(taxableIncome);
    const totalTax = totalSeTax + federalTax;
    const quarterlyPayment = totalTax / 4;
    const effectiveRate = netIncome > 0 ? (totalTax / netIncome) * 100 : 0;
    const takeHome = netIncome - totalTax;

    return { netIncome, totalSeTax, ssTax, medicareTax, additionalMedicare, seDeduction, federalTax, totalTax, quarterlyPayment, effectiveRate, takeHome };
  }, [grossIncome, deductions, filingStatus]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  const pct = (n: number) => n.toFixed(1) + "%";

  return (
    <CalculatorLayout
      name="Self-Employment Tax Calculator"
      slug="self-employment-tax"
      category="taxes"
      description="Estimate your SE tax (15.3%), federal income tax, and quarterly payments. Updated for the 2026 tax year."
    >
      <div className="space-y-5">
        <SliderInput label="Gross Self-Employment Income" value={grossIncome} onChange={setGrossIncome} min={0} max={500000} step={1000} type="currency" helpText="Total 1099 income before expenses" />
        <SliderInput label="Business Deductions" value={deductions} onChange={setDeductions} min={0} max={100000} step={500} type="currency" helpText="Total deductible business expenses" />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filing Status</label>
          <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value as "single" | "married")} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
      </div>

      <HeroResult
        label="Quarterly Payment Due"
        value={fmt(results.quarterlyPayment)}
        subtext={`Pay this amount 4x per year to avoid IRS penalties. Total annual tax: ${fmt(results.totalTax)}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Total Annual Tax" value={fmt(results.totalTax)} subtext={`Effective rate: ${pct(results.effectiveRate)}`} />
        <ResultCard label="Annual Take-Home" value={fmt(results.takeHome)} subtext="After all federal taxes" />
        <ResultCard label="Monthly Take-Home" value={fmt(results.takeHome / 12)} subtext="Average per month" />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tax Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            { label: "Net Self-Employment Income", value: fmt(results.netIncome) },
            { label: "Social Security Tax (12.4%)", value: fmt(results.ssTax) },
            { label: "Medicare Tax (2.9%)", value: fmt(results.medicareTax) },
            ...(results.additionalMedicare > 0 ? [{ label: "Additional Medicare (0.9%)", value: fmt(results.additionalMedicare) }] : []),
            { label: "Total SE Tax (15.3%)", value: fmt(results.totalSeTax), bold: true },
            { label: "SE Tax Deduction (50%)", value: `−${fmt(results.seDeduction)}` },
            { label: "Federal Income Tax", value: fmt(results.federalTax) },
          ].map((row) => (
            <div key={row.label} className={`flex justify-between px-4 py-2.5 text-sm ${"bold" in row && row.bold ? "bg-gray-50 font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
              <span>{row.label}</span>
              <span className="tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">2026 Quarterly Due Dates</h3>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-400">
          <div>Q1: April 15, 2026</div>
          <div>Q2: June 15, 2026</div>
          <div>Q3: September 15, 2026</div>
          <div>Q4: January 15, 2027</div>
        </div>
        <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">Each payment: {fmt(results.quarterlyPayment)}</p>
      </div>

      <SEOContent>
        <h2>What Is Self-Employment Tax?</h2>
        <p>Self-employment tax is a federal tax that covers Social Security and Medicare contributions for people who work for themselves. When you work as an employee, your employer pays half of these taxes and you pay the other half through payroll withholding. As a freelancer or independent contractor, you pay both halves -- a combined rate of 15.3% on your net self-employment income.</p>
        <p>The 15.3% rate breaks down into two parts: 12.4% goes to Social Security (on income up to $184,500 in 2026) and 2.9% goes to Medicare (on all income, with no cap). If your net earnings exceed $200,000 as a single filer, you also owe an additional 0.9% Medicare surtax.</p>

        <h2>How Self-Employment Tax Is Calculated</h2>
        <p>The IRS applies self-employment tax to 92.35% of your net self-employment income -- not the full amount. This adjustment accounts for the employer-equivalent portion of the tax. Here is the step-by-step calculation:</p>
        <ol>
          <li>Start with your gross 1099 income</li>
          <li>Subtract all deductible business expenses to get net income</li>
          <li>Multiply net income by 92.35% to get the SE tax base</li>
          <li>Apply the 15.3% SE tax rate to that base</li>
          <li>Deduct half of the SE tax from your gross income (this reduces your income tax)</li>
          <li>Calculate federal income tax on the remaining taxable income</li>
        </ol>

        <h2>Ways to Reduce Your Self-Employment Tax</h2>
        <p>The most effective strategy is to maximize your business deductions. Every dollar you deduct reduces your net income, which directly reduces your SE tax. Common deductions for freelancers include:</p>
        <ul>
          <li><strong>Home office deduction</strong> -- $5 per square foot, up to 300 sq ft ($1,500 max)</li>
          <li><strong>Health insurance premiums</strong> -- 100% deductible if self-employed</li>
          <li><strong>Retirement contributions</strong> -- SEP-IRA (up to 25% of net income) or Solo 401(k)</li>
          <li><strong>Business equipment</strong> -- Computers, software, phones, monitors</li>
          <li><strong>Mileage</strong> -- 70 cents per mile for business driving in 2026</li>
          <li><strong>Internet and phone</strong> -- Business percentage of your bills</li>
        </ul>
        <p>Contributing to a retirement plan is particularly powerful because it reduces your taxable income while building long-term wealth. A SEP-IRA allows you to contribute up to 25% of your net self-employment income, up to $69,000 in 2026.</p>
      </SEOContent>

      <FAQ items={FAQ_ITEMS} />
    </CalculatorLayout>
  );
}
