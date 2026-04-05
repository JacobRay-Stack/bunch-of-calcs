"use client";

import { STATE_TAXES } from "@/lib/state-taxes";

interface StateSelectorProps {
  value: string;
  onChange: (abbr: string) => void;
}

export default function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        State
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {STATE_TAXES.map((s) => (
          <option key={s.abbr} value={s.abbr}>
            {s.name}
            {s.rate > 0 ? ` (${(s.rate * 100).toFixed(1)}%)` : s.abbr !== "NONE" ? " (no tax)" : ""}
          </option>
        ))}
      </select>
      <p className="text-xs text-amber-600 dark:text-amber-400">
        Estimated using the top marginal rate -- your actual state tax may be lower
      </p>
    </div>
  );
}
