"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import ScenarioCompare from "@/components/ScenarioCompare";
import { buildCalculatorLink } from "@/lib/calculator-links";
import { useSavedInputs } from "@/lib/use-saved-inputs";

const WORK_DAYS_PER_YEAR = 260;
const HOURS_PER_DAY = 8;

const INDUSTRY_BENCHMARKS = [
  { label: "Web Development", min: 50, max: 95 },
  { label: "Design", min: 45, max: 85 },
  { label: "Copywriting", min: 40, max: 75 },
  { label: "Marketing", min: 50, max: 90 },
] as const;

const FAQ_ITEMS = [
  { question: "How do I calculate my freelance hourly rate?", answer: "Start with how much you want to earn annually, add your business expenses (software, insurance, equipment), then gross it up for taxes. Divide that total by the number of billable hours you can realistically work in a year -- accounting for vacation, sick days, and non-billable time like admin work. The result is your minimum hourly rate." },
  { question: "Should I charge hourly or per project?", answer: "Per-project pricing is generally better for experienced freelancers because it rewards efficiency -- the faster you get, the more you earn per hour. Hourly pricing works when the scope is unclear or the project involves ongoing, open-ended work. Many freelancers calculate their rate hourly but quote clients a flat project price based on estimated hours." },
  { question: "Why is the recommended rate 20% higher than the minimum?", answer: "The 20% buffer accounts for slow months, scope creep, non-billable administrative time, and unexpected expenses. Most freelancers don't bill 100% of their available hours -- the industry average is closer to 60-70%. The buffer protects your income during gaps between projects." },
  { question: "What tax rate should I use in the calculator?", answer: "For US-based freelancers, a combined rate of 25-35% is typical. This covers the 15.3% self-employment tax plus federal income tax (which varies by bracket) plus state income tax if applicable. If you're unsure, 30% is a safe estimate for most freelancers earning $50K-$150K." },
  { question: "How many billable hours should I plan for?", answer: "A common rule of thumb is 1,000-1,500 billable hours per year for a solo freelancer. That's roughly 20-30 billable hours per week, with the rest going to marketing, admin, invoicing, and business development. Don't assume you'll bill 40 hours a week -- that's unrealistic for most independent workers." },
];

