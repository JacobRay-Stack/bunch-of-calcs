import type { CalculatorConfig } from "@/lib/types";
import HireCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Should I Hire? Calculator",
  slug: "hire-calculator",
  description:
    "Find out when it makes financial sense to hire a subcontractor or virtual assistant for your freelance business.",
  keywords: [
    "should I hire a VA",
    "freelancer hire calculator",
    "virtual assistant ROI",
    "subcontractor cost calculator",
    "freelance delegation calculator",
  ],
  category: "planning",
  component: HireCalculator,
};

export default config;
