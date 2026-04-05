"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import CalculatorLayout from "@/components/CalculatorLayout";
import { buildCalculatorLink } from "@/lib/calculator-links";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import ResultCard from "@/components/ResultCard";
import StateSelector from "@/components/StateSelector";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import ScenarioCompare from "@/components/ScenarioCompare";
import { generateHowToJsonLd } from "@/lib/seo";
import {
  calculateSETax,
  calculateFederalTax,
  getStandardDeduction,
  formatCurrency,
  formatPercent,
  TAX_YEAR,
  QUARTERLY_DUE_DATES,
  type FilingStatus,
} from "@/lib/tax";
import { calculateStateTax } from "@/lib/state-taxes";

const FAQ_ITEMS = [
  { question: "What is the self-employment tax rate for 2026?", answer: "The self-employment tax rate is 15.3%. This breaks down into 12.4% for Social Security and 2.9% for Medicare. You pay both the employer and employee portions since you work for yourself. If your net earnings exceed $200,000, you also pay an additional 0.9% Medicare surtax on income above that threshold." },
  { question: "Who has to pay self-employment tax?", answer: "You must pay self-employment tax if your net self-employment income is $400 or more per year. This applies to freelancers, independent contractors, sole proprietors, and anyone who receives 1099 income. Even if you have a day job and freelance on the side, your side income is subject to SE tax." },
  { question: "Can I deduct half of my self-employment tax?", answer: "Yes. The IRS allows you to deduct 50% of your self-employment tax from your gross income. This is an above-the-line deduction, meaning you get it whether you itemize or take the standard deduction. This calculator accounts for this deduction automatically." },
  { question: "When are quarterly tax payments due?", answer: "For 2026, estimated quarterly payments are due: April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15, 2027 (Q4). If you expect to owe $1,000 or more in taxes, you should make quarterly payments to avoid an underpayment penalty." },
  { question: "How can I reduce my self-employment tax?", answer: "The most effective ways to reduce SE tax are: maximize business deductions to lower net income, contribute to a SEP-IRA or Solo 401(k) for retirement, deduct health insurance premiums, claim the home office deduction, and track all business expenses including mileage, equipment, and software subscriptions." },
];

