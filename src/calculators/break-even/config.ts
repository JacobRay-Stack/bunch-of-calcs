import type { CalculatorConfig } from "@/lib/types";
import BreakEvenCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Break-Even Calculator",
  slug: "break-even",
  description:
    "Find out how many clients, projects, or sales you need to cover your monthly expenses.",
  keywords: [
    "break even calculator",
    "break even point calculator",
    "break even analysis",
    "how many clients do I need",
    "freelance break even",
  ],
  category: "planning",
  component: BreakEvenCalculator,
};

export default config;
