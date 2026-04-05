import type { CalculatorConfig } from "@/lib/types";
import EmergencyFundCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Freelancer Emergency Fund Calculator",
  slug: "emergency-fund",
  description:
    "Calculate how much you need in savings to weather slow months and unexpected gaps between clients.",
  keywords: [
    "freelancer emergency fund calculator",
    "emergency savings freelance",
    "freelance rainy day fund",
    "how much emergency fund freelancer",
    "freelance savings goal",
  ],
  category: "planning",
  component: EmergencyFundCalculator,
};

export default config;