export default function SelfEmploymentTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(80000);
  const [deductions, setDeductions] = useState(5000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [stateAbbr, setStateAbbr] = useState("NONE");
  const [retirementPct, setRetirementPct] = useState(0);

  const { loadSaved, clearSaved } = useSavedInputs("self-employment-tax", {
    grossIncome, deductions, filingStatus, stateAbbr, retirementPct,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.grossIncome !== undefined) setGrossIncome(saved.grossIncome);
      if (saved.deductions !== undefined) setDeductions(saved.deductions);
      if (saved.filingStatus !== undefined) setFilingStatus(saved.filingStatus);
      if (saved.stateAbbr !== undefined) setStateAbbr(saved.stateAbbr);
      if (saved.retirementPct !== undefined) setRetirementPct(saved.retirementPct);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setGrossIncome(80000);
    setDeductions(5000);
    setFilingStatus("single");
    setStateAbbr("NONE");
    setRetirementPct(0);
    clearSaved();
  };

  const results = useMemo(() => {
    const netIncome = grossIncome - deductions;

    // Calculate retirement contribution (SEP-IRA: up to 25% of net, max $69K)
    const maxRetirement = Math.min(netIncome * 0.25, 69000);
    const retirementContribution = Math.min(netIncome * (retirementPct / 100), maxRetirement);

    // Base calculation (without retirement)
    const se = calculateSETax(netIncome);
    const standardDeduction = getStandardDeduction(filingStatus);
    const taxableIncome = Math.max(0, netIncome - se.seDeduction - standardDeduction);
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const stateTax = calculateStateTax(taxableIncome, stateAbbr);
    const totalTax = se.totalSeTax + federalTax + stateTax;

    // With retirement contribution
    const taxableWithRetirement = Math.max(0, netIncome - se.seDeduction - standardDeduction - retirementContribution);
    const federalTaxWithRetirement = calculateFederalTax(taxableWithRetirement, filingStatus);
    const stateTaxWithRetirement = calculateStateTax(taxableWithRetirement, stateAbbr);
    const totalTaxWithRetirement = se.totalSeTax + federalTaxWithRetirement + stateTaxWithRetirement;
    const retirementTaxSavings = totalTax - totalTaxWithRetirement;

    const effectiveTotalTax = retirementContribution > 0 ? totalTaxWithRetirement : totalTax;
    const quarterlyPayment = effectiveTotalTax / 4;
    const effectiveRate = netIncome > 0 ? (effectiveTotalTax / netIncome) * 100 : 0;
    const takeHome = netIncome - effectiveTotalTax - retirementContribution;

    return {
      netIncome, ...se, federalTax, stateTax, totalTax,
      quarterlyPayment, effectiveRate, takeHome, taxableIncome,
      retirementContribution, retirementTaxSavings, totalTaxWithRetirement,
      effectiveTotalTax, maxRetirement,
    };
  }, [grossIncome, deductions, filingStatus, stateAbbr, retirementPct]);

  const fmt = formatCurrency;
  const pct = formatPercent;

  return (
    <CalculatorLayout name="Self-Employment Tax Calculator" slug="self-employment-tax" category="taxes" description={`Estimate your SE tax (15.3%), federal income tax, state tax, and quarterly payments. Updated for the ${TAX_YEAR} tax year.`} onReset={handleReset} serviceContext={`Your estimated tax is ${fmt(results.effectiveTotalTax)}/yr -- these tools help you file, track deductions, and stay organized.`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateHowToJsonLd(
          "How Self-Employment Tax Is Calculated",
          [
            "Start with your gross 1099 income",
            "Subtract all deductible business expenses to get net income",
            "Multiply net income by 92.35% to get the SE tax base",
            "Apply the 15.3% SE tax rate to that base",
            "Deduct half of the SE tax from your gross income (this reduces your income tax)",
            "Calculate federal income tax on the remaining taxable income",
          ]
        )) }}
      />
      <div className="space-y-5">
        <SliderInput label="Gross Self-Employment Income" value={grossIncome} onChange={setGrossIncome} min={0} max={500000} step={1000} type="currency" helpText="Total 1099 income before expenses" />
        <SliderInput label="Business Deductions" value={deductions} onChange={setDeductions} min={0} max={100000} step={500} type="currency" helpText="Total deductible business expenses" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Filing Status</label>
            <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value as FilingStatus)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
          <StateSelector value={stateAbbr} onChange={setStateAbbr} />
        </div>
      </div>

      <HeroResult label="Quarterly Payment Due" value={fmt(results.quarterlyPayment)} subtext={`Pay this amount 4x per year to avoid IRS penalties. Total annual tax: ${fmt(results.effectiveTotalTax)}`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Total Annual Tax" value={fmt(results.effectiveTotalTax)} subtext={`Effective rate: ${pct(results.effectiveRate)}`} />
        <ResultCard label="Annual Take-Home" value={fmt(results.takeHome)} subtext="After all taxes" />
        <ResultCard label="Monthly Take-Home" value={fmt(results.takeHome / 12)} subtext="Average per month" />
      </div>

      <ShareResults
        calculatorName="Self-Employment Tax Calculator"
        results={{
          "Total Annual Tax": fmt(results.effectiveTotalTax),
          "Quarterly Payment": fmt(results.quarterlyPayment),
          "Annual Take-Home": fmt(results.takeHome),
          "Effective Tax Rate": pct(results.effectiveRate),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Annual Tax": fmt(results.effectiveTotalTax),
          "Quarterly Payment": fmt(results.quarterlyPayment),
          "Take-Home": fmt(results.takeHome),
          "Effective Rate": pct(results.effectiveRate),
        }}
        currentLabel="Current"
      />

      {/* Retirement savings scenario */}
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
          SEP-IRA Retirement Savings
        </h3>
        <p className="text-xs text-green-600 dark:text-green-400 mb-3">
          Max contribution: {fmt(results.maxRetirement)}/yr (25% of net income, cap $69K)
        </p>
        <SliderInput
          label="Retirement Contribution"
          value={retirementPct}
          onChange={setRetirementPct}
          type="percentage"
          min={0}
          max={25}
          step={1}
          helpText="Percentage of net income to contribute"
        />
        {results.retirementContribution > 0 && (
          <div className="mt-3 rounded-md bg-green-100 dark:bg-green-900 p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              Contributing <strong>{fmt(results.retirementContribution)}</strong>/yr saves you{" "}
              <strong>{fmt(results.retirementTaxSavings)}</strong> in taxes.
              Your effective tax rate drops from {pct(results.netIncome > 0 ? (results.totalTax / results.netIncome) * 100 : 0)} to {pct(results.effectiveRate)}.
            </p>
          </div>
        )}
      </div>

      {/* Tax breakdown */}
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
            ...(results.retirementContribution > 0 ? [{ label: "Retirement Deduction", value: `−${fmt(results.retirementContribution)}` }] : []),
            { label: "Federal Income Tax", value: fmt(results.federalTax) },
            ...(results.stateTax > 0 ? [{ label: "State Income Tax (est.)", value: fmt(results.stateTax) }] : []),
          ].map((row) => (
            <div key={row.label} className={`flex justify-between px-4 py-2.5 text-sm ${"bold" in row && row.bold ? "bg-gray-50 font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
              <span>{row.label}</span>
              <span className="tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly due dates */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">{TAX_YEAR} Quarterly Due Dates</h3>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-400">
          {QUARTERLY_DUE_DATES.map((q) => (
            <div key={q.label}>{q.label}: {q.dueDate}</div>
          ))}
        </div>
        <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">Each payment: {fmt(results.quarterlyPayment)}</p>
      </div>

      {/* Cross-link to quarterly tax */}
      <div className="mt-6 text-center">
        <Link
          href={buildCalculatorLink("quarterly-tax", {})}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          See your quarterly payment schedule &rarr;
        </Link>
      </div>

      {/* Contextual commentary */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Your effective tax rate of <strong>{pct(results.effectiveRate)}</strong> means you work roughly <strong>{Math.round(results.effectiveRate * 3.65)} days per year</strong> just for taxes.
          {results.effectiveRate > 35 && " Consider maximizing retirement contributions and business deductions to bring this down."}
          {results.effectiveRate < 20 && " That's a relatively low effective rate -- your deductions are working well."}
        </p>
      </div>

      <SEOContent>
        <h2>What Is Self-Employment Tax?</h2>
        <p>Self-employment tax is a federal tax that covers Social Security and Medicare contributions for people who work for themselves. When you work as an employee, your employer pays half of these taxes and you pay the other half through payroll withholding. As a freelancer or independent contractor, you pay both halves -- a combined rate of 15.3% on your net self-employment income. Wondering how this compares to a regular job? Try the <a href="/1099-vs-w2">1099 vs W2 comparison</a>.</p>
        <p>The 15.3% rate breaks down into two parts: 12.4% goes to Social Security (on income up to $184,500 in {TAX_YEAR}) and 2.9% goes to Medicare (on all income, with no cap). If your net earnings exceed $200,000 as a single filer, you also owe an additional 0.9% Medicare surtax.</p>

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
        <p>The most effective strategy is to maximize your <a href="/tax-deductions">business deductions</a>. Every dollar you deduct reduces your net income, which directly reduces your SE tax. Common deductions for freelancers include:</p>
        <ul>
          <li><strong>Home office deduction</strong> -- $5 per square foot, up to 300 sq ft ($1,500 max)</li>
          <li><strong>Health insurance premiums</strong> -- 100% deductible if self-employed</li>
          <li><strong>Retirement contributions</strong> -- SEP-IRA (up to 25% of net income) or Solo 401(k)</li>
          <li><strong>Business equipment</strong> -- Computers, software, phones, monitors</li>
          <li><strong>Mileage</strong> -- 70 cents per mile for business driving in {TAX_YEAR}</li>
          <li><strong>Internet and phone</strong> -- Business percentage of your bills</li>
        </ul>
        <p>Use the <a href="/tax-deductions">Freelance Tax Deduction Estimator</a> to calculate your total deduction amount and see how much it lowers your tax bill. Once you know your rate, the <a href="/quarterly-tax">Quarterly Tax Payment Calculator</a> helps you plan each payment with exact due dates.</p>
      </SEOContent>

      <FAQ items={FAQ_ITEMS} />
    </CalculatorLayout>
  );
}
