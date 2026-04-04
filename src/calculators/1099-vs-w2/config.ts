import type { CalculatorConfig } from "@/lib/types";
import ComparisonCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "1099 vs W2 Take-Home Comparison",
  slug: "1099-vs-w2",
  description:
    "See the real difference between freelance and salaried income after taxes, benefits, and expenses.",
  keywords: [
    "1099 vs w2 calculator",
    "freelance vs salary comparison",
    "contractor vs employee pay",
    "1099 take home pay calculator",
    "self employed vs employed",
  ],
  category: "taxes",
  component: ComparisonCalculator,
};

export default config;
