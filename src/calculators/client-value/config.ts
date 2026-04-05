import type { CalculatorConfig } from "@/lib/types";
import ClientValueCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Client Lifetime Value Calculator",
  slug: "client-value",
  description:
    "Calculate how much a client is worth over time to make smarter business decisions.",
  keywords: [
    "client lifetime value calculator",
    "freelance client value",
    "CLV calculator",
    "customer lifetime value freelancer",
    "client worth calculator",
  ],
  category: "planning",
  component: ClientValueCalculator,
};

export default config;
