"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import ScenarioCompare from "@/components/ScenarioCompare";

export default function LifestyleBudgetCalculator() {
  const [hourlyRate, setHourlyRate] = useState(75);
  const [billableHours, setBillableHours] = useState(25);
  const [workingWeeks, setWorkingWeeks] = useState(46);
  const [taxRate, setTaxRate] = useState(28);
  const [businessExpenses, setBusinessExpenses] = useState(500);

  const { loadSaved, clearSaved } = useSavedInputs("lifestyle-budget", {
    hourlyRate, billableHours, workingWeeks, taxRate, businessExpenses,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.hourlyRate !== undefined) setHourlyRate(saved.hourlyRate);
      if (saved.billableHours !== undefined) setBillableHours(saved.billableHours);
      if (saved.workingWeeks !== undefined) setWorkingWeeks(saved.workingWeeks);
      if (saved.taxRate !== undefined) setTaxRate(saved.taxRate);
      if (saved.businessExpenses !== undefined) setBusinessExpenses(saved.businessExpenses);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setHourlyRate(75);
    setBillableHours(25);
    setWorkingWeeks(46);
    setTaxRate(28);
    setBusinessExpenses(500);
    clearSaved();
  };

  const results = useMemo(() => {
    const grossAnnual = hourlyRate * billableHours * workingWeeks;
    const annualTax = grossAnnual * (taxRate / 100);
    const annualBusinessExpenses = businessExpenses * 12;
    const annualTakeHome = grossAnnual - annualTax - annualBusinessExpenses;
    const monthlyTakeHome = annualTakeHome / 12;
    const weeklyTakeHome = annualTakeHome / 52;

    const housing = monthlyTakeHome * 0.30;
    const savings = monthlyTakeHome * 0.20;
    const living = monthlyTakeHome * 0.50;

    return {
      grossAnnual,
      annualTax,
      annualBusinessExpenses,
      annualTakeHome,
      monthlyTakeHome,
      weeklyTakeHome,
      housing,
      savings,
      living,
    };
  }, [hourlyRate, billableHours, workingWeeks, taxRate, businessExpenses]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="What Can I Afford? Calculator"
      slug="lifestyle-budget"
      category="planning"
      description="See what lifestyle you can afford based on your freelance rate, hours, and expenses."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Hourly Rate"
          value={hourlyRate}
          onChange={setHourlyRate}
          type="currency"
          min={0}
          max={300}
          step={5}
          helpText="What you charge per billable hour"
        />
        <SliderInput
          label="Billable Hours Per Week"
          value={billableHours}
          onChange={setBillableHours}
          min={0}
          max={60}
          step={1}
          helpText="Hours actually spent on client work"
        />
        <SliderInput
          label="Working Weeks Per Year"
          value={workingWeeks}
          onChange={setWorkingWeeks}
          min={0}
          max={52}
          step={1}
          helpText="Account for vacation and sick time"
        />
        <SliderInput
          label="Tax Rate"
          value={taxRate}
          onChange={setTaxRate}
          type="percentage"
          min={0}
          max={60}
          helpText="Estimated total tax burden (income + self-employment)"
        />
        <SliderInput
          label="Monthly Business Expenses"
          value={businessExpenses}
          onChange={setBusinessExpenses}
          type="currency"
          min={0}
          max={5000}
          step={50}
          helpText="Software, tools, coworking, insurance, etc."
        />
      </div>

      <HeroResult
        label="Monthly Take-Home"
        value={fmt(results.monthlyTakeHome)}
        subtext={`${fmt(results.annualTakeHome)} per year after taxes and expenses`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Annual Take-Home"
          value={fmt(results.annualTakeHome)}
          subtext="After taxes and business expenses"
        />
        <ResultCard
          label="Weekly Take-Home"
          value={fmt(results.weeklyTakeHome)}
          subtext="Spread across all 52 weeks"
        />
        <ResultCard
          label="Gross Annual Income"
          value={fmt(results.grossAnnual)}
          subtext="Before taxes and expenses"
        />
      </div>

      <ShareResults
        calculatorName="What Can I Afford? Calculator"
        results={{
          "Monthly Take-Home": fmt(results.monthlyTakeHome),
          "Annual Take-Home": fmt(results.annualTakeHome),
          "Gross Annual": fmt(results.grossAnnual),
          "Weekly Take-Home": fmt(results.weeklyTakeHome),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Monthly Take-Home": fmt(results.monthlyTakeHome),
          "Annual Take-Home": fmt(results.annualTakeHome),
          "Gross Annual": fmt(results.grossAnnual),
          "Weekly Take-Home": fmt(results.weeklyTakeHome),
        }}
      />

      {/* Lifestyle budget breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            What Your Budget Looks Like (50/30/20 Rule)
          </h3>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Living Expenses (50%)
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
              {fmt(results.living)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Food, transport, utilities, fun
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Housing (30%)
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
              {fmt(results.housing)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Rent or mortgage payment
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Savings (20%)
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
              {fmt(results.savings)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Emergency fund, retirement, investing
            </p>
          </div>
        </div>
      </div>

      {/* Tax and expense breakdown */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Where Your Money Goes</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          At {fmt(hourlyRate)}/hr for {billableHours} hours/week over {workingWeeks} weeks,
          you gross {fmt(results.grossAnnual)}. Taxes take {fmt(results.annualTax)} ({taxRate}%),
          business expenses cost {fmt(results.annualBusinessExpenses)}/year,
          leaving you {fmt(results.annualTakeHome)} to live on.
        </p>
      </div>

      <SEOContent>
        <h2>Budgeting as a Freelancer: Why It Is Different</h2>
        <p>
          Freelancers face budgeting challenges that salaried workers never think about. Your income
          fluctuates month to month, you pay both the employer and employee side of self-employment
          taxes, and you cover your own business expenses -- software, insurance, equipment, and
          sometimes coworking space. Without a clear picture of your actual take-home pay, it is
          easy to overspend during good months and panic during slow ones.
        </p>
        <p>
          The first step to a realistic freelance budget is understanding your true income: what
          you actually keep after taxes and business costs. This calculator does that math for you
          so you can plan around a real number, not your gross revenue.
        </p>

        <h2>The 50/30/20 Rule Adapted for Freelancers</h2>
        <p>
          The traditional 50/30/20 rule says to spend 50% of your after-tax income on needs, 30%
          on wants, and 20% on savings and debt payoff. For freelancers, this framework still works
          but needs a slight adjustment: your "after-tax income" must also subtract business
          expenses, since those are non-negotiable costs of doing business.
        </p>
        <p>
          Once you calculate your real take-home (gross minus taxes minus business expenses), apply
          the rule to that number. Housing should stay under 30% of your take-home. Savings should
          be at least 20% -- and for freelancers, a larger emergency fund is recommended since your
          income is less predictable. The remaining 50% covers everything else: groceries,
          transportation, entertainment, and personal spending.
        </p>

        <h2>How to Increase What You Can Afford</h2>
        <p>
          There are three levers you can pull to increase your take-home pay: raise your rate,
          increase your billable hours, or reduce your expenses. Raising your rate is usually the
          highest-impact move -- a $10/hr increase at 25 hours/week over 46 weeks adds $11,500 to
          your gross income. Increasing billable hours works too, but watch for burnout. Reducing
          business expenses has the smallest impact but is the easiest to do immediately.
        </p>
        <p>
          Another often-overlooked strategy is tax optimization. Working with a CPA who specializes
          in self-employment can often save thousands per year through deductions, retirement
          account contributions, and entity structure changes like forming an S-Corp.
        </p>
      </SEOContent>

      <FAQ items={[
        {
          question: "How many hours should I actually bill per week?",
          answer: "Most freelancers can realistically bill 20-30 hours per week. The rest of your time goes to marketing, admin, invoicing, learning, and business development. If you are billing 40+ hours consistently, you are either burning out or not accounting for unbillable time.",
        },
        {
          question: "Why is my take-home so much lower than my gross income?",
          answer: "As a freelancer, you pay self-employment tax (15.3%) on top of your income tax. Combined with business expenses, it is common for freelancers to take home only 50-65% of their gross revenue. This is why it is critical to set your rates based on your desired take-home, not your gross.",
        },
        {
          question: "How much should I set aside for taxes?",
          answer: "A safe rule of thumb is 25-30% of your gross income for federal taxes (income tax plus self-employment tax). If you live in a state with income tax, add another 3-10%. This calculator lets you adjust the tax rate to match your actual situation.",
        },
        {
          question: "Should I budget based on my best month or my worst month?",
          answer: "Neither. Budget based on a conservative average -- look at the last 6-12 months and use the lower end of your typical range. This calculator helps by letting you set realistic hours and weeks, which naturally builds in a buffer for slow periods.",
        },
        {
          question: "How do I handle irregular freelance income with a budget?",
          answer: "Pay yourself a consistent monthly salary from your business account. During good months, the excess stays in your business account as a buffer. During slow months, you draw from that buffer. This smooths out the feast-or-famine cycle and makes budgeting much easier.",
        },
      ]} />
    </CalculatorLayout>
  );
}
