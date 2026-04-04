import type { CalculatorConfig } from "@/lib/types";
import TaxDeductionCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Freelance Tax Deduction Estimator",
  slug: "tax-deductions",
  description:
    "Estimate how much you can save by claiming common freelance business deductions.",
  keywords: [
    "freelance tax deductions",
    "self employed deductions calculator",
    "business expense deduction calculator",
    "home office deduction calculator",
    "freelance write offs",
  ],
  category: "taxes",
  component: TaxDeductionCalculator,
};

export default config;
