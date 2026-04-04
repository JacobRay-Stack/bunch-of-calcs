"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const WORK_DAYS_PER_YEAR = 260;
const HOURS_PER_DAY = 8;

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

  const workingDays = WORK_DAYS_PER_YEAR - vacationDays - sickDays;
  const billableHours = workingDays * HOURS_PER_DAY;
  const totalNeeded = (salary + expenses) / (1 - taxRate / 100);
  const hourlyRate = totalNeeded / billableHours;
  const recommendedRate = hourlyRate * 1.2;
  const dayRate = recommendedRate * HOURS_PER_DAY;
  const projectRate = recommendedRate * 40;

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <CalculatorLayout name="Freelance Rate Calculator" slug="freelance-rate" category="pricing" description="Figure out what you need to charge per hour to hit your income goals. Accounts for taxes, business expenses, vacation, and sick days.">
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

      <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">How this works</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          We take your desired salary ({fmt(salary)}), add your business expenses ({fmt(expenses)}), then gross it up for taxes ({taxRate}%). That gives you {fmt(totalNeeded)} you need to earn. Divided by {billableHours.toLocaleString()} billable hours ({workingDays} working days x {HOURS_PER_DAY} hrs/day), your minimum rate is {fmt(hourlyRate)}/hr.
        </p>
      </div>

      <SEOContent>
        <h2>How to Calculate Your Freelance Rate</h2>
        <p>Setting the right freelance rate is one of the most important decisions you will make as an independent worker. Charge too little and you will burn out working long hours for less than you would earn as an employee. Charge too much without the experience to back it up and you will struggle to land clients.</p>
        <p>The formula is straightforward: figure out how much money you need to earn in a year, then divide by the number of hours you can realistically bill. The trick is accounting for all the hidden costs that eat into your income -- taxes, business expenses, time off, and non-billable work.</p>

        <h2>What Most Freelancers Get Wrong About Pricing</h2>
        <p>The biggest mistake new freelancers make is basing their rate on what they earned as an employee divided by 2,080 hours. This ignores several critical factors:</p>
        <ul>
          <li><strong>Self-employment tax</strong> adds 15.3% on top of your income tax. As an employee, your company paid half. Now you pay both halves.</li>
          <li><strong>Benefits you lose</strong> include health insurance ($6,000-$15,000/year), retirement matching, paid time off, and equipment.</li>
          <li><strong>Non-billable time</strong> is real. Marketing, invoicing, bookkeeping, client calls, and project management can eat 30-40% of your working hours.</li>
          <li><strong>Gaps between projects</strong> mean you won't bill every week of the year. Plan for 40-46 working weeks, not 52.</li>
        </ul>

        <h2>Hourly vs Project-Based Pricing</h2>
        <p>This calculator gives you an hourly rate, but many freelancers quote per-project prices. Here is how to use your hourly rate for project pricing: estimate the total hours a project will take, multiply by your hourly rate, then add a 15-25% buffer for scope creep. That is your project quote.</p>
        <p>Project pricing has an advantage: as you get faster and more efficient, your effective hourly rate goes up without having to renegotiate. A project you quoted at $5,000 might take you 40 hours the first time but only 25 hours once you have a system -- effectively raising your rate from $125/hr to $200/hr.</p>

        <h2>How to Raise Your Rates</h2>
        <p>Most freelancers should raise their rates at least once a year. Here are signs it is time:</p>
        <ul>
          <li>You are booked solid with no availability for new clients</li>
          <li>You have not raised rates in over 12 months</li>
          <li>Your skills have grown significantly since you set your current rate</li>
          <li>You are earning less per hour than you would as a full-time employee with benefits</li>
        </ul>
      </SEOContent>

      <FAQ items={FAQ_ITEMS} />
    </CalculatorLayout>
  );
}
