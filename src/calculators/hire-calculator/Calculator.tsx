"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { useSavedInputs } from "@/lib/use-saved-inputs";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import ShareResults from "@/components/ShareResults";
import ScenarioCompare from "@/components/ScenarioCompare";

export default function HireCalculator() {
  const [yourRate, setYourRate] = useState(75);
  const [nonBillableHours, setNonBillableHours] = useState(15);
  const [hoursYouCouldBill, setHoursYouCouldBill] = useState(10);
  const [vaRate, setVaRate] = useState(25);
  const [hoursDelegated, setHoursDelegated] = useState(10);
  const [weeksPerYear, setWeeksPerYear] = useState(48);

  const { loadSaved, clearSaved } = useSavedInputs("hire-calculator", {
    yourRate, nonBillableHours, hoursYouCouldBill, vaRate, hoursDelegated, weeksPerYear,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.yourRate !== undefined) setYourRate(saved.yourRate);
      if (saved.nonBillableHours !== undefined) setNonBillableHours(saved.nonBillableHours);
      if (saved.hoursYouCouldBill !== undefined) setHoursYouCouldBill(saved.hoursYouCouldBill);
      if (saved.vaRate !== undefined) setVaRate(saved.vaRate);
      if (saved.hoursDelegated !== undefined) setHoursDelegated(saved.hoursDelegated);
      if (saved.weeksPerYear !== undefined) setWeeksPerYear(saved.weeksPerYear);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setYourRate(75);
    setNonBillableHours(15);
    setHoursYouCouldBill(10);
    setVaRate(25);
    setHoursDelegated(10);
    setWeeksPerYear(48);
    clearSaved();
  };

  const results = useMemo(() => {
    const annualCostOfHire = vaRate * hoursDelegated * weeksPerYear;
    const additionalRevenue = yourRate * hoursYouCouldBill * weeksPerYear;
    const netGain = additionalRevenue - annualCostOfHire;
    const monthlyNetGain = netGain / 12;
    const roi = annualCostOfHire > 0 ? (netGain / annualCostOfHire) * 100 : 0;
    const breakEvenRate =
      hoursYouCouldBill * weeksPerYear > 0
        ? annualCostOfHire / (hoursYouCouldBill * weeksPerYear)
        : 0;

    return {
      annualCostOfHire,
      additionalRevenue,
      netGain,
      monthlyNetGain,
      roi,
      breakEvenRate,
    };
  }, [yourRate, hoursYouCouldBill, vaRate, hoursDelegated, weeksPerYear]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  const fmtPct = (n: number) => Math.round(n).toLocaleString("en-US") + "%";

  return (
    <CalculatorLayout
      name="Should I Hire? Calculator"
      slug="hire-calculator"
      category="planning"
      description="Find out when it makes financial sense to hire a subcontractor or virtual assistant for your freelance business."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Your Hourly Rate"
          value={yourRate}
          onChange={setYourRate}
          type="currency"
          min={0}
          max={300}
          step={5}
        />
        <SliderInput
          label="Hours Spent on Non-Billable Work Per Week"
          value={nonBillableHours}
          onChange={setNonBillableHours}
          min={0}
          max={40}
          step={1}
          helpText="Admin, marketing, bookkeeping, etc."
        />
        <SliderInput
          label="Hours You Could Bill If Free"
          value={hoursYouCouldBill}
          onChange={setHoursYouCouldBill}
          min={0}
          max={40}
          step={1}
          helpText="Extra billable hours you'd gain by delegating"
        />
        <SliderInput
          label="Subcontractor/VA Hourly Rate"
          value={vaRate}
          onChange={setVaRate}
          type="currency"
          min={0}
          max={100}
          step={1}
        />
        <SliderInput
          label="Hours Delegated Per Week"
          value={hoursDelegated}
          onChange={setHoursDelegated}
          min={0}
          max={40}
          step={1}
        />
        <SliderInput
          label="Working Weeks Per Year"
          value={weeksPerYear}
          onChange={setWeeksPerYear}
          min={0}
          max={52}
          step={1}
        />
      </div>

      {/* Hero result with conditional green/red coloring */}
      <div className={`my-8 rounded-2xl border p-6 text-center ${
        results.netGain > 0
          ? "border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-800 dark:from-green-950 dark:to-gray-900"
          : results.netGain < 0
          ? "border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-800 dark:from-red-950 dark:to-gray-900"
          : "border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-800 dark:from-blue-950 dark:to-gray-900"
      }`}>
        <p className={`text-sm font-medium uppercase tracking-wide ${
          results.netGain > 0
            ? "text-green-600 dark:text-green-400"
            : results.netGain < 0
            ? "text-red-600 dark:text-red-400"
            : "text-blue-600 dark:text-blue-400"
        }`}>
          Net Annual Gain
        </p>
        <p className={`mt-2 text-3xl font-extrabold tabular-nums sm:text-5xl ${
          results.netGain > 0
            ? "text-green-700 dark:text-green-300"
            : results.netGain < 0
            ? "text-red-700 dark:text-red-300"
            : "text-gray-900 dark:text-gray-100"
        }`}>
          {fmt(results.netGain)}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {results.netGain > 0
            ? `Hiring pays for itself and then some -- you come out ${fmt(results.netGain)} ahead per year`
            : results.netGain < 0
            ? `Hiring costs more than it earns back -- you'd lose ${fmt(Math.abs(results.netGain))} per year`
            : "You'd break exactly even on the hire"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Monthly Net Gain"
          value={fmt(results.monthlyNetGain)}
          subtext="Additional monthly profit from hiring"
        />
        <ResultCard
          label="Annual Cost of Hire"
          value={fmt(results.annualCostOfHire)}
          subtext={`${hoursDelegated} hrs/wk at ${fmt(vaRate)}/hr`}
        />
        <ResultCard
          label="ROI"
          value={fmtPct(results.roi)}
          subtext="Return on your hiring investment"
        />
      </div>

      <ShareResults
        calculatorName="Should I Hire? Calculator"
        results={{
          "Net Annual Gain": fmt(results.netGain),
          "Monthly Net Gain": fmt(results.monthlyNetGain),
          "Cost of Hire": fmt(results.annualCostOfHire),
          "ROI": fmtPct(results.roi),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Net Annual Gain": fmt(results.netGain),
          "Monthly Net Gain": fmt(results.monthlyNetGain),
          "Cost of Hire": fmt(results.annualCostOfHire),
          "ROI": fmtPct(results.roi),
        }}
      />

      {/* Insight section */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">The Verdict</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {results.netGain > 0
            ? `Hiring at ${fmt(vaRate)}/hr frees up ${hoursDelegated} hours/week, letting you bill ${hoursYouCouldBill} more hours at your ${fmt(yourRate)}/hr rate. That's a net gain of ${fmt(results.netGain)}/yr.`
            : `At current rates, hiring doesn't pay for itself yet. You'd need to bill at least ${fmt(results.breakEvenRate)}/hr to break even on the hire.`}
        </p>
      </div>

      <SEOContent>
        <h2>When Should a Freelancer Hire Help?</h2>
        <p>
          The tipping point comes when your non-billable work starts eating into revenue. If you are
          spending 15 or more hours a week on admin, marketing, bookkeeping, or client communication,
          that is time you could be billing. The math is simple: if the cost of delegating those tasks
          is less than the revenue you would earn by billing those hours, hiring pays for itself.
        </p>
        <p>
          Other signs it is time: you are turning down projects because you do not have bandwidth, your
          response time to clients is slipping, or you are burning out trying to do everything yourself.
          A virtual assistant or subcontractor lets you stay in your highest-value zone -- the work only
          you can do.
        </p>

        <h2>What to Delegate First</h2>
        <p>
          Start with the tasks that are most time-consuming and least dependent on your expertise.
          Bookkeeping and expense tracking are a natural first hire -- tools like QuickBooks make
          handoff easy. Social media scheduling, email management, and calendar coordination are also
          easy wins. Client onboarding paperwork, invoice follow-ups, and scheduling can all be
          templated and handed off.
        </p>
        <p>
          As you get comfortable delegating, you can move up to higher-skill tasks: research, first
          drafts of proposals, basic design work, or even development tasks if you find a reliable
          subcontractor. The goal is to keep moving tasks off your plate so your time is spent on
          billable work and business strategy.
        </p>

        <h2>Contractor vs Employee</h2>
        <p>
          Most freelancers start by hiring 1099 contractors, not W-2 employees, and for good reason.
          Contractors are simpler from a legal and tax perspective -- no payroll taxes, no benefits
          obligations, no workers comp insurance. You pay them for the work they do and issue a 1099
          at year end.
        </p>
        <p>
          The trade-off is that you have less control over how and when a contractor works. If you need
          someone available 9-5 on your schedule using your tools and processes, the IRS may consider
          them an employee regardless of what your contract says. For most freelancers hiring part-time
          help, a contractor relationship works perfectly. Just make sure you have a written agreement
          covering scope, rates, confidentiality, and intellectual property.
        </p>
      </SEOContent>

      <FAQ items={[
        {
          question: "How do I know if I can afford to hire a VA or subcontractor?",
          answer: "Use this calculator to compare the cost of hiring against the additional revenue you could earn. If your net gain is positive, the hire pays for itself. Even if it is close to break-even, consider the non-financial benefits: less stress, faster turnaround for clients, and the ability to take on more projects.",
        },
        {
          question: "What is a reasonable hourly rate for a virtual assistant?",
          answer: "General VAs in the US typically charge $15-35/hr. Overseas VAs (Philippines, Latin America) range from $5-15/hr. Specialized VAs (bookkeeping, design, development) charge more -- $25-75/hr depending on the skill. Start with general admin tasks at a lower rate and move up as your needs grow.",
        },
        {
          question: "Should I hire a generalist or a specialist?",
          answer: "Start with a generalist VA who can handle multiple admin tasks. This gives you the biggest time savings for the lowest cost. Once you have consistent, specialized work (like bookkeeping every month or social media daily), it makes sense to bring on a specialist for that specific role.",
        },
        {
          question: "How many hours should I start with when hiring?",
          answer: "Start small -- 5 to 10 hours per week. This lets you build trust, create processes, and see the ROI before committing more. Most freelancers ramp up to 15-20 hours per week once they find a reliable VA and have systems in place.",
        },
        {
          question: "What is the difference between hiring a contractor and an employee?",
          answer: "A 1099 contractor controls how and when they work -- you define the deliverable, they decide the process. A W-2 employee works on your schedule under your direction. Contractors are simpler (no payroll tax, no benefits), which is why most freelancers start there. If you need full-time, dedicated help with set hours, you may eventually need to hire an employee.",
        },
      ]} />
    </CalculatorLayout>
  );
}
