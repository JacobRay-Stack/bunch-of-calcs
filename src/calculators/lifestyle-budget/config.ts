import type { CalculatorConfig } from "@/lib/types";
import LifestyleBudgetCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "What Can I Afford? Calculator",
  slug: "lifestyle-budget",
  description:
    "See what lifestyle you can afford based on your freelance rate, hours, and expenses.",
  keywords: [
    "freelance budget calculator",
    "what can I afford freelance",
    "freelancer lifestyle calculator",
    "freelance take home pay",
    "freelance income planning",
  ],
  category: "planning",
  component: LifestyleBudgetCalculator,
};

export default config;