export default function FreelanceRateCalculator() {
  const [salary, setSalary] = useState(60000);
  const [expenses, setExpenses] = useState(5000);
  const [taxRate, setTaxRate] = useState(25);
  const [vacationDays, setVacationDays] = useState(15);
  const [sickDays, setSickDays] = useState(5);
  const [selectedIndustry, setSelectedIndustry] = useState(0);

  const { loadSaved, clearSaved } = useSavedInputs("freelance-rate", {
    salary, expenses, taxRate, vacationDays, sickDays, selectedIndustry,
  });

  // Restore saved inputs on mount
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.salary !== undefined) setSalary(saved.salary);
      if (saved.expenses !== undefined) setExpenses(saved.expenses);
      if (saved.taxRate !== undefined) setTaxRate(saved.taxRate);
      if (saved.vacationDays !== undefined) setVacationDays(saved.vacationDays);
      if (saved.sickDays !== undefined) setSickDays(saved.sickDays);
      if (saved.selectedIndustry !== undefined) setSelectedIndustry(saved.selectedIndustry);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setSalary(60000);
    setExpenses(5000);
    setTaxRate(25);
    setVacationDays(15);
    setSickDays(5);
    setSelectedIndustry(0);
    clearSaved();
  };

  const workingDays = WORK_DAYS_PER_YEAR - vacationDays - sickDays;
  const billableHours = workingDays * HOURS_PER_DAY;
  const totalNeeded = (salary + expenses) / (1 - taxRate / 100);
  const hourlyRate = totalNeeded / billableHours;
  const recommendedRate = hourlyRate * 1.2;
  const dayRate = recommendedRate * HOURS_PER_DAY;
  const projectRate = recommendedRate * 40;

  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry];
  const benchmarkComparison =
    recommendedRate < benchmark.min
      ? "below"
      : recommendedRate > benchmark.max
      ? "above"
      : "within";

  // Employment replacement cost
  const healthInsuranceCost = 6000;
  const retirementMatch = salary * 0.04; // 4% default
  const ptoCost = vacationDays * (recommendedRate * HOURS_PER_DAY);
  const hiddenEmploymentCosts = healthInsuranceCost + retirementMatch + ptoCost;

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <CalculatorLayout name="Freelance Rate Calculator" slug="freelance-rate" category="pricing" description="Figure out what you need to charge per hour to hit your income goals. Accounts for taxes, business expenses, vacation, and sick days." onReset={handleReset} serviceContext={`You calculated a ${fmt(recommendedRate)}/hr rate -- here are tools to help you invoice and manage clients at that rate.`}>
      <div className="space-y-5">
        <SliderInput label="Desired Annual Salary" value={salary} onChange={setSalary} min={0} max={300000} step={1000} type="currency" helpText="What you want to take home before personal taxes" />
        <SliderInput label="Annual Business Expenses" value={expenses} onChange={setExpenses} min={0} max={50000} step={500} type="currency" helpText="Software, equipment, insurance, coworking, etc." />
        <SliderInput label="Self-Employment Tax Rate" value={taxRate} onChange={setTaxRate} min={0} max={60} step={1} type="percentage" helpText="Your effective rate, not top bracket. Most freelancers earning $50K-$150K: use 25-30%." />
        <SliderInput label="Vacation Days Per Year" value={vacationDays} onChange={setVacationDays} min={0} max={60} step={1} helpText="Days you won't be billing" />
        <SliderInput label="Sick / Personal Days" value={sickDays} onChange={setSickDays} min={0} max={30} step={1} helpText="Buffer for days you can't work" />
      </div>

      <HeroResult label="Recommended Hourly Rate" value={fmt(recommendedRate)} subtext={`Minimum: ${fmt(hourlyRate)}/hr -- we add a 20% buffer for slow months and growth`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Minimum Hourly Rate" value={fmt(hourlyRate)} subtext="Bare minimum to cover costs" />
        <ResultCard label="Day Rate" value={fmt(dayRate)} subtext="Based on 8 billable hours" />
        <ResultCard label="Weekly Project Rate" value={fmt(projectRate)} subtext="Based on a 40-hour week" />
      </div>

      <ShareResults
        calculatorName="Freelance Rate Calculator"
        results={{
          "Recommended Hourly Rate": fmt(recommendedRate),
          "Minimum Hourly Rate": fmt(hourlyRate),
          "Day Rate": fmt(dayRate),
          "Weekly Project Rate": fmt(projectRate),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Hourly Rate": fmt(recommendedRate),
          "Day Rate": fmt(dayRate),
          "Weekly Rate": fmt(projectRate),
          "Annual Gross": fmt(totalNeeded),
        }}
        currentLabel="Current"
      />

      {/* Industry benchmarks */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Industry Rate Comparison</h3>
        <div className="mt-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(Number(e.target.value))}
            className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {INDUSTRY_BENCHMARKS.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-sm text-blue-700 dark:text-blue-400">
          {benchmark.label} rates typically range from <strong>{fmt(benchmark.min)}</strong> to <strong>{fmt(benchmark.max)}/hr</strong>.
          Your recommended rate of {fmt(recommendedRate)}/hr is{" "}
          <strong className={benchmarkComparison === "below" ? "text-red-600 dark:text-red-400" : benchmarkComparison === "above" ? "text-green-600 dark:text-green-400" : ""}>
            {benchmarkComparison} the average range
          </strong>.
          {benchmarkComparison === "below" && " Consider raising your salary target or reducing time off to bring your rate in line."}
        </p>
      </div>

      {/* Employment replacement cost */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hidden Employment Costs You&apos;re Replacing</h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-3">Benefits an employer would cover that you now pay for yourself.</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Health Insurance (est.)</span>
            <span className="tabular-nums font-medium">{fmt(healthInsuranceCost)}/yr</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Retirement Match (~4%)</span>
            <span className="tabular-nums font-medium">{fmt(retirementMatch)}/yr</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>PTO Value ({vacationDays} days)</span>
            <span className="tabular-nums font-medium">{fmt(ptoCost)}/yr</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-600 pt-2">
            <span>Total Hidden Costs</span>
            <span className="tabular-nums">{fmt(hiddenEmploymentCosts)}/yr</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Your rate already accounts for taxes and expenses, but these hidden costs show why freelance rates need to be higher than W2 hourly equivalents.
        </p>
      </div>

      {/* Cross-link to Project Price */}
      <div className="mt-6 text-center">
        <Link
          href={buildCalculatorLink("project-price", { rate: Math.round(recommendedRate) })}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Price a project with this rate &rarr;
        </Link>
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">How this works</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          We take your desired salary ({fmt(salary)}), add your business expenses ({fmt(expenses)}), then gross it up for taxes ({taxRate}%). That gives you {fmt(totalNeeded)} you need to earn. Divided by {billableHours.toLocaleString()} billable hours ({workingDays} working days x {HOURS_PER_DAY} hrs/day), your minimum rate is {fmt(hourlyRate)}/hr.
        </p>
      </div>

      <SEOContent>
        <h2>How to Calculate Your Freelance Rate</h2>
        <p>Setting the right freelance rate is one of the most important decisions you will make as an independent worker. Charge too little and you will burn out working long hours for less than you would earn as an employee. Charge too much without the experience to back it up and you will struggle to land clients.</p>
        <p>The formula is straightforward: figure out how much money you need to earn in a year, then divide by the number of hours you can realistically bill. The trick is accounting for all the hidden costs that eat into your income -- <a href="/self-employment-tax">taxes</a>, business expenses, time off, and non-billable work.</p>

        <h2>What Most Freelancers Get Wrong About Pricing</h2>
        <p>The biggest mistake new freelancers make is basing their rate on what they earned as an employee divided by 2,080 hours. This ignores several critical factors:</p>
        <ul>
          <li><strong><a href="/self-employment-tax">Self-employment tax</a></strong> adds 15.3% on top of your income tax. As an employee, your company paid half. Now you pay both halves.</li>
          <li><strong>Benefits you lose</strong> include health insurance ($6,000-$15,000/year), retirement matching, paid time off, and equipment. Use the <a href="/1099-vs-w2">1099 vs W2 comparison</a> to see the real difference.</li>
          <li><strong>Non-billable time</strong> is real. Marketing, invoicing, bookkeeping, client calls, and project management can eat 30-40% of your working hours.</li>
          <li><strong>Gaps between projects</strong> mean you won&apos;t bill every week of the year. Plan for 40-46 working weeks, not 52.</li>
        </ul>

        <h2>Hourly vs Project-Based Pricing</h2>
        <p>This calculator gives you an hourly rate, but many freelancers quote per-project prices. Use the <a href="/project-price">Project Price Calculator</a> to turn your hourly rate into a client-ready quote with scope creep buffer built in.</p>
        <p>Project pricing has an advantage: as you get faster and more efficient, your effective hourly rate goes up without having to renegotiate. A project you quoted at $5,000 might take you 40 hours the first time but only 25 hours once you have a system -- effectively raising your rate from $125/hr to $200/hr.</p>

        <h2>How to Raise Your Rates</h2>
        <p>Most freelancers should raise their rates at least once a year. Here are signs it is time:</p>
        <ul>
          <li>You are booked solid with no availability for new clients</li>
          <li>You have not raised rates in over 12 months</li>
          <li>Your skills have grown significantly since you set your current rate</li>
          <li>You are earning less per hour than you would as a full-time employee with benefits</li>
        </ul>
        <p>Not sure if your business can support higher rates? Run the numbers through the <a href="/break-even">Break-Even Calculator</a> to see how many clients you need at your new rate.</p>
      </SEOContent>

      <FAQ items={FAQ_ITEMS} />
    </CalculatorLayout>
  );
}
