"use client";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max?: number;
  step?: number;
  type?: "number" | "currency" | "percentage";
  helpText?: string;
}

function formatDisplay(value: number, type: string): string {
  if (type === "currency") {
    return "$" + value.toLocaleString("en-US");
  }
  if (type === "percentage") {
    return value + "%";
  }
  return value.toLocaleString("en-US");
}

export default function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  type = "number",
  helpText,
}: SliderInputProps) {
  // Default max based on type if not provided
  const effectiveMax = max ?? (type === "percentage" ? 100 : type === "currency" ? Math.max(value * 3, 10000) : Math.max(value * 3, 100));
  const pct = effectiveMax > min ? ((value - min) / (effectiveMax - min)) * 100 : 0;
  const sliderId = label.toLowerCase().replace(/\s+/g, "-") + "-slider";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={sliderId} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {formatDisplay(value, type)}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={effectiveMax}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={effectiveMax}
        aria-valuenow={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, ${
            "var(--slider-track, #e5e7eb)"
          } ${pct}%, ${"var(--slider-track, #e5e7eb)"} 100%)`,
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
          {type === "currency" ? "$" + min.toLocaleString() : min}
        </span>
        <div className="flex-1 px-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            min={min}
            max={effectiveMax}
            step={step}
            aria-label={`${label} exact value`}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-center text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
          {type === "currency" ? "$" + effectiveMax.toLocaleString() : effectiveMax}
        </span>
      </div>
      {helpText && <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
}
