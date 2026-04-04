// Shared tax constants and calculations for 2026 tax year.
// Update this ONE file when rates change for 2027+.

export const TAX_YEAR = 2026;

// Self-Employment Tax
export const SE_TAXABLE_PORTION = 0.9235;
export const SE_TAX_RATE = 0.153;
export const SS_RATE = 0.124;
export const MEDICARE_RATE = 0.029;
export const SS_WAGE_BASE = 184500;
export const ADDITIONAL_MEDICARE_THRESHOLD = 200000;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

// Standard Deductions
export const STANDARD_DEDUCTION_SINGLE = 15700;
export const STANDARD_DEDUCTION_MARRIED = 31400;

// Federal Income Tax Brackets (Single, 2026)
export const FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

// Federal Income Tax Brackets (Married Filing Jointly, 2026)
export const FEDERAL_BRACKETS_MARRIED = [
  { min: 0, max: 23850, rate: 0.10 },
  { min: 23850, max: 96950, rate: 0.12 },
  { min: 96950, max: 206700, rate: 0.22 },
  { min: 206700, max: 394600, rate: 0.24 },
  { min: 394600, max: 501050, rate: 0.32 },
  { min: 501050, max: 751600, rate: 0.35 },
  { min: 751600, max: Infinity, rate: 0.37 },
];

export type FilingStatus = "single" | "married";

export function getFederalBrackets(status: FilingStatus) {
  return status === "married" ? FEDERAL_BRACKETS_MARRIED : FEDERAL_BRACKETS_SINGLE;
}

export function getStandardDeduction(status: FilingStatus) {
  return status === "married" ? STANDARD_DEDUCTION_MARRIED : STANDARD_DEDUCTION_SINGLE;
}

/**
 * Calculate federal income tax using marginal brackets.
 */
export function calculateFederalTax(taxableIncome: number, status: FilingStatus = "single"): number {
  const brackets = getFederalBrackets(status);
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

/**
 * Get the marginal tax bracket rate for a given taxable income.
 */
export function getMarginalBracket(taxableIncome: number, status: FilingStatus = "single"): number {
  const brackets = getFederalBrackets(status);
  for (const b of [...brackets].reverse()) {
    if (taxableIncome > b.min) return b.rate * 100;
  }
  return 10;
}

/**
 * Calculate self-employment tax components.
 */
export function calculateSETax(netIncome: number, w2Wages: number = 0) {
  const seTaxableIncome = netIncome * SE_TAXABLE_PORTION;

  // Social Security: only on income up to wage base, minus any W2 wages already taxed
  const ssBase = Math.max(0, Math.min(seTaxableIncome, SS_WAGE_BASE - w2Wages));
  const ssTax = ssBase * SS_RATE;

  // Medicare: no cap
  const medicareTax = seTaxableIncome * MEDICARE_RATE;

  // Additional Medicare: on SE income over threshold
  const additionalMedicare =
    seTaxableIncome > ADDITIONAL_MEDICARE_THRESHOLD
      ? (seTaxableIncome - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
      : 0;

  const totalSeTax = ssTax + medicareTax + additionalMedicare;
  const seDeduction = totalSeTax / 2;

  return {
    seTaxableIncome,
    ssTax,
    medicareTax,
    additionalMedicare,
    totalSeTax,
    seDeduction,
  };
}

// Quarterly payment due dates
export const QUARTERLY_DUE_DATES = [
  { label: "Q1", months: "Jan - Mar", dueDate: `April 15, ${TAX_YEAR}`, isPast: false },
  { label: "Q2", months: "Apr - May", dueDate: `June 15, ${TAX_YEAR}`, isPast: false },
  { label: "Q3", months: "Jun - Aug", dueDate: `September 15, ${TAX_YEAR}`, isPast: false },
  { label: "Q4", months: "Sep - Dec", dueDate: `January 15, ${TAX_YEAR + 1}`, isPast: false },
];

/**
 * Format a number as currency.
 */
export function formatCurrency(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

/**
 * Format a number as a percentage.
 */
export function formatPercent(n: number): string {
  return n.toFixed(1) + "%";
}
