// State income tax rates for 2026.
// Uses top marginal rate as a simplified flat rate for estimation.
// States with no income tax are marked as 0.

export interface StateTax {
  name: string;
  abbr: string;
  rate: number; // Top marginal rate as decimal (0.05 = 5%)
}

export const STATE_TAXES: StateTax[] = [
  { name: "No State Tax", abbr: "NONE", rate: 0 },
  { name: "Alabama", abbr: "AL", rate: 0.05 },
  { name: "Alaska", abbr: "AK", rate: 0 },
  { name: "Arizona", abbr: "AZ", rate: 0.025 },
  { name: "Arkansas", abbr: "AR", rate: 0.039 },
  { name: "California", abbr: "CA", rate: 0.133 },
  { name: "Colorado", abbr: "CO", rate: 0.044 },
  { name: "Connecticut", abbr: "CT", rate: 0.0699 },
  { name: "Delaware", abbr: "DE", rate: 0.066 },
  { name: "Florida", abbr: "FL", rate: 0 },
  { name: "Georgia", abbr: "GA", rate: 0.0549 },
  { name: "Hawaii", abbr: "HI", rate: 0.11 },
  { name: "Idaho", abbr: "ID", rate: 0.058 },
  { name: "Illinois", abbr: "IL", rate: 0.0495 },
  { name: "Indiana", abbr: "IN", rate: 0.0305 },
  { name: "Iowa", abbr: "IA", rate: 0.038 },
  { name: "Kansas", abbr: "KS", rate: 0.057 },
  { name: "Kentucky", abbr: "KY", rate: 0.04 },
  { name: "Louisiana", abbr: "LA", rate: 0.0425 },
  { name: "Maine", abbr: "ME", rate: 0.0715 },
  { name: "Maryland", abbr: "MD", rate: 0.0575 },
  { name: "Massachusetts", abbr: "MA", rate: 0.09 },
  { name: "Michigan", abbr: "MI", rate: 0.0425 },
  { name: "Minnesota", abbr: "MN", rate: 0.0985 },
  { name: "Mississippi", abbr: "MS", rate: 0.047 },
  { name: "Missouri", abbr: "MO", rate: 0.048 },
  { name: "Montana", abbr: "MT", rate: 0.059 },
  { name: "Nebraska", abbr: "NE", rate: 0.0564 },
  { name: "Nevada", abbr: "NV", rate: 0 },
  { name: "New Hampshire", abbr: "NH", rate: 0 },
  { name: "New Jersey", abbr: "NJ", rate: 0.1075 },
  { name: "New Mexico", abbr: "NM", rate: 0.059 },
  { name: "New York", abbr: "NY", rate: 0.109 },
  { name: "North Carolina", abbr: "NC", rate: 0.045 },
  { name: "North Dakota", abbr: "ND", rate: 0.0195 },
  { name: "Ohio", abbr: "OH", rate: 0.035 },
  { name: "Oklahoma", abbr: "OK", rate: 0.0475 },
  { name: "Oregon", abbr: "OR", rate: 0.099 },
  { name: "Pennsylvania", abbr: "PA", rate: 0.0307 },
  { name: "Rhode Island", abbr: "RI", rate: 0.0599 },
  { name: "South Carolina", abbr: "SC", rate: 0.064 },
  { name: "South Dakota", abbr: "SD", rate: 0 },
  { name: "Tennessee", abbr: "TN", rate: 0 },
  { name: "Texas", abbr: "TX", rate: 0 },
  { name: "Utah", abbr: "UT", rate: 0.0465 },
  { name: "Vermont", abbr: "VT", rate: 0.0875 },
  { name: "Virginia", abbr: "VA", rate: 0.0575 },
  { name: "Washington", abbr: "WA", rate: 0 },
  { name: "West Virginia", abbr: "WV", rate: 0.0512 },
  { name: "Wisconsin", abbr: "WI", rate: 0.0765 },
  { name: "Wyoming", abbr: "WY", rate: 0 },
  { name: "District of Columbia", abbr: "DC", rate: 0.1075 },
];

/**
 * Calculate estimated state income tax using simplified flat rate.
 * Real state taxes have brackets, but this gives a reasonable estimate
 * and is clearly labeled as an estimate in the UI.
 */
export function calculateStateTax(taxableIncome: number, stateAbbr: string): number {
  const state = STATE_TAXES.find((s) => s.abbr === stateAbbr);
  if (!state || state.rate === 0) return 0;
  return Math.max(0, taxableIncome) * state.rate;
}

export function getStateName(abbr: string): string {
  const state = STATE_TAXES.find((s) => s.abbr === abbr);
  return state ? state.name : "Unknown";
}
