"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import StateSelector from "@/components/StateSelector";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import {
  calculateSETax,
  calculateFederalTax,
  STANDARD_DEDUCTION_SINGLE,
  QUARTERLY_DUE_DATES,
  formatCurrency,
} from "@/lib/tax";
import { calculateStateTax } from "@/lib/state-taxes";

// ISO dates for Google Calendar links (2026 quarters)
const QUARTER_DATES = [
  { iso: "20260415", isoEnd: "20260416" },
  { iso: "20260615", isoEnd: "20260616" },
  { iso: "20260915", isoEnd: "20260916" },
  { iso: "20270115", isoEnd: "20270116" },
];

function buildCalendarLink(quarter: string, amount: string, date: { iso: string; isoEnd: string }) {
  const title = encodeURIComponent(`${quarter} Tax Payment $${amount}`);
  const details = encodeURIComponent(`Pay $${amount} to IRS via https://www.irs.gov/payments\n\nEstimated quarterly tax payment.`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date.iso}/${date.isoEnd}&details=${details}`;
}

export default function QuarterlyTaxCalculator() {
  const [q1Income, setQ1Income] = useState(20000);
  const [q2Income, setQ2Income] = useState(20000);
  const [q3Income, setQ3Income] = useState(20000);
  const [q4Income, setQ4Income] = useState(20000);
  const [totalDeductions, setTotalDeductions] = useState(5000);
  const [stateAbbr, setStateAbbr] = useState("NONE");
  const [priorYearTax, setPriorYearTax] = useState(0);

  const { loadSaved, clearSaved } = useSavedInputs("quarterly-tax", {
    q1Income, q2Income, q3Income, q4Income, totalDeductions, stateAbbr, priorYearTax,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.q1Income !== undefined) setQ1Income(saved.q1Income);
      if (saved.q2Income !== undefined) setQ2Income(saved.q2Income);
      if (saved.q3Income !== undefined) setQ3Income(saved.q3Income);
      if (saved.q4Income !== undefined) setQ4Income(saved.q4Income);
      if (saved.totalDeductions !== undefined) setTotalDeductions(saved.totalDeductions);
      if (saved.stateAbbr !== undefined) setStateAbbr(saved.stateAbbr);
      if (saved.priorYearTax !== undefined) setPriorYearTax(saved.priorYearTax);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setQ1Income(20000);
    setQ2Income(20000);
    setQ3Income(20000);
    setQ4Income(20000);
    setTotalDeductions(5000);
    setStateAbbr("NONE");
    setPriorYearTax(0);
    clearSaved();
  };

  const quarterIncomes = [q1Income, q2Income, q3Income, q4Income];
  const setters = [setQ1Income, setQ2Income, setQ3Income, setQ4Income];

  const results = useMemo(() => {
    const totalIncome = q1Income + q2Income + q3Income + q4Income;
    const netIncome = totalIncome - totalDeductions;

    const se = calculateSETax(netIncome);
    const taxableIncome = Math.max(0, netIncome - se.seDeduction - STANDARD_DEDUCTION_SINGLE);
    const federalTax = calculateFederalTax(taxableIncome);
    const stateTax = calculateStateTax(taxableIncome, stateAbbr);

    const totalTax = se.totalSeTax + federalTax + stateTax;
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

    // Safe harbor: min of 90% current year or 100%/110% prior year
    let safeHarborPayment = evenPayment;
    if (priorYearTax > 0) {
      const priorYearMultiplier = totalIncome > 150000 ? 1.1 : 1.0;
      const priorYearSafeHarbor = (priorYearTax * priorYearMultiplier) / 4;
      const currentYearSafeHarbor = (totalTax * 0.9) / 4;
      safeHarborPayment = Math.min(priorYearSafeHarbor, currentYearSafeHarbor);
    }

    return { totalIncome, netIncome, seTax: se.totalSeTax, federalTax, stateTax, totalTax, evenPayment, proportional, ytdIncome, safeHarborPayment };
  }, [q1Income, q2Income, q3Income, q4Income, totalDeductions, stateAbbr, priorYearTax]);

  const fmt = formatCurrency;

  return (
    <CalculatorLayout
      name="Quarterly Tax Payment Calculator"
      slug="quarterly-tax"
      category="taxes"
      description="Enter your expected income by quarter. See exactly what to pay the IRS each quarter and when it's due."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {QUARTERLY_DUE_DATES.map((q, i) => (
          <SliderInput
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
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SliderInput
          label="Annual Business Deductions"
          value={totalDeductions}
          onChange={setTotalDeductions}
          type="currency"
          min={0}
          step={500}
          helpText="Total deductible business expenses for the year"
        />
        <SliderInput
          label="Prior Year Total Tax"
          value={priorYearTax}
          onChange={setPriorYearTax}
          type="currency"
          min={0}
          step={500}
          helpText="From last year's return (for safe harbor calc)"
        />
      </div>
      <div className="mt-4">
        <StateSelector value={stateAbbr} onChange={setStateAbbr} />
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

      <ShareResults
        calculatorName="Quarterly Tax Calculator"
        results={{
          "Total Estimated Tax": fmt(results.totalTax),
          "Even Quarterly Payment": fmt(results.evenPayment),
          "SE Tax Portion": fmt(results.seTax),
          "Net Income": fmt(results.netIncome),
        }}
      />

      {/* Safe harbor section */}
      {priorYearTax > 0 && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Safe Harbor Payment</h3>
          <p className="mt-1 text-sm text-green-700 dark:text-green-400">
            Pay at least <strong className="text-green-900 dark:text-green-200">{fmt(results.safeHarborPayment)}/quarter</strong> to avoid underpayment penalties.
            {results.totalIncome > 150000 ? " (110% of prior year tax since AGI > $150K)" : " (100% of prior year tax)"}
          </p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-500">
            Based on the lower of 90% of this year&apos;s tax or {results.totalIncome > 150000 ? "110%" : "100%"} of last year&apos;s tax ({fmt(priorYearTax)}).
          </p>
        </div>
      )}

      {/* Payment schedule */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUARTERLY_DUE_DATES.map((q, i) => {
          const paymentAmount = Math.round(results.proportional[i]);
          const calLink = buildCalendarLink(q.label, paymentAmount.toLocaleString(), QUARTER_DATES[i]);

          return (
            <div
              key={q.label}
              className={`rounded-xl border p-4 ${
                q.isPast
                  ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  : i === 1
                  ? "border-teal-200 bg-teal-50 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-950 dark:ring-teal-800"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{q.label}</span>
                {q.isPast && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">Past</span>
                )}
                {!q.isPast && i === 1 && (
                  <span className="rounded-full bg-teal-200 px-2 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-800 dark:text-teal-200">Next</span>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {fmt(results.proportional[i])}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Income: {fmt(quarterIncomes[i])}
              </p>
              <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2 space-y-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Due: {q.dueDate}</p>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="https://www.irs.gov/payments"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
                  >
                    Pay IRS Now
                  </a>
                  <a
                    href={calLink}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Add to Calendar
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Avoid the underpayment penalty</h3>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
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
        <p>The easiest way to pay is through IRS Direct Pay at irs.gov/payments. Select &quot;Estimated Tax&quot; as the payment type and the correct tax year and quarter. You can also pay by mail using Form 1040-ES vouchers, or set up automatic payments through EFTPS (Electronic Federal Tax Payment System). Keep confirmation numbers for all payments as proof.</p>
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
