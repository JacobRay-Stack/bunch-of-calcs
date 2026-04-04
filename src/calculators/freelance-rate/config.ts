import type { CalculatorConfig } from "@/lib/types";
import FreelanceRateCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Freelance Rate Calculator",
  slug: "freelance-rate",
  description:
    "Calculate your ideal hourly, daily, and project rates based on your income goals, expenses, and taxes.",
  keywords: [
    "freelance rate calculator",
    "how much to charge freelance",
    "freelancer hourly rate",
    "consulting rate calculator",
    "freelance pricing",
  ],
  category: "pricing",
  component: FreelanceRateCalculator,
};

export default config;
