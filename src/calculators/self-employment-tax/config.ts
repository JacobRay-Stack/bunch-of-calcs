import type { CalculatorConfig } from "@/lib/types";
import SelfEmploymentTaxCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Self-Employment Tax Calculator",
  slug: "self-employment-tax",
  description:
    "Estimate your self-employment tax, federal income tax, and quarterly payments for 2026.",
  keywords: [
    "self employment tax calculator",
    "1099 tax calculator",
    "freelance tax calculator",
    "SE tax calculator",
    "self employment tax rate",
  ],
  category: "taxes",
  component: SelfEmploymentTaxCalculator,
};

export default config;
