"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import StateSelector from "@/components/StateSelector";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import {
  calculateSETax,
  calculateFederalTax,
  STANDARD_DEDUCTION_SINGLE,
  SS_WAGE_BASE,
  SS_RATE,
  MEDICARE_RATE,
  formatCurrency,
} from "@/lib/tax";
import { calculateStateTax } from "@/lib/state-taxes";

export default function ComparisonCalculator() {
  const [income, setIncome] = useState(80000);
  const [businessExpenses, setBusinessExpenses] = useState(5000);
  const [healthInsurance, setHealthInsurance] = useState(6000);
  const [retirement, setRetirement] = useState(0);
  const [stateAbbr, setStateAbbr] = useState("NONE");
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");

  const { loadSaved, clearSaved } = useSavedInputs("1099-vs-w2", {
    income, businessExpenses, healthInsurance, retirement, stateAbbr, viewMode,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.income !== undefined) setIncome(saved.income);
      if (saved.businessExpenses !== undefined) setBusinessExpenses(saved.businessExpenses);
      if (saved.healthInsurance !== undefined) setHealthInsurance(saved.healthInsurance);
      if (saved.retirement !== undefined) setRetirement(saved.retirement);
      if (saved.stateAbbr !== undefined) setStateAbbr(saved.stateAbbr);
      if (saved.viewMode !== undefined) setViewMode(saved.viewMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setIncome(80000);
    setBusinessExpenses(5000);
    setHealthInsurance(6000);
    setRetirement(0);
    setStateAbbr("NONE");
    setViewMode("annual");
    clearSaved();
  };

  const results = useMemo(() => {
    // W2 calculation
    const w2Gross = income;
    const w2SS = Math.min(w2Gross, SS_WAGE_BASE) * (SS_RATE / 2);
    const w2Medicare = w2Gross * (MEDICARE_RATE / 2);
    const w2FICA = w2SS + w2Medicare;
    const w2Taxable = Math.max(0, w2Gross - STANDARD_DEDUCTION_SINGLE);
    const w2Federal = calculateFederalTax(w2Taxable);
    const w2State = calculateStateTax(w2Taxable, stateAbbr);
    const w2TotalTax = w2FICA + w2Federal + w2State;
    const w2TakeHome = w2Gross - w2TotalTax;

    const employerHealthInsurance = 4800;
    const employer401kMatch = income * 0.04;
    const ptoDays = 15;
    const ptoValue = (income / 260) * ptoDays;
    const w2BenefitsTotal = employerHealthInsurance + employer401kMatch + ptoValue;
    const w2TotalComp = w2TakeHome + w2BenefitsTotal;

    // 1099 calculation
    const net1099 = income - businessExpenses;
    const se = calculateSETax(net1099);
    const taxable1099 = Math.max(
      0,
      net1099 - se.seDeduction - STANDARD_DEDUCTION_SINGLE - healthInsurance - retirement
    );
    const federal1099 = calculateFederalTax(taxable1099);
    const state1099 = calculateStateTax(taxable1099, stateAbbr);
    const totalTax1099 = se.totalSeTax + federal1099 + state1099;
    const takeHome1099 = net1099 - totalTax1099 - healthInsurance - retirement;

    const difference = takeHome1099 - w2TakeHome;

    // Reverse rate: what hourly rate matches W2 total comp as freelancer
    const billableHours = 1500;
    const effectiveTaxRate = net1099 > 0 ? totalTax1099 / net1099 : 0.3;
    const requiredGross = (w2TotalComp + healthInsurance + retirement) / (1 - effectiveTaxRate);
    const equivalentHourlyRate = requiredGross / billableHours;

    return {
      w2TakeHome, w2TotalTax, w2FICA, w2Federal, w2State,
      w2BenefitsTotal, employerHealthInsurance, employer401kMatch, ptoValue, w2TotalComp,
      takeHome1099, totalTax1099, seTax: se.totalSeTax, federal1099, state1099,
      difference, net1099, equivalentHourlyRate,
    };
  }, [income, businessExpenses, healthInsurance, retirement, stateAbbr]);

  const divisor = viewMode === "monthly" ? 12 : 1;
  const suffix = viewMode === "monthly" ? "/mo" : "/yr";
  const fmt = (n: number) => formatCurrency(n / divisor);

  return (
    <CalculatorLayout
      name="1099 vs W2 Take-Home Comparison"
      slug="1099-vs-w2"
      category="taxes"
      description="Compare what you actually take home as a freelancer (1099) versus an employee (W2) at the same gross income."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Gross Annual Income"
          value={income}
          onChange={setIncome}
          type="currency"
          min={0}
          step={5000}
          helpText="Same amount for both scenarios"
        />
        <SliderInput
          label="Business Expenses (1099 only)"
          value={businessExpenses}
          onChange={setBusinessExpenses}
          type="currency"
          min={0}
          step={500}
          helpText="Deductible expenses as a freelancer"
        />
        <SliderInput
          label="Health Insurance (1099 only)"
          value={healthInsurance}
          onChange={setHealthInsurance}
          type="currency"
          min={0}
          step={500}
          helpText="W2 employers typically cover this"
        />
        <SliderInput
          label="Retirement Contribution (1099 only)"
          value={retirement}
          onChange={setRetirement}
          type="currency"
          min={0}
          step={500}
          helpText="SEP-IRA, Solo 401k, etc."
        />
        <StateSelector value={stateAbbr} onChange={setStateAbbr} />
      </div>

      {/* View toggle */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setViewMode("annual")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "annual"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Annual
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "monthly"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* W2 Column */}
        <div className="rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
          <div className="bg-gray-100 px-4 py-3 text-center dark:bg-gray-800">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide dark:text-gray-300">W2 Employee</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Take-Home {suffix}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{fmt(results.w2TakeHome)}</p>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>FICA (employee half)</span>
                <span className="tabular-nums">{fmt(results.w2FICA)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Federal Income Tax</span>
                <span className="tabular-nums">{fmt(results.w2Federal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-2">
                <span>Total Tax</span>
                <span className="tabular-nums">{fmt(results.w2TotalTax)}</span>
              </div>
            </div>

            {/* Hidden W2 compensation */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Hidden W2 Compensation</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Employer Health Insurance</span>
                  <span className="tabular-nums">{fmt(results.employerHealthInsurance)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>401k Match (4%)</span>
                  <span className="tabular-nums">{fmt(results.employer401kMatch)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>PTO Value (15 days)</span>
                  <span className="tabular-nums">{fmt(results.ptoValue)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-1.5">
                  <span>Total Benefits Value</span>
                  <span className="tabular-nums text-green-600 dark:text-green-400">{fmt(results.w2BenefitsTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1099 Column */}
        <div className="rounded-xl border border-teal-200 overflow-hidden dark:border-teal-800">
          <div className="bg-teal-50 px-4 py-3 text-center dark:bg-teal-950">
            <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wide dark:text-teal-300">1099 Freelancer</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Take-Home {suffix}</p>
              <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">{fmt(results.takeHome1099)}</p>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>SE Tax (15.3%)</span>
                <span className="tabular-nums">{fmt(results.seTax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Federal Income Tax</span>
                <span className="tabular-nums">{fmt(results.federal1099)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-2">
                <span>Total Tax</span>
                <span className="tabular-nums">{fmt(results.totalTax1099)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareResults
        calculatorName="1099 vs W2 Comparison"
        results={{
          "W2 Take-Home": fmt(results.w2TakeHome),
          "1099 Take-Home": fmt(results.takeHome1099),
          "Difference": formatCurrency(results.difference),
          "Equivalent Hourly Rate": formatCurrency(results.equivalentHourlyRate),
        }}
      />

      {/* Difference banner */}
      <div
        className={`mt-6 rounded-lg p-4 text-center ${
          results.difference >= 0
            ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
            : "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
        }`}
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          As a 1099 freelancer, you take home
        </p>
        <p
          className={`text-2xl font-bold ${
            results.difference >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
          }`}
        >
          {formatCurrency(results.difference)} {results.difference >= 0 ? "more" : "less"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {results.difference < 0
            ? "But freelancers can deduct more expenses and set their own rates to compensate."
            : "Your deductions offset the higher self-employment tax."}
        </p>
      </div>

      {/* Reverse rate calculator */}
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">What you&apos;d need to charge as a freelancer</h3>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
          To match the W2 total compensation (take-home + benefits = {formatCurrency(results.w2TotalComp)}/yr), you&apos;d need to charge at least{" "}
          <strong className="text-amber-900 dark:text-amber-200">{formatCurrency(results.equivalentHourlyRate)}/hr</strong>{" "}
          at 1,500 billable hours/year.
        </p>
      </div>

      <SEOContent>
        <h2>1099 vs W2: What Is the Real Difference?</h2>
        <p>The fundamental difference between 1099 and W2 income is who pays employment taxes. As a W2 employee, your employer pays half of FICA taxes (7.65%) and you pay the other half through payroll withholding. As a 1099 contractor, you pay both halves -- the full 15.3% self-employment tax -- because you are both the employer and the employee.</p>
        <p>This means that at the same gross income, a freelancer will always pay more in taxes than an employee. However, freelancers have access to business deductions that employees do not, which can partially or fully offset the difference.</p>

        <h2>Hidden Costs of Freelancing</h2>
        <p>Beyond the higher tax rate, freelancers lose several benefits that W2 employees typically receive:</p>
        <ul>
          <li><strong>Health insurance</strong> -- Employers often cover 50-80% of premiums. As a freelancer, you pay 100% but can deduct it.</li>
          <li><strong>Retirement matching</strong> -- Many employers match 3-6% of salary into a 401(k). Freelancers must fund their own retirement entirely.</li>
          <li><strong>Paid time off</strong> -- Employees get paid vacations and sick days. Every day off as a freelancer is unpaid.</li>
          <li><strong>Equipment and software</strong> -- Employers provide computers, software licenses, and office space. Freelancers buy their own.</li>
        </ul>

        <h2>When Does Freelancing Pay More?</h2>
        <p>Freelancing becomes financially advantageous when you can charge enough to cover the tax difference plus lost benefits, and still come out ahead. Generally, freelancers need to earn 25-40% more gross income than an equivalent W2 salary to achieve the same take-home pay and benefits coverage.</p>
        <p>The real advantage of freelancing is the ability to deduct business expenses, work with multiple clients, and scale your income without a salary cap. Many successful freelancers eventually earn significantly more than they would as employees.</p>
      </SEOContent>

      <FAQ items={[
        { question: "How much more should I charge as a 1099 contractor vs a W2 employee?", answer: "A common rule of thumb is to charge 25-40% more as a contractor than the equivalent W2 salary. This covers the additional self-employment tax (15.3%), health insurance, retirement contributions, and the lack of paid time off. For example, if a job pays $80,000 as a W2, you should aim for $100,000-$112,000 as a 1099." },
        { question: "Can I switch between 1099 and W2 for the same client?", answer: "You cannot choose your classification -- it depends on the working relationship. If the client controls how, when, and where you work, you should be classified as a W2 employee. If you control your own schedule, tools, and methods, you are a 1099 contractor. Misclassification can result in penalties for the hiring company." },
        { question: "Do 1099 contractors pay more taxes than W2 employees?", answer: "Yes, at the same gross income, 1099 contractors pay more in total taxes because they owe the full 15.3% self-employment tax (vs 7.65% for W2 employees). However, contractors can deduct business expenses that employees cannot, which reduces their taxable income. The net difference depends on your deductions." },
        { question: "What deductions can 1099 contractors claim that W2 employees cannot?", answer: "1099 contractors can deduct home office expenses, business equipment, software subscriptions, health insurance premiums, retirement contributions (SEP-IRA or Solo 401k), mileage, internet and phone bills (business portion), professional development, and marketing costs. These deductions are not available to W2 employees." },
        { question: "Is it better to be 1099 or W2?", answer: "Neither is universally better -- it depends on your situation. W2 employment offers stability, benefits, and simpler taxes. 1099 contracting offers flexibility, higher earning potential, and more deductions. If you value freedom and can earn enough to cover the additional costs, freelancing can be very lucrative. If you prefer stability and benefits, W2 employment may be the better fit." },
      ]} />
    </CalculatorLayout>
  );
}
