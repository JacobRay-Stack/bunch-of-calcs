import type { CalculatorConfig } from "@/lib/types";
import ProfitMarginCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Profit Margin Calculator",
  slug: "profit-margin",
  description:
    "Calculate gross margin, net margin, and markup percentage from your revenue and costs.",
  keywords: [
    "profit margin calculator",
    "gross margin calculator",
    "markup calculator",
    "net profit margin",
    "margin vs markup",
  ],
  category: "profit",
  component: ProfitMarginCalculator,
};

export default config;
