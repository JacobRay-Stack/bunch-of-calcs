"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const SE_TAXABLE = 0.9235;
const SE_RATE = 0.153;
const STANDARD_DEDUCTION = 15700;
const BRACKETS = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

function fedTax(income: number) {
  let tax = 0;
  for (const b of BRACKETS) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

const QUARTERS = [
  { label: "Q1", months: "Jan - Mar", dueDate: "April 15, 2026", isPast: true },
  { label: "Q2", months: "Apr - May", dueDate: "June 15, 2026", isPast: false },
  { label: "Q3", months: "Jun - Aug", dueDate: "September 15, 2026", isPast: false },
  { label: "Q4", months: "Sep - Dec", dueDate: "January 15, 2027", isPast: false },
];

export default function QuarterlyTaxCalculator() {
  const [q1Income, setQ1Income] = useState(20000);
  const [q2Income, setQ2Income] = useState(20000);
  const [q3Income, setQ3Income] = useState(20000);
  const [q4Income, setQ4Income] = useState(20000);
  const [totalDeductions, setTotalDeductions] = useState(5000);

  const quarterIncomes = [q1Income, q2Income, q3Income, q4Income];
  const setters = [setQ1Income, setQ2Income, setQ3Income, setQ4Income];

  const results = useMemo(() => {
    const totalIncome = q1Income + q2Income + q3Income + q4Income;
    const netIncome = totalIncome - totalDeductions;

    // SE tax
    const seTaxable = netIncome * SE_TAXABLE;
    const seTax = seTaxable * SE_RATE;
    const seDeduction = seTax / 2;

    // Federal tax
    const taxableIncome = Math.max(0, netIncome - seDeduction - STANDARD_DEDUCTION);
    const federalTax = fedTax(taxableIncome);

    const totalTax = seTax + federalTax;
    const evenPayment = totalTax / 4;

    // Proportional payments based on income per quarter
    const proportional = quarterIncomes.map((qi) => {
      const proportion = totalIncome > 0 ? qi / totalIncome : 0.25;
      return totalTax * proportion;
    });

    const ytdIncome = quarterIncomes.reduce<number[]>((acc, qi, i) => {
      acc.push((acc[i - 1] || 0) + qi);
      return acc;
    }, []);

    return { totalIncome, netIncome, seTax, federalTax, totalTax, evenPayment, proportional, ytdIncome };
  }, [q1Income, q2Income, q3Income, q4Income, totalDeductions]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="Quarterly Tax Payment Calculator"
      slug="quarterly-tax"
      category="taxes"
      description="Enter your expected income by quarter. See exactly what to pay the IRS each quarter and when it's due."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {QUARTERS.map((q, i) => (
          <InputField
            key={q.label}
            label={`${q.label} Income (${q.months})`}
            value={quarterIncomes[i]}
            onChange={setters[i]}
            type="currency"
            min={0}
            step={1000}
          />
        ))}
      </div>
      <div className="mt-4 max-w-sm">
        <InputField
          label="Annual Business Deductions"
          value={totalDeductions}
          onChange={setTotalDeductions}
          type="currency"
          min={0}
          step={500}
          helpText="Total deductible business expenses for the year"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Total Estimated Tax"
          value={fmt(results.totalTax)}
          subtext={`On ${fmt(results.netIncome)} net income`}
        />
        <ResultCard
          label="Even Quarterly Payment"
          value={fmt(results.evenPayment)}
          highlight
          subtext="Same amount each quarter"
        />
        <ResultCard
          label="SE Tax Portion"
          value={fmt(results.seTax)}
          subtext="15.3% self-employment tax"
        />
      </div>

      {/* Payment schedule */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUARTERS.map((q, i) => (
          <div
            key={q.label}
            className={`rounded-xl border p-4 ${
              q.isPast
                ? "border-gray-200 bg-gray-50"
                : i === 1
                ? "border-blue-200 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">{q.label}</span>
              {q.isPast && (
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">Past</span>
              )}
              {!q.isPast && i === 1 && (
                <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">Next</span>
              )}
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 tabular-nums">
              {fmt(results.proportional[i])}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Income: {fmt(quarterIncomes[i])}
            </p>
            <div className="mt-3 border-t border-gray-200 pt-2">
              <p className="text-xs font-medium text-gray-600">Due: {q.dueDate}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-800">Avoid the underpayment penalty</h3>
        <p className="mt-1 text-sm text-amber-700">
          The IRS charges a penalty if you owe more than $1,000 at tax time and didn&apos;t pay at least
          90% of this year&apos;s tax or 100% of last year&apos;s tax through quarterly payments.
          When in doubt, pay a little more each quarter -- you&apos;ll get the overpayment back as a refund.
        </p>
      </div>

      <SEOContent>
        <h2>What Are Quarterly Estimated Tax Payments?</h2>
        <p>Quarterly estimated tax payments are how self-employed workers pay their taxes throughout the year. Unlike W2 employees who have taxes withheld from every paycheck, freelancers and contractors must calculate and send their own tax payments to the IRS four times per year.</p>
        <p>The IRS operates on a pay-as-you-go system. They expect to receive tax payments close to when income is earned, not in one lump sum at tax time. If you wait until April to pay all your taxes, you will owe an underpayment penalty on top of the tax itself.</p>

        <h2>Who Needs to Make Quarterly Payments?</h2>
        <p>You should make quarterly estimated tax payments if you expect to owe $1,000 or more in federal tax for the year after subtracting withholding and credits. This applies to freelancers, independent contractors, sole proprietors, and anyone with significant income not subject to withholding.</p>
        <p>There are two safe harbor rules that protect you from penalties: pay at least 90% of your current year tax liability, or pay 100% of last year tax liability (110% if your AGI was over $150,000). Meeting either threshold avoids the underpayment penalty even if you end up owing at tax time.</p>

        <h2>How to Pay Quarterly Taxes</h2>
        <p>The easiest way to pay is through IRS Direct Pay at irs.gov/payments. Select "Estimated Tax" as the payment type and the correct tax year and quarter. You can also pay by mail using Form 1040-ES vouchers, or set up automatic payments through EFTPS (Electronic Federal Tax Payment System). Keep confirmation numbers for all payments as proof.</p>
      </SEOContent>

      <FAQ items={[
        { question: "When are quarterly estimated tax payments due in 2026?", answer: "Q1 (January-March income): April 15, 2026. Q2 (April-May income): June 15, 2026. Q3 (June-August income): September 15, 2026. Q4 (September-December income): January 15, 2027. If a due date falls on a weekend or holiday, the deadline moves to the next business day." },
        { question: "What happens if I miss a quarterly payment?", answer: "The IRS charges an underpayment penalty calculated based on the federal short-term interest rate plus 3 percentage points. The penalty applies to each quarter individually -- missing Q1 but paying Q2-Q4 on time means you only owe a penalty on Q1. The penalty is typically modest but adds up if you miss multiple quarters." },
        { question: "How do I calculate my quarterly payment amount?", answer: "Estimate your total annual tax (income tax + self-employment tax), then divide by four for equal payments. If your income varies by quarter, you can use the annualized income installment method to pay proportionally based on when income was actually earned. This calculator supports both approaches." },
        { question: "Can I skip quarterly payments if I also have a W2 job?", answer: "Yes, if your W2 withholding is high enough to cover your total tax liability (including self-employment tax on side income), you may not need to make quarterly payments. You can increase your W2 withholding by filing a new W-4 with your employer to cover your freelance tax obligation." },
        { question: "Do I need to make state quarterly payments too?", answer: "Most states with income tax require quarterly estimated payments following similar rules to the federal system. Check your state tax authority website for specific due dates and thresholds. Some states have different due dates than the IRS." },
      ]} />
    </CalculatorLayout>
  );
}
