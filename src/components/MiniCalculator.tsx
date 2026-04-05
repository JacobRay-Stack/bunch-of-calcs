"use client";

import { useState } from "react";
import Link from "next/link";

const WORK_DAYS_PER_YEAR = 260;
const HOURS_PER_DAY = 8;
const DEFAULT_EXPENSES = 5000;
const DEFAULT_VACATION = 15;
const DEFAULT_SICK = 5;

export default function MiniCalculator() {
  const [salary, setSalary] = useState(75000);
  const [taxRate, setTaxRate] = useState(25);

  const workingDays = WORK_DAYS_PER_YEAR - DEFAULT_VACATION - DEFAULT_SICK;
  const billableHours = workingDays * HOURS_PER_DAY;
  const totalNeeded = (salary + DEFAULT_EXPENSES) / (1 - taxRate / 100);
  const hourlyRate = totalNeeded / billableHours;
  const recommendedRate = hourlyRate * 1.2;

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
        Quick Estimate
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-center justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Desired Salary
            </label>
            <span className="tabular-nums font-semibold text-gray-900 dark:text-gray-100">
              {fmt(salary)}
            </span>
          </div>
          <input
            type="range"
            min={30000}
            max={300000}
            step={5000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="mt-2 w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>$30k</span>
            <span>$300k</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Tax Rate
            </label>
            <span className="tabular-nums font-semibold text-gray-900 dark:text-gray-100">
              {taxRate}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="mt-2 w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>10%</span>
            <span>40%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-teal-50 p-4 text-center dark:bg-teal-950">
        <p className="text-xs font-medium text-teal-600 uppercase tracking-wide dark:text-teal-400">
          Your Hourly Rate
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
          {fmt(recommendedRate)}
          <span className="text-lg font-medium text-teal-500 dark:text-teal-400">/hr</span>
        </p>
      </div>

      <Link
        href={`/freelance-rate?salary=${salary}&tax=${taxRate}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
      >
        See full breakdown
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}
