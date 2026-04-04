"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import StateSelector from "@/components/StateSelector";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import {
  calculateSETax,
  calculateFederalTax,
  getMarginalBracket,
  STANDARD_DEDUCTION_SINGLE,
  formatCurrency,
  formatPercent,
} from "@/lib/tax";
import { calculateStateTax } from "@/lib/state-taxes";

export default function SideHustleTaxCalculator() {
  const [w2Income, setW2Income] = useState(55000);
  const [sideIncome, setSideIncome] = useState(15000);
  const [sideExpenses, setSideExpenses] = useState(2000);
  const [stateAbbr, setStateAbbr] = useState("NONE");

  const results = useMemo(() => {
    // Without side hustle
    const w2Taxable = Math.max(0, w2Income - STANDARD_DEDUCTION_SINGLE);
    const w2FedTax = calculateFederalTax(w2Taxable);

    // With side hustle
    const netSide = sideIncome - sideExpenses;
    const se = calculateSETax(netSide, w2Income);

    const combinedTaxable = Math.max(0, w2Income + netSide - se.seDeduction - STANDARD_DEDUCTION_SINGLE);
    const combinedFedTax = calculateFederalTax(combinedTaxable);
    const combinedStateTax = calculateStateTax(combinedTaxable, stateAbbr);
    const w2StateTax = calculateStateTax(w2Taxable, stateAbbr);

    const additionalFedTax = combinedFedTax - w2FedTax;
    const additionalStateTax = combinedStateTax - w2StateTax;
    const totalAdditionalTax = se.totalSeTax + additionalFedTax + additionalStateTax;
    const sideHustleTakeHome = netSide - totalAdditionalTax;
    const effectiveSideRate = netSide > 0 ? (totalAdditionalTax / netSide) * 100 : 0;
    const marginalBracket = getMarginalBracket(combinedTaxable);
    const quarterlyPayment = totalAdditionalTax / 4;

    return {
      w2FedTax,
      netSide,
      seTax: se.totalSeTax,
      additionalFedTax,
      additionalStateTax,
      totalAdditionalTax,
      sideHustleTakeHome,
      effectiveSideRate,
      marginalBracket,
      quarterlyPayment,
      combinedTaxable,
    };
  }, [w2Income, sideIncome, sideExpenses, stateAbbr]);

  const fmt = formatCurrency;
  const pct = formatPercent;

  return (
    <CalculatorLayout
      name="Side Hustle Tax Calculator"
      slug="side-hustle-tax"
      category="taxes"
      description="Have a W2 job and freelance on the side? See exactly how much extra tax your side income creates and what you actually keep."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <SliderInput
          label="W2 Salary"
          value={w2Income}
          onChange={setW2Income}
          type="currency"
          min={0}
          step={5000}
          helpText="Your day job gross income"
        />
        <SliderInput
          label="Side Hustle Income"
          value={sideIncome}
          onChange={setSideIncome}
          type="currency"
          min={0}
          step={1000}
          helpText="Total 1099 / freelance income"
        />
        <SliderInput
          label="Side Hustle Expenses"
          value={sideExpenses}
          onChange={setSideExpenses}
          type="currency"
          min={0}
          step={500}
          helpText="Deductible business expenses"
        />
      </div>
      <div className="mt-4">
        <StateSelector value={stateAbbr} onChange={setStateAbbr} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="You Keep From Side Hustle"
          value={fmt(results.sideHustleTakeHome)}
          highlight
          subtext={`${fmt(results.sideHustleTakeHome / 12)}/month`}
        />
        <ResultCard
          label="Additional Tax Owed"
          value={fmt(results.totalAdditionalTax)}
          subtext={`Effective rate: ${pct(results.effectiveSideRate)}`}
        />
        <ResultCard
          label="Quarterly Payment"
          value={fmt(results.quarterlyPayment)}
          subtext="Pay this 4x/year to IRS"
        />
        <ResultCard
          label="Marginal Tax Bracket"
          value={pct(results.marginalBracket)}
          subtext="Your highest bracket with side income"
        />
      </div>

      {/* Where the tax comes from */}
      <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Tax on Your Side Hustle Income</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between px-4 py-3 text-sm text-gray-700">
            <span>Net Side Income</span>
            <span className="tabular-nums font-medium">{fmt(results.netSide)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm text-gray-700">
            <span>Self-Employment Tax (15.3%)</span>
            <span className="tabular-nums font-medium text-red-600">{fmt(results.seTax)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm text-gray-700">
            <span>Additional Federal Income Tax</span>
            <span className="tabular-nums font-medium text-red-600">{fmt(results.additionalFedTax)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm font-bold text-gray-900 bg-gray-50">
            <span>Total Additional Tax</span>
            <span className="tabular-nums text-red-600">{fmt(results.totalAdditionalTax)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm font-bold text-green-700 bg-green-50">
            <span>What You Actually Keep</span>
            <span className="tabular-nums">{fmt(results.sideHustleTakeHome)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-800">Why the tax feels high</h3>
        <p className="mt-1 text-sm text-blue-700">
          Side hustle income sits on top of your W2 salary, so it&apos;s taxed at your marginal rate
          ({pct(results.marginalBracket)}), not your average rate. Plus you pay the full 15.3% SE
          tax since there&apos;s no employer to cover half. Deducting business expenses is the best
          way to reduce this.
        </p>
      </div>

      <SEOContent>
        <h2>How Side Hustle Income Is Taxed</h2>
        <p>Side hustle income is taxed differently than your W2 salary. Your employer handles tax withholding for your day job, but nobody withholds taxes on your freelance income. You are responsible for paying both income tax and self-employment tax on your side earnings.</p>
        <p>The tricky part: your side hustle income sits on top of your W2 income for tax purposes. This means it is taxed at your marginal rate -- the highest bracket your combined income falls into -- not the average rate you see on your W2. This is why many people are surprised by how much tax their side income generates.</p>

        <h2>Self-Employment Tax on Side Income</h2>
        <p>In addition to income tax, side hustle earnings are subject to the 15.3% self-employment tax (Social Security + Medicare). Your W2 employer pays half of FICA taxes on your salary, but there is no employer for your side income -- you pay the full amount. On $15,000 of net side income, that is roughly $2,300 in SE tax alone, before income tax.</p>

        <h2>Do You Need to Make Quarterly Payments?</h2>
        <p>If you expect to owe $1,000 or more in taxes from your side hustle, the IRS expects you to make quarterly estimated tax payments. If you skip these, you will owe a penalty when you file your annual return. The quarterly due dates are April 15, June 15, September 15, and January 15.</p>
        <p>An alternative is to increase your W2 withholding by filing a new W-4 with your employer. This can cover your side hustle tax through your regular paycheck and avoid quarterly payments entirely.</p>
      </SEOContent>

      <FAQ items={[
        { question: "Do I have to pay taxes on side hustle income under $600?", answer: "Yes. All self-employment income of $400 or more is taxable, regardless of whether you receive a 1099 form. The $600 threshold only determines whether the payer is required to send you a 1099 -- it does not determine your tax obligation. You must report all income." },
        { question: "Can I deduct side hustle expenses against my W2 income?", answer: "Side hustle business expenses can only offset your side hustle income, not your W2 salary. However, if your side hustle has a net loss (expenses exceed income), that loss can offset other income including your W2 wages, potentially reducing your overall tax bill." },
        { question: "Should I increase my W2 withholding instead of making quarterly payments?", answer: "Yes, this is a convenient alternative. Submit a new W-4 to your employer requesting additional federal withholding each pay period. The IRS treats W2 withholding as paid evenly throughout the year, so you will not owe quarterly underpayment penalties even if you increase withholding late in the year." },
        { question: "At what point should I make my side hustle a full-time business?", answer: "Consider going full-time when your side hustle consistently earns enough to cover all your expenses (including health insurance and retirement) with a safety buffer of 3-6 months of savings. Use our 1099 vs W2 calculator to compare the true take-home pay between your options." },
        { question: "What is the $400 threshold for self-employment tax?", answer: "If your net self-employment income (after deductions) is $400 or more, you must pay self-employment tax. Below $400, you are exempt from SE tax but may still owe income tax on the earnings. This threshold applies per year, not per client or per month." },
      ]} />
    </CalculatorLayout>
  );
}
