"use client";

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: "number" | "currency" | "percentage";
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step = 1,
  helpText,
}: InputFieldProps) {
  const prefix = type === "currency" ? "$" : undefined;
  const suffix = type === "percentage" ? "%" : undefined;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 ${
            prefix ? "pl-7" : ""
          } ${suffix ? "pr-8" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
}
