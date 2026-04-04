"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const SE_TAXABLE = 0.9235;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const SS_WAGE_BASE = 184500;
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

export default function ComparisonCalculator() {
  const [income, setIncome] = useState(80000);
  const [businessExpenses, setBusinessExpenses] = useState(5000);
  const [healthInsurance, setHealthInsurance] = useState(6000);
  const [retirement, setRetirement] = useState(0);

  const results = useMemo(() => {
    // W2 calculation
    const w2Gross = income;
    const w2SS = Math.min(w2Gross, SS_WAGE_BASE) * (SS_RATE / 2); // Employee half
    const w2Medicare = w2Gross * (MEDICARE_RATE / 2);
    const w2FICA = w2SS + w2Medicare;
    const w2Taxable = Math.max(0, w2Gross - STANDARD_DEDUCTION);
    const w2Federal = fedTax(w2Taxable);
    const w2TotalTax = w2FICA + w2Federal;
    const w2TakeHome = w2Gross - w2TotalTax;

    // 1099 calculation
    const net1099 = income - businessExpenses;
    const seTaxable = net1099 * SE_TAXABLE;
    const seSS = Math.min(seTaxable, SS_WAGE_BASE) * SS_RATE;
    const seMedicare = seTaxable * MEDICARE_RATE;
    const seTax = seSS + seMedicare;
    const seDeduction = seTax / 2;
    const taxable1099 = Math.max(
      0,
      net1099 - seDeduction - STANDARD_DEDUCTION - healthInsurance - retirement
    );
    const federal1099 = fedTax(taxable1099);
    const totalTax1099 = seTax + federal1099;
    const takeHome1099 = net1099 - totalTax1099 - healthInsurance - retirement;

    const difference = takeHome1099 - w2TakeHome;

    return { w2TakeHome, w2TotalTax, w2FICA, w2Federal, takeHome1099, totalTax1099, seTax, federal1099, difference, net1099 };
  }, [income, businessExpenses, healthInsurance, retirement]);

  const fmt = (n: number) => "$" + Math.round(Math.abs(n)).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="1099 vs W2 Take-Home Comparison"
      slug="1099-vs-w2"
      category="taxes"
      description="Compare what you actually take home as a freelancer (1099) versus an employee (W2) at the same gross income."
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
      </div>

      {/* Side-by-side comparison */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* W2 Column */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 text-center">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">W2 Employee</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Annual Take-Home</p>
              <p className="text-3xl font-bold text-gray-900">{fmt(results.w2TakeHome)}</p>
              <p className="text-sm text-gray-500 mt-1">{fmt(results.w2TakeHome / 12)}/mo</p>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>FICA (employee half)</span>
                <span className="tabular-nums">{fmt(results.w2FICA)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Federal Income Tax</span>
                <span className="tabular-nums">{fmt(results.w2Federal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Tax</span>
                <span className="tabular-nums">{fmt(results.w2TotalTax)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1099 Column */}
        <div className="rounded-xl border border-blue-200 overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 text-center">
            <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">1099 Freelancer</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Annual Take-Home</p>
              <p className="text-3xl font-bold text-blue-700">{fmt(results.takeHome1099)}</p>
              <p className="text-sm text-gray-500 mt-1">{fmt(results.takeHome1099 / 12)}/mo</p>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>SE Tax (15.3%)</span>
                <span className="tabular-nums">{fmt(results.seTax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Federal Income Tax</span>
                <span className="tabular-nums">{fmt(results.federal1099)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Tax</span>
                <span className="tabular-nums">{fmt(results.totalTax1099)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difference banner */}
      <div
        className={`mt-6 rounded-lg p-4 text-center ${
          results.difference >= 0
            ? "border border-green-200 bg-green-50"
            : "border border-red-200 bg-red-50"
        }`}
      >
        <p className="text-sm font-medium text-gray-700">
          As a 1099 freelancer, you take home
        </p>
        <p
          className={`text-2xl font-bold ${
            results.difference >= 0 ? "text-green-700" : "text-red-700"
          }`}
        >
          {fmt(results.difference)} {results.difference >= 0 ? "more" : "less"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {results.difference < 0
            ? "But freelancers can deduct more expenses and set their own rates to compensate."
            : "Your deductions offset the higher self-employment tax."}
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
