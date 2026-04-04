import type { CalculatorConfig } from "@/lib/types";
import ProjectPriceCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Project Price Calculator",
  slug: "project-price",
  description:
    "Build a client-ready project quote from your hourly rate, estimated hours, and expenses.",
  keywords: [
    "project price calculator",
    "freelance quote calculator",
    "project cost estimator",
    "how to price a project",
    "freelance project pricing",
  ],
  category: "pricing",
  component: ProjectPriceCalculator,
};

export default config;
