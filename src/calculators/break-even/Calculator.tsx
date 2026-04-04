"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(3000);
  const [avgProjectValue, setAvgProjectValue] = useState(2000);
  const [variableCostPct, setVariableCostPct] = useState(10);
  const [desiredProfit, setDesiredProfit] = useState(5000);

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

    return {
      variableCost,
      contributionMargin,
      breakEvenUnits,
      breakEvenRevenue,
      profitUnits,
      profitRevenue,
      safetyMarginUnits,
    };
  }, [fixedCosts, avgProjectValue, variableCostPct, desiredProfit]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <CalculatorLayout
      name="Break-Even Calculator"
      slug="break-even"
      category="planning"
      description="Find out how many projects or sales you need each month to cover your costs -- and how many more to hit your income goal."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          label="Monthly Fixed Costs"
          value={fixedCosts}
          onChange={setFixedCosts}
          type="currency"
          min={0}
          step={100}
          helpText="Rent, subscriptions, insurance, etc."
        />
        <InputField
          label="Average Project/Sale Value"
          value={avgProjectValue}
          onChange={setAvgProjectValue}
          type="currency"
          min={0}
          step={100}
          helpText="What you charge per project or sale"
        />
        <InputField
          label="Variable Cost Per Project"
          value={variableCostPct}
          onChange={setVariableCostPct}
          type="percentage"
          min={0}
          max={100}
          helpText="Costs that scale with each project (tools, contractors, etc.)"
        />
        <InputField
          label="Desired Monthly Profit"
          value={desiredProfit}
          onChange={setDesiredProfit}
          type="currency"
          min={0}
          step={500}
          helpText="What you want to take home after costs"
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

      {/* Visual scale */}
      <div className="mt-8 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Monthly Project Scale</h3>
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
                    ? "bg-red-100 text-red-600"
                    : isProfit
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100"
                }`}
                title={isBreakEven ? "Covers costs" : "Profit"}
              >
                {results.profitUnits <= 20 ? num : ""}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span className="text-red-500">Covering costs</span>
          <span className="text-green-600">Profit zone</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-700">How this works</h3>
        <p className="mt-1 text-sm text-gray-600">
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
