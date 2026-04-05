"use client";

interface HeroResultProps {
  label: string;
  value: string;
  subtext?: string;
}

export default function HeroResult({ label, value, subtext }: HeroResultProps) {
  return (
    <div className="my-8 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 text-center dark:border-teal-800 dark:from-teal-950 dark:to-gray-900">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-600 dark:text-teal-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold tabular-nums text-gray-900 sm:text-5xl dark:text-gray-100">
        {value}
      </p>
      {subtext && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtext}</p>
      )}
    </div>
  );
}
