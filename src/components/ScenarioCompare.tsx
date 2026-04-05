"use client";

import { useState } from "react";

interface ScenarioCompareProps {
  currentResults: Record<string, string>;
  currentLabel?: string;
}

export default function ScenarioCompare({
  currentResults,
  currentLabel = "Current",
}: ScenarioCompareProps) {
  const [savedScenario, setSavedScenario] = useState<Record<string, string> | null>(null);
  const [savedLabel, setSavedLabel] = useState("Scenario A");

  const handleSave = () => {
    setSavedScenario({ ...currentResults });
    setSavedLabel(savedScenario ? "Scenario A" : "Scenario A");
  };

  const handleClear = () => {
    setSavedScenario(null);
  };

  if (!savedScenario) {
    return (
      <div className="mt-4 print:hidden">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-teal-600 dark:hover:bg-teal-950 dark:hover:text-teal-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Save scenario to compare
        </button>
      </div>
    );
  }

  const keys = Object.keys(currentResults);

  return (
    <div className="mt-6 print:hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Scenario Comparison</h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            Update saved
          </button>
          <button
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        {/* Header row */}
        <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <div className="px-4 py-2.5" />
          <div className="px-4 py-2.5 text-center border-l border-gray-200 dark:border-gray-700">{savedLabel}</div>
          <div className="px-4 py-2.5 text-center border-l border-gray-200 dark:border-gray-700 text-teal-600 dark:text-teal-400">{currentLabel}</div>
        </div>
        {/* Data rows */}
        {keys.map((key) => {
          const saved = savedScenario[key] || "--";
          const current = currentResults[key];
          const changed = saved !== current;
          return (
            <div key={key} className="grid grid-cols-3 border-t border-gray-100 dark:border-gray-800 text-sm">
              <div className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium">{key}</div>
              <div className="px-4 py-2.5 text-center tabular-nums border-l border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                {saved}
              </div>
              <div className={`px-4 py-2.5 text-center tabular-nums border-l border-gray-100 dark:border-gray-800 font-medium ${changed ? "text-teal-600 dark:text-teal-400" : "text-gray-700 dark:text-gray-300"}`}>
                {current}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Adjust the inputs above to see how changes affect your results compared to the saved scenario.
      </p>
    </div>
  );
}
