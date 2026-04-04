"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CalculatorLayout from "@/components/CalculatorLayout";
import { buildCalculatorLink } from "@/lib/calculator-links";
import SliderInput from "@/components/SliderInput";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

type PayPeriod = "hourly" | "daily" | "weekly" | "biweekly" | "monthly" | "annual";

const PERIODS: { key: PayPeriod; label: string; shortLabel: string }[] = [
  { key: "hourly", label: "Hourly", shortLabel: "/hr" },
  { key: "daily", label: "Daily", shortLabel: "/day" },
  { key: "weekly", label: "Weekly", shortLabel: "/wk" },
  { key: "biweekly", label: "Biweekly", shortLabel: "/2wk" },
  { key: "monthly", label: "Monthly", shortLabel: "/mo" },
  { key: "annual", label: "Annual", shortLabel: "/yr" },
];

const QUICK_PRESETS = [
  { label: "$30K", value: 30000 },
  { label: "$50K", value: 50000 },
  { label: "$75K", value: 75000 },
  { label: "$100K", value: 100000 },
  { label: "$150K", value: 150000 },
];

const EST_TAX_RATE = 0.25;

export default function SalaryConverter() {
  const [amount, setAmount] = useState(60000);
  const [inputPeriod, setInputPeriod] = useState<PayPeriod>("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const conversions = useMemo(() => {
    const hoursPerYear = hoursPerWeek * weeksPerYear;
    const daysPerWeek = hoursPerWeek / 8;

    // Convert input to annual first
    let annual: number;
    switch (inputPeriod) {
      case "hourly":
        annual = amount * hoursPerYear;
        break;
      case "daily":
        annual = amount * daysPerWeek * weeksPerYear;
        break;
      case "weekly":
        annual = amount * weeksPerYear;
        break;
      case "biweekly":
        annual = amount * (weeksPerYear / 2);
        break;
      case "monthly":
        annual = amount * 12;
        break;
      case "annual":
      default:
        annual = amount;
    }

    return {
      hourly: annual / hoursPerYear,
      daily: annual / (daysPerWeek * weeksPerYear),
      weekly: annual / weeksPerYear,
      biweekly: annual / (weeksPerYear / 2),
      monthly: annual / 12,
      annual,
    };
  }, [amount, inputPeriod, hoursPerWeek, weeksPerYear]);

  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: n < 100 ? 2 : 0,
      maximumFractionDigits: n < 100 ? 2 : 0,
    });

  const applyPreset = (value: number) => {
    setAmount(value);
    setInputPeriod("annual");
  };

  return (
    <CalculatorLayout
      name="Salary to Hourly Converter"
      slug="salary-converter"
      category="pricing"
      description="Instantly convert between hourly, daily, weekly, biweekly, monthly, and annual pay. Works both directions."
    >
      {/* Quick presets */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                amount === p.value && inputPeriod === "annual"
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <SliderInput
          label="Pay Amount"
          value={amount}
          onChange={setAmount}
          type="currency"
          min={0}
          step={inputPeriod === "hourly" ? 1 : 1000}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Pay Period
          </label>
          <select
            value={inputPeriod}
            onChange={(e) => setInputPeriod(e.target.value as PayPeriod)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            {PERIODS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <SliderInput
          label="Hours Per Week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          min={1}
          max={168}
          helpText="Standard is 40"
        />
      </div>

      {/* Conversion table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {PERIODS.map((period) => {
          const value = conversions[period.key];
          const afterTax = value * (1 - EST_TAX_RATE);
          const isInput = period.key === inputPeriod;
          return (
            <div
              key={period.key}
              className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 px-5 py-4 transition-colors ${
                isInput
                  ? "bg-blue-50 dark:bg-blue-950"
                  : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div>
                <span className={`text-sm font-medium ${isInput ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"}`}>
                  {period.label}
                </span>
                {isInput && (
                  <span className="ml-2 rounded-full bg-blue-200 dark:bg-blue-800 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                    Input
                  </span>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`text-lg tabular-nums font-bold ${
                    isInput ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {fmt(value)}
                  <span className="ml-1 text-sm font-normal text-gray-400 dark:text-gray-500">
                    {period.shortLabel}
                  </span>
                </span>
                <div className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
                  ~{fmt(afterTax)} after tax
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
        After-tax estimates assume 25% combined tax rate
      </p>

      {/* Cross-link */}
      <div className="mt-6 text-center">
        <Link
          href={buildCalculatorLink("freelance-rate", {})}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Is this rate enough? Check with our Rate Calculator &rarr;
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">How this works</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Based on {hoursPerWeek} hours/week and {weeksPerYear} working weeks/year
          ({(hoursPerWeek * weeksPerYear).toLocaleString()} hours/year). Change
          the hours per week above if you work more or fewer hours.
        </p>
      </div>

      <SEOContent>
        <h2>How to Convert Salary to Hourly Rate</h2>
        <p>To convert an annual salary to an hourly rate, divide the salary by the total number of working hours in a year. For a standard full-time schedule, that is 2,080 hours (40 hours per week times 52 weeks). For example, a $60,000 annual salary equals approximately $28.85 per hour.</p>
        <p>If you work fewer than 40 hours per week or take unpaid time off, your effective hourly rate is higher because you are earning the same amount in fewer hours. This calculator adjusts for your actual hours per week.</p>

        <h2>Why This Conversion Matters for Freelancers</h2>
        <p>Understanding the relationship between hourly and annual pay is critical when transitioning from employment to freelancing. A $50/hour freelance rate might sound high, but when you account for self-employment taxes, no paid benefits, and non-billable hours, it can be equivalent to a $65,000 salary or less.</p>
        <p>Use this converter alongside the Freelance Rate Calculator to understand the full picture of what you need to charge.</p>

        <h2>Common Pay Conversions</h2>
        <p>Here are some quick references for common salary-to-hourly conversions based on a 40-hour work week:</p>
        <ul>
          <li><strong>$15/hour</strong> = $31,200/year</li>
          <li><strong>$25/hour</strong> = $52,000/year</li>
          <li><strong>$50/hour</strong> = $104,000/year</li>
          <li><strong>$75/hour</strong> = $156,000/year</li>
          <li><strong>$100/hour</strong> = $208,000/year</li>
        </ul>
      </SEOContent>

      <FAQ items={[
        { question: "How do I convert my salary to an hourly rate?", answer: "Divide your annual salary by 2,080 (40 hours x 52 weeks). For example, $60,000 / 2,080 = $28.85 per hour. If you work fewer hours per week, divide by your actual annual hours instead." },
        { question: "Does this calculator account for taxes?", answer: "The conversion table shows estimated after-tax amounts assuming a 25% combined tax rate. For more accurate after-tax calculations, use our Self-Employment Tax Calculator or Side Hustle Tax Calculator." },
        { question: "How many working hours are in a year?", answer: "A standard full-time year is 2,080 hours (40 hours/week x 52 weeks). After accounting for holidays, vacation, and sick time, most workers actually work 1,800-1,950 hours per year." },
        { question: "Why is my biweekly pay not exactly half my monthly pay?", answer: "There are 26 biweekly pay periods per year but only 12 months. So biweekly pay x 26 = annual salary, while monthly pay x 12 = annual salary. Two months per year you would receive 3 biweekly checks instead of 2." },
        { question: "How should freelancers use this calculator?", answer: "Freelancers can use this to compare client offers across different pay structures. If one client offers $75/hour and another offers $12,000/month, this tool shows you which pays more annually so you can make an informed decision." },
      ]} />
    </CalculatorLayout>
  );
}
