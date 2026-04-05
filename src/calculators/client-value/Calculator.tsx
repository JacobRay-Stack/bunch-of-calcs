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

export default function ClientValueCalculator() {
  const [avgProjectValue, setAvgProjectValue] = useState(3000);
  const [projectsPerYear, setProjectsPerYear] = useState(3);
  const [lifespanYears, setLifespanYears] = useState(2);
  const [acquisitionCost, setAcquisitionCost] = useState(500);
  const [referralProbability, setReferralProbability] = useState(20);
  const [avgReferralValue, setAvgReferralValue] = useState(2500);

  const { loadSaved, clearSaved } = useSavedInputs("client-value", {
    avgProjectValue, projectsPerYear, lifespanYears, acquisitionCost, referralProbability, avgReferralValue,
  });

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.avgProjectValue !== undefined) setAvgProjectValue(saved.avgProjectValue);
      if (saved.projectsPerYear !== undefined) setProjectsPerYear(saved.projectsPerYear);
      if (saved.lifespanYears !== undefined) setLifespanYears(saved.lifespanYears);
      if (saved.acquisitionCost !== undefined) setAcquisitionCost(saved.acquisitionCost);
      if (saved.referralProbability !== undefined) setReferralProbability(saved.referralProbability);
      if (saved.avgReferralValue !== undefined) setAvgReferralValue(saved.avgReferralValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setAvgProjectValue(3000);
    setProjectsPerYear(3);
    setLifespanYears(2);
    setAcquisitionCost(500);
    setReferralProbability(20);
    setAvgReferralValue(2500);
    clearSaved();
  };

  const results = useMemo(() => {
    const directRevenue = avgProjectValue * projectsPerYear * lifespanYears;
    const referralValue = (referralProbability / 100) * avgReferralValue * lifespanYears;
    const totalLTV = directRevenue + referralValue;
    const netLTV = totalLTV - acquisitionCost;
    const roi = acquisitionCost > 0 ? (netLTV / acquisitionCost) * 100 : 0;
    const monthlyValue = lifespanYears > 0 ? totalLTV / (lifespanYears * 12) : 0;

    return {
      directRevenue,
      referralValue,
      totalLTV,
      netLTV,
      roi,
      monthlyValue,
    };
  }, [avgProjectValue, projectsPerYear, lifespanYears, acquisitionCost, referralProbability, avgReferralValue]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  const fmtPct = (n: number) => Math.round(n).toLocaleString("en-US") + "%";

  return (
    <CalculatorLayout
      name="Client Lifetime Value Calculator"
      slug="client-value"
      category="planning"
      description="Calculate how much a client is worth over time to make smarter business decisions."
      onReset={handleReset}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Average Project Value"
          value={avgProjectValue}
          onChange={setAvgProjectValue}
          type="currency"
          min={0}
          max={50000}
          step={250}
          helpText="What you typically charge per project"
        />
        <SliderInput
          label="Projects Per Year From This Client"
          value={projectsPerYear}
          onChange={setProjectsPerYear}
          min={0}
          max={24}
          step={1}
          helpText="Repeat projects or retainer engagements"
        />
        <SliderInput
          label="Average Client Lifespan (Years)"
          value={lifespanYears}
          onChange={setLifespanYears}
          min={0}
          max={10}
          step={1}
          helpText="How long clients typically stay with you"
        />
        <SliderInput
          label="Client Acquisition Cost"
          value={acquisitionCost}
          onChange={setAcquisitionCost}
          type="currency"
          min={0}
          max={5000}
          step={50}
          helpText="Ad spend, sales time, proposals, etc."
        />
        <SliderInput
          label="Referral Probability"
          value={referralProbability}
          onChange={setReferralProbability}
          type="percentage"
          min={0}
          max={100}
          helpText="Chance this client refers someone to you"
        />
        <SliderInput
          label="Average Referral Value"
          value={avgReferralValue}
          onChange={setAvgReferralValue}
          type="currency"
          min={0}
          max={50000}
          step={250}
          helpText="Expected revenue from a referred client"
        />
      </div>

      <HeroResult
        label="Total Client Lifetime Value"
        value={fmt(results.totalLTV)}
        subtext={`${fmt(results.directRevenue)} direct revenue + ${fmt(results.referralValue)} referral value`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Net Value"
          value={fmt(results.netLTV)}
          highlight
          subtext="After subtracting acquisition cost"
        />
        <ResultCard
          label="ROI on Acquisition"
          value={fmtPct(results.roi)}
          subtext={`${fmt(acquisitionCost)} invested to acquire`}
        />
        <ResultCard
          label="Monthly Value"
          value={fmt(results.monthlyValue)}
          subtext="Average revenue per month of relationship"
        />
      </div>

      <ShareResults
        calculatorName="Client Lifetime Value Calculator"
        results={{
          "Total Lifetime Value": fmt(results.totalLTV),
          "Net Value": fmt(results.netLTV),
          "ROI": fmtPct(results.roi),
          "Monthly Value": fmt(results.monthlyValue),
        }}
      />

      <ScenarioCompare
        currentResults={{
          "Total Lifetime Value": fmt(results.totalLTV),
          "Net Value": fmt(results.netLTV),
          "ROI": fmtPct(results.roi),
          "Monthly Value": fmt(results.monthlyValue),
        }}
      />

      {/* Value breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Value Breakdown Over {lifespanYears} Year{lifespanYears !== 1 ? "s" : ""}
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Direct Revenue ({projectsPerYear} projects/yr x {lifespanYears} yr{lifespanYears !== 1 ? "s" : ""})</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(results.directRevenue)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Expected Referral Value ({referralProbability}% chance)</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(results.referralValue)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Minus Acquisition Cost</span>
            <span className="font-semibold text-red-600 dark:text-red-400">-{fmt(acquisitionCost)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center justify-between text-sm font-bold">
            <span className="text-gray-900 dark:text-gray-100">Net Lifetime Value</span>
            <span className={results.netLTV >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{fmt(results.netLTV)}</span>
          </div>
        </div>
      </div>

      {/* Contextual insight */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">What This Means</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {results.roi > 500
            ? `This client type is extremely profitable -- every dollar spent on acquisition returns ${Math.round(results.roi / 100)}x. You should invest more heavily in acquiring clients like this.`
            : results.roi > 100
            ? `Solid return on your acquisition investment. At ${fmtPct(results.roi)} ROI, each client more than pays for the effort to land them.`
            : results.roi > 0
            ? `This client is profitable but the margins are thin. Consider raising your project rates or finding ways to increase repeat business.`
            : `Warning: you are spending more to acquire this client than they generate in revenue. Either reduce your acquisition costs or increase project value.`}
        </p>
      </div>

      <SEOContent>
        <h2>Why Client Lifetime Value Matters for Freelancers</h2>
        <p>
          Most freelancers think about revenue on a project-by-project basis, but that is a
          short-sighted way to run a business. Client Lifetime Value (CLV) measures the total
          revenue a client generates over the entire relationship -- including repeat work and
          referrals. When you know your CLV, you can make smarter decisions about how much to
          invest in acquiring new clients, which clients to prioritize, and when it makes sense
          to fire a client.
        </p>
        <p>
          A client who pays $2,000 for a single project might seem less valuable than a $5,000
          project client. But if that $2,000 client comes back 4 times a year for 3 years, their
          lifetime value is $24,000 -- nearly 5x more. CLV shifts your thinking from transactional
          to relational, which is where the real money is in freelancing.
        </p>

        <h2>How to Increase Client Lifetime Value</h2>
        <p>
          There are four main levers: increase your project rates, increase the number of projects
          per client per year, extend the client relationship, and generate more referrals. The
          easiest lever is usually repeat business -- proactively suggesting follow-up work,
          offering retainer arrangements, and staying top of mind with past clients. A simple
          quarterly check-in email can dramatically extend average client lifespan.
        </p>
        <p>
          Referrals are the highest-quality lead source for freelancers because they come with
          built-in trust. Make it easy for clients to refer you: do great work, ask for
          testimonials, and explicitly ask happy clients if they know anyone else who could use
          your services. Even a modest 20% referral rate adds significant value over time.
        </p>

        <h2>When to Fire a Client</h2>
        <p>
          Not all clients are worth keeping. If a client consistently pays late, demands excessive
          revisions, causes stress that affects your other work, or simply does not generate enough
          revenue relative to the time invested, it may be time to let them go. Use CLV as one
          data point: if a client&apos;s lifetime value is low and the ROI on acquisition is
          negative or barely positive, your time is better spent acquiring better clients.
        </p>
        <p>
          Before firing a client, try to improve the relationship first. Raise your rates (they
          will either pay more or self-select out), set clearer boundaries, or reduce the scope
          of work. If nothing changes, politely transition them out and redirect that capacity
          toward higher-value clients.
        </p>
      </SEOContent>

      <FAQ items={[
        {
          question: "What is Client Lifetime Value (CLV)?",
          answer: "Client Lifetime Value is the total revenue you expect to earn from a single client over the entire duration of your business relationship. It includes direct project revenue, recurring work, and the expected value of referrals they send your way.",
        },
        {
          question: "How do I estimate my client acquisition cost?",
          answer: "Add up everything you spend to land a new client: ad spend, time spent on proposals (value your time at your hourly rate), networking costs, portfolio site hosting, and any tools you use for outreach. Divide the total by the number of new clients acquired in that period.",
        },
        {
          question: "What is a good ROI on client acquisition?",
          answer: "For freelancers, aim for at least 300-500% ROI on acquisition costs. This means for every $1 spent acquiring a client, you should earn at least $3-5 in net revenue over their lifetime. Higher is obviously better, but anything above 100% means you are profitable.",
        },
        {
          question: "Should I include referral value in my CLV calculation?",
          answer: "Yes, but be conservative with your referral probability estimate. Referrals are real revenue that would not exist without the original client relationship. Even a 10-20% referral probability can meaningfully increase CLV and justify higher acquisition spending.",
        },
        {
          question: "How can I increase my average client lifespan?",
          answer: "Deliver consistent quality, communicate proactively, suggest follow-up projects before the current one ends, offer retainer arrangements for ongoing work, and stay in touch between projects. Clients leave when they forget about you or feel like just another transaction.",
        },
      ]} />
    </CalculatorLayout>
  );
}
