import type { CalculatorConfig } from "@/lib/types";
import QuarterlyTaxCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Quarterly Tax Payment Calculator",
  slug: "quarterly-tax",
  description:
    "Calculate your estimated quarterly tax payments with due dates so you never miss a deadline.",
  keywords: [
    "quarterly tax calculator",
    "estimated tax payment calculator",
    "quarterly tax due dates 2026",
    "how much quarterly taxes",
    "1099 quarterly taxes",
  ],
  category: "taxes",
  component: QuarterlyTaxCalculator,
};

export default config;
