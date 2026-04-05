"use client";

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
  subtext?: string;
}

export default function ResultCard({
  label,
  value,
  highlight = false,
  subtext,
}: ResultCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950"
          : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold sm:text-3xl ${
          highlight ? "text-teal-700 dark:text-teal-400" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {value}
      </p>
      {subtext && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
    </div>
  );
}
