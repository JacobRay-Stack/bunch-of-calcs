"use client";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "inline";
}

const sizeClasses = {
  banner: "h-24 w-full",
  sidebar: "h-64 w-full",
  inline: "h-20 w-full",
};

export default function AdSlot({ size = "inline" }: AdSlotProps) {
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600`}
    >
      Ad Space
    </div>
  );
}
