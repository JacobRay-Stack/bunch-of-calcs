"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(3000);
  const [avgProjectValue, setAvgProjectValue] = useState(2000);
  const [variableCostPct, setVariableCostPct] = useState(10);
  const [desiredProfit, setDesiredProfit] = useState(5000);
  const [projectsPerMonth, setProjectsPerMonth] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(10000);

  const { loadSaved, clearSaved } = useSavedInputs("break-even", {
    fixedCosts, avgProjectValue, variableCostPct, desiredProfit, projectsPerMonth, currentSavings,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.fixedCosts !== undefined) setFixedCosts(saved.fixedCosts);
      if (saved.avgProjectValue !== undefined) setAvgProjectValue(saved.avgProjectValue);
      if (saved.variableCostPct !== undefined) setVariableCostPct(saved.variableCostPct);
      if (saved.desiredProfit !== undefined) setDesiredProfit(saved.desiredProfit);
      if (saved.projectsPerMonth !== undefined) setProjectsPerMonth(saved.projectsPerMonth);
      if (saved.currentSavings !== undefined) setCurrentSavings(saved.currentSavings);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setFixedCosts(3000);
    setAvgProjectValue(2000);
    setVariableCostPct(10);
    setDesiredProfit(5000);
    setProjectsPerMonth(4);
    setCurrentSavings(10000);
    clearSaved();
  };

  const results = useMemo(() => {
    const variableCost = avgProjectValue * (variableCostPct / 100);
    const contributionMargin = avgProjectValue - variableCost;

    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * avgProjectValue;

    const profitUnits =
      contributionMargin > 0
        ? Math.ceil((fixedCosts + desiredProfit) / contributionMargin)
        : 0;
    const profitRevenue = profitUnits * avgProjectValue;

    const safetyMarginUnits = profitUnits - breakEvenUnits;

    // Time-based break-even
    const monthsToBreakEven = projectsPerMonth > 0 ? Math.ceil(breakEvenUnits / projectsPerMonth) : 0;
    const monthsToProfit = projectsPerMonth > 0 ? Math.ceil(profitUnits / projectsPerMonth) : 0;

    // Runway calculator
    const runwayMonths = fixedCosts > 0 ? Math.floor(currentSavings / fixedCosts) : 0;
    const runwayWarning = runwayMonths < monthsToBreakEven;

    // Three-scenario comparison
    const scenarios = [
      { label: "Current Price", price: avgProjectValue },
      { label: "+20% Price", price: Math.round(avgProjectValue * 1.2) },
      { label: "-20% Price", price: Math.round(avgProjectValue * 0.8) },
    ].map((s) => {
      const vc = s.price * (variableCostPct / 100);
      const cm = s.price - vc;
      const be = cm > 0 ? Math.ceil(fixedCosts / cm) : 0;
      const rev = be * s.price;
      return { ...s, breakEvenUnits: be, breakEvenRevenue: rev };
    });

    return {
      variableCost,
      contributionMargin,
      breakEvenUnits,
      breakEvenRevenue,
      profitUnits,
      profitRevenue,
      safetyMarginUnits,
      monthsToBreakEven,
      monthsToProfit,
      runwayMonths,
      runwayWarning,
      scenarios,
    };
  }, [fixedCosts, avgProjectValue, variableCostPct, desiredProfit, projectsPerMonth, currentSavings]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="Break-Even Calculator"
      slug="break-even"
      category="planning"
      description="Find out how many projects or sales you need each month to cover your costs -- and how many more to hit your income goal."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Monthly Fixed Costs"
          value={fixedCosts}
          onChange={setFixedCosts}
          type="currency"
          min={0}
          step={100}
          helpText="Rent, subscriptions, insurance, etc."
        />
        <SliderInput
          label="Average Project/Sale Value"
          value={avgProjectValue}
          onChange={setAvgProjectValue}
          type="currency"
          min={0}
          step={100}
          helpText="What you charge per project or sale"
        />
        <SliderInput
          label="Variable Cost Per Project"
          value={variableCostPct}
          onChange={setVariableCostPct}
          type="percentage"
          min={0}
          max={100}
          helpText="Costs that scale with each project (tools, contractors, etc.)"
        />
        <SliderInput
          label="Desired Monthly Profit"
          value={desiredProfit}
          onChange={setDesiredProfit}
          type="currency"
          min={0}
          step={500}
          helpText="What you want to take home after costs"
        />
        <SliderInput
          label="Expected Projects Per Month"
          value={projectsPerMonth}
          onChange={setProjectsPerMonth}
          min={1}
          max={50}
          step={1}
          helpText="How many projects you can realistically close"
        />
        <SliderInput
          label="Current Savings"
          value={currentSavings}
          onChange={setCurrentSavings}
          type="currency"
          min={0}
          step={1000}
          helpText="Cash available to cover costs while ramping up"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="Break-Even Point"
          value={`${results.breakEvenUnits} projects`}
          subtext={`${fmt(results.breakEvenRevenue)} in revenue`}
        />
        <ResultCard
          label="To Hit Profit Goal"
          value={`${results.profitUnits} projects`}
          highlight
          subtext={`${fmt(results.profitRevenue)} in revenue`}
        />
        <ResultCard
          label="Contribution Margin"
          value={fmt(results.contributionMargin)}
          subtext="Profit per project after variable costs"
        />
        <ResultCard
          label="Safety Buffer"
          value={`${results.safetyMarginUnits} projects`}
          subtext="Extra projects beyond break-even"
        />
      </div>

      <ShareResults
        calculatorName="Break-Even Calculator"
        results={{
          "Break-Even Point": `${results.breakEvenUnits} projects (${fmt(results.breakEvenRevenue)})`,
          "To Hit Profit Goal": `${results.profitUnits} projects (${fmt(results.profitRevenue)})`,
          "Contribution Margin": fmt(results.contributionMargin),
          "Time to Break Even": `${results.monthsToBreakEven} months`,
        }}
      />

      {/* Time-based break-even */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Time to Break Even</h3>
          <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-200">
            {results.monthsToBreakEven} {results.monthsToBreakEven === 1 ? "month" : "months"}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            At {projectsPerMonth} projects/month, it takes {results.monthsToBreakEven} month{results.monthsToBreakEven !== 1 ? "s" : ""} to cover your costs
          </p>
        </div>
        <div className={`rounded-lg border p-4 ${
          results.runwayWarning
            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
            : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
        }`}>
          <h3 className={`text-sm font-semibold ${results.runwayWarning ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`}>
            Cash Runway
          </h3>
          <p className={`mt-1 text-2xl font-bold ${results.runwayWarning ? "text-red-900 dark:text-red-200" : "text-green-900 dark:text-green-200"}`}>
            {results.runwayMonths} months
          </p>
          <p className={`text-xs ${results.runwayWarning ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {results.runwayWarning
              ? `Warning: your runway (${results.runwayMonths} months) is shorter than time to break even (${results.monthsToBreakEven} months)`
              : `Your savings cover ${results.runwayMonths} months of fixed costs -- enough time to reach break-even`}
          </p>
        </div>
      </div>

      {/* Three-scenario comparison */}
      <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">What If You Changed Your Price?</h3>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          {results.scenarios.map((s) => (
            <div key={s.label} className={`p-4 text-center ${s.label === "Current Price" ? "bg-blue-50 dark:bg-blue-950" : ""}`}>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{fmt(s.price)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {s.breakEvenUnits} projects
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {fmt(s.breakEvenRevenue)} revenue
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual scale */}
      <div className="mt-8 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Project Scale</h3>
        <div className="flex gap-1">
          {Array.from({ length: Math.max(results.profitUnits, 1) }, (_, i) => {
            const num = i + 1;
            const isBreakEven = num <= results.breakEvenUnits;
            const isProfit = num > results.breakEvenUnits && num <= results.profitUnits;
            return (
              <div
                key={i}
                className={`h-10 flex-1 rounded transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                  isBreakEven
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    : isProfit
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
                title={isBreakEven ? "Covers costs" : "Profit"}
              >
                {results.profitUnits <= 20 ? num : ""}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="text-red-500 dark:text-red-400">Covering costs</span>
          <span className="text-green-600 dark:text-green-400">Profit zone</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">How this works</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Each {fmt(avgProjectValue)} project costs {fmt(results.variableCost)} in variable costs,
          leaving {fmt(results.contributionMargin)} in contribution margin. You need{" "}
          {results.breakEvenUnits} projects just to cover your {fmt(fixedCosts)} in fixed costs,
          and {results.profitUnits} to take home {fmt(desiredProfit)}.
        </p>
      </div>

      <SEOContent>
        <h2>What Is a Break-Even Analysis?</h2>
        <p>A break-even analysis tells you how many units you need to sell (or projects you need to complete) to cover all your costs. Below the break-even point, you are losing money. Above it, you are generating profit. It is one of the most fundamental calculations in business planning.</p>
        <p>For freelancers, the break-even point answers a critical question: how many clients or projects do I need each month to keep the lights on? Once you know this number, you can set realistic income targets and make smarter decisions about pricing, expenses, and time allocation.</p>

        <h2>How Break-Even Point Is Calculated</h2>
        <p>The formula is: Break-Even Point = Fixed Costs / (Price per Unit - Variable Cost per Unit). The difference between price and variable cost is called the contribution margin -- it is how much each sale contributes toward covering your fixed costs.</p>
        <p>For a freelancer charging $2,000 per project with $200 in variable costs and $3,000 in monthly fixed costs: contribution margin is $1,800, and break-even is 3,000 / 1,800 = 1.67 projects, so you need 2 projects per month to break even.</p>

        <h2>How to Lower Your Break-Even Point</h2>
        <ul>
          <li><strong>Reduce fixed costs</strong> -- Cancel unnecessary subscriptions, negotiate better rates, work from home instead of renting office space.</li>
          <li><strong>Raise your prices</strong> -- Higher prices increase your contribution margin, meaning each project covers more of your fixed costs.</li>
          <li><strong>Reduce variable costs</strong> -- Find cheaper tools, outsource less, or improve your efficiency to reduce per-project costs.</li>
        </ul>
      </SEOContent>

      <FAQ items={[
        { question: "What is a break-even point?", answer: "The break-even point is the number of sales or projects needed to cover all your costs -- both fixed (rent, subscriptions) and variable (per-project expenses). At the break-even point, you are neither making nor losing money. Every sale beyond that point is profit." },
        { question: "What are fixed costs vs variable costs?", answer: "Fixed costs stay the same regardless of how much work you do -- things like rent, insurance, software subscriptions, and loan payments. Variable costs change with each project -- things like subcontractor fees, materials, and transaction fees. Understanding the difference is key to accurate break-even analysis." },
        { question: "How can freelancers use break-even analysis?", answer: "Freelancers can use it to determine the minimum number of clients needed per month, evaluate whether to take on a new expense (how many additional projects to cover it), decide if a price increase or decrease makes sense, and set realistic monthly income targets." },
        { question: "What is contribution margin?", answer: "Contribution margin is the amount each sale contributes toward covering fixed costs after variable costs are paid. It equals price minus variable cost per unit. Higher contribution margin means each sale is more valuable and you reach break-even faster." },
        { question: "Should I include taxes in my break-even calculation?", answer: "For a basic break-even analysis, you typically exclude taxes to keep it simple. However, if you want to know how many projects you need to hit a specific take-home income, you should factor in taxes. Use our Self-Employment Tax Calculator to estimate your tax burden, then add that to your desired profit in this calculator." },
      ]} />
    </CalculatorLayout>
  );
}
