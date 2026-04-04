import type { CalculatorConfig } from "@/lib/types";
import SalaryConverter from "./Calculator";

const config: CalculatorConfig = {
  name: "Salary to Hourly Converter",
  slug: "salary-converter",
  description:
    "Convert between hourly, daily, weekly, biweekly, monthly, and annual pay instantly.",
  keywords: [
    "salary to hourly calculator",
    "hourly to salary calculator",
    "annual salary to hourly rate",
    "how much is 50k a year hourly",
    "pay rate converter",
  ],
  category: "pricing",
  component: SalaryConverter,
};

export default config;
