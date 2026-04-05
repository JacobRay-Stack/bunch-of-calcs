import type { CalculatorConfig } from "@/lib/types";
import freelanceRate from "./freelance-rate/config";
import selfEmploymentTax from "./self-employment-tax/config";
import salaryConverter from "./salary-converter/config";
import comparison1099vsW2 from "./1099-vs-w2/config";
import profitMargin from "./profit-margin/config";
import invoiceFees from "./invoice-fees/config";
import taxDeductions from "./tax-deductions/config";
import breakEven from "./break-even/config";
import projectPrice from "./project-price/config";
import sideHustleTax from "./side-hustle-tax/config";
import quarterlyTax from "./quarterly-tax/config";
import lifestyleBudget from "./lifestyle-budget/config";
import clientValue from "./client-value/config";
import emergencyFund from "./emergency-fund/config";
import hireCalculator from "./hire-calculator/config";

// Add new calculators here. The homepage and dynamic routes read from this array.
const calculators: CalculatorConfig[] = [
  freelanceRate,
  selfEmploymentTax,
  salaryConverter,
  comparison1099vsW2,
  profitMargin,
  invoiceFees,
  taxDeductions,
  breakEven,
  projectPrice,
  sideHustleTax,
  quarterlyTax,
  lifestyleBudget,
  clientValue,
  emergencyFund,
  hireCalculator,
];

export default calculators;

export function getCalculatorBySlug(
  slug: string
): CalculatorConfig | undefined {
  return calculators.find((c) => c.slug === slug);
}
