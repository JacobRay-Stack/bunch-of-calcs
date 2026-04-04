import type { CalculatorConfig } from "@/lib/types";
import SideHustleTaxCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Side Hustle Tax Calculator",
  slug: "side-hustle-tax",
  description:
    "Have a day job plus freelance income? See how your side hustle affects your total tax bill.",
  keywords: [
    "side hustle tax calculator",
    "side income tax calculator",
    "1099 and w2 tax calculator",
    "extra income tax calculator",
    "how much tax on side hustle",
  ],
  category: "taxes",
  component: SideHustleTaxCalculator,
};

export default config;
