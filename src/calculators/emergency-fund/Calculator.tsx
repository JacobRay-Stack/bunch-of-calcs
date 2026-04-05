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

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [monthlyBusinessCosts, setMonthlyBusinessCosts] = useState(500);
  const [incomeStability, setIncomeStability] = useState(5);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySavingsRate, setMonthlySavingsRate] = useState(500);

  const { loadSaved, clearSaved } = useSavedInputs("emergency-fund", {
    monthlyExpenses, monthlyBusinessCosts, incomeStability, currentSavings, monthlySavingsRate,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.monthlyExpenses !== undefined) setMonthlyExpenses(saved.monthlyExpenses);
      if (saved.monthlyBusinessCosts !== undefined) setMonthlyBusinessCosts(saved.monthlyBusinessCosts);
      if (saved.incomeStability !== undefined) setIncomeStability(saved.incomeStability);
      if (saved.currentSavings !== undefined) setCurrentSavings(saved.currentSavings);
      if (saved.monthlySavingsRate !== undefined) setMonthlySavingsRate(saved.monthlySavingsRate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setMonthlyExpenses(4000);
    setMonthlyBusinessCosts(500);
    setIncomeStability(5);
    setCurrentSavings(5000);
    setMonthlySavingsRate(500);
    clearSaved();
  };

  const results = useMemo(() => {
    const totalMonthlyNeed = monthlyExpenses + monthlyBusinessCosts;
    const recommendedMonths = Math.max(3, Math.round(12 - incomeStability));
    const targetFund = totalMonthlyNeed * recommendedMonths;
    const gap = Math.max(0, targetFund - currentSavings);
    const monthsToGoal = gap > 0 && monthlySavingsRate > 0 ? Math.ceil(gap / monthlySavingsRate) : 0;
    const funded = currentSavings >= targetFund;
    const fundedPercentage = targetFund > 0 ? Math.min(100, Math.round((currentSavings / targetFund) * 100)) : 0;
    const currentRunway = totalMonthlyNeed > 0 ? Math.floor(currentSavings / totalMonthlyNeed) : 0;

    return {
      totalMonthlyNeed,
      recommendedMonths,
      targetFund,
      gap,
      monthsToGoal,
      funded,
      fundedPercentage,
      currentRunway,
    };
  }, [monthlyExpenses, monthlyBusinessCosts, incomeStability, currentSavings, monthlySavingsRate]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="Freelancer Emergency Fund Calculator"
      slug="emergency-fund"
      category="planning"
      description="Calculate how much you need in savings to weather slow months and unexpected gaps between clients."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Monthly Personal Expenses"
          value={monthlyExpenses}
          onChange={setMonthlyExpenses}
          type="currency"
          min={0}
          max={20000}
          step={100}
          helpText="Rent, food, utilities, insurance, etc."
        />
        <SliderInput
          label="Monthly Business Costs"
          value={monthlyBusinessCosts}
          onChange={setMonthlyBusinessCosts}
          type="currency"
          min={0}
          max={5000}
          step={50}
          helpText="Software, tools, hosting, subscriptions"
        />
        <SliderInput
          label="Income Stability"
          value={incomeStability}
          onChange={setIncomeStability}
          min={1}
          max={10}
          step={1}
          helpText="1 = very unpredictable, 10 = steady retainers"
        />
        <SliderInput
          label="Current Savings"
          value={currentSavings}
          onChange={setCurrentSavings}
          type="currency"
          min={0}
          max={100000}
          step={500}
          helpText="What you have saved right now"
        />
        <SliderInput
          label="Monthly Savings Rate"
          value={monthlySavingsRate}
          onChange={setMonthlySavingsRate}
          type="currency"
          min={0}
          max={5000}
          step={50}
          helpText="How much you can save each month"
        />
      </div>

      <HeroResult
        label="Target Emergency Fund"
        value={fmt(results.targetFund)}
        subtext={`${results.recommendedMonths} months of expenses at ${fmt(results.totalMonthlyNeed)}/month`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Current Gap"
          value={results.funded ? "$0" : fmt(results.gap)}
          highlight={!results.funded}
          subtext={results.funded ? "You have met your target" : `${fmt(results.targetFund)} target - ${fmt(currentSavings)} saved`}
        />
        <ResultCard
          label="Months to Goal"
          value={results.funded ? "0" : `${results.monthsToGoal} months`}
          subtext={results.funded ? "Already funded" : `At ${fmt(monthlySavingsRate)}/month savings rate`}
        />
        <ResultCard
          label="Monthly Burn Rate"
          value={fmt(results.totalMonthlyNeed)}
          subtext={`Current runway: ${results.currentRunway} month${results.currentRunway !== 1 ? "s" : ""}`}
        />
      </div>

      <ShareResults
        calculatorName="Freelancer Emergency Fund Calculator"
        results={{
          "Target Emergency Fund": fmt(results.targetFund),
          "Current Gap": results.funded ? "$0" : fmt(results.gap),
          "Months to Goal": results.funded ? "Already funded" : `${results.monthsToGoal} months`,
          "Monthly Burn Rate": fmt(results.totalMonthlyNeed),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Target Fund": fmt(results.targetFund),
          "Current Gap": results.funded ? "$0" : fmt(results.gap),
          "Months to Goal": results.funded ? "Already funded" : `${results.monthsToGoal} months`,
          "Recommended Months": `${results.recommendedMonths} months`,
        }}
      />

      {/* Congratulations or progress */}
      {results.funded ? (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
            Your Emergency Fund Is Fully Funded
          </h3>
          <p className="mt-1 text-sm text-green-700 dark:text-green-400">
            Congratulations -- you have {fmt(currentSavings)} saved against a {fmt(results.targetFund)} target.
            That is {results.currentRunway} months of runway. You are in a strong position to weather any
            dry spell. Consider investing the excess or directing extra savings toward retirement or
            business growth.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Progress to Goal</span>
            <span className="text-gray-500 dark:text-gray-400">{results.fundedPercentage}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500 dark:bg-blue-400"
              style={{ width: `${results.fundedPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fmt(currentSavings)} of {fmt(results.targetFund)} -- {results.monthsToGoal} month{results.monthsToGoal !== 1 ? "s" : ""} to go
            at {fmt(monthlySavingsRate)}/month
          </p>
        </div>
      )}

      {/* Stability explanation */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Why {results.recommendedMonths} Months?</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {incomeStability <= 3
            ? `With an income stability of ${incomeStability}/10, your income is highly unpredictable. Freelancers with variable income need a larger safety net -- ${results.recommendedMonths} months covers the realistic worst-case gap between clients.`
            : incomeStability <= 6
            ? `With an income stability of ${incomeStability}/10, you have moderate income predictability. ${results.recommendedMonths} months gives you a solid buffer for slow periods without over-saving.`
            : `With an income stability of ${incomeStability}/10, your income is relatively steady -- likely retainer-based or with consistent repeat clients. ${results.recommendedMonths} months is enough to handle the occasional hiccup.`}
        </p>
      </div>

      <SEOContent>
        <h2>Why Freelancers Need a Bigger Emergency Fund</h2>
        <p>
          The standard advice for employees is to save 3-6 months of expenses. For freelancers,
          that is not enough. Your income is variable, you have no employer-provided safety net
          (no unemployment insurance, no paid sick leave), and client loss can happen without
          warning. A freelancer emergency fund needs to cover 3-9 months depending on how
          predictable your income is.
        </p>
        <p>
          Your emergency fund also needs to cover business expenses, not just personal ones.
          Even if you stop working, your software subscriptions, hosting, insurance, and other
          business costs keep running. This calculator accounts for both personal and business
          expenses to give you a realistic target.
        </p>

        <h2>How to Build Your Emergency Fund</h2>
        <p>
          Start by automating a fixed amount from every payment into a separate high-yield savings
          account. Even $200-500 per month adds up. During good months, increase the contribution.
          The key is consistency -- treat your emergency fund contribution like a non-negotiable
          business expense, not something you do with "leftover" money.
        </p>
        <p>
          If starting from zero feels overwhelming, set intermediate milestones: first $1,000
          (covers most minor emergencies), then one month of expenses, then three months. Each
          milestone reduces your financial stress and gives you more freedom to be selective about
          the clients and projects you take on.
        </p>

        <h2>When to Use Your Emergency Fund</h2>
        <p>
          Your emergency fund is for genuine emergencies: unexpected medical bills, a client who
          suddenly disappears, a multi-month dry spell, or equipment failure that prevents you from
          working. It is not for covering a slow week, upgrading your laptop because you want to,
          or investing in a new business idea. Be disciplined about what counts as an emergency.
        </p>
        <p>
          When you do dip into the fund, make replenishing it your top financial priority. Pause
          any non-essential spending and direct extra income back into the fund until you are back
          to your target. The worst time to have an empty emergency fund is right after you needed
          it once -- because problems tend to cluster.
        </p>
      </SEOContent>

      <FAQ items={[
        {
          question: "How many months of expenses should a freelancer save?",
          answer: "It depends on your income stability. Freelancers with unpredictable project-based income should aim for 6-9 months. Those with steady retainer clients can get by with 3-6 months. This calculator adjusts the recommendation based on your income stability rating.",
        },
        {
          question: "Should I include business expenses in my emergency fund?",
          answer: "Yes. Your business expenses continue even when revenue stops. Software subscriptions, hosting, insurance, and other fixed costs need to be covered during a dry spell. Include them in your monthly burn rate calculation.",
        },
        {
          question: "Where should I keep my emergency fund?",
          answer: "A high-yield savings account is ideal -- it keeps the money liquid (accessible within 1-2 days) while earning some interest. Avoid investing your emergency fund in stocks or crypto; the whole point is that it is reliably available when you need it.",
        },
        {
          question: "Can I count a line of credit as part of my emergency fund?",
          answer: "A line of credit can serve as a backup to your emergency fund, but should not replace it. Debt costs money in interest and adds stress during an already difficult period. Aim to have actual cash savings first, and think of credit as a last resort.",
        },
        {
          question: "What if I cannot save the recommended amount?",
          answer: "Start with whatever you can. Even $100/month builds up over time. Focus on reaching your first $1,000, which covers most minor emergencies. Then work toward one month of expenses, then three months. Any emergency fund is better than none.",
        },
      ]} />
    </CalculatorLayout>
  );
}
