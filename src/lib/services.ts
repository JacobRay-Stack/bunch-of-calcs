export interface RecommendedService {
  name: string;
  description: string;
  cta: string;
  url: string; // Replace with actual affiliate links when you sign up
  tag: string; // "Invoicing" | "Tax Filing" | "Accounting" | "Proposals"
}

// Replace these URLs with your actual affiliate links once you sign up for each program.
// Placeholder URLs point to the main product pages for now.

export const SERVICES: Record<string, RecommendedService> = {
  freshbooks: {
    name: "FreshBooks",
    description:
      "Send professional invoices, track expenses, and get paid faster. Built for freelancers.",
    cta: "Try FreshBooks Free",
    url: "https://www.freshbooks.com",
    tag: "Invoicing",
  },
  bonsai: {
    name: "Bonsai",
    description:
      "All-in-one freelance suite: contracts, proposals, invoicing, accounting, and taxes.",
    cta: "Try Bonsai Free",
    url: "https://www.hellobonsai.com",
    tag: "Freelance Suite",
  },
  turbotax: {
    name: "TurboTax Self-Employed",
    description:
      "File your freelance taxes with confidence. Finds every deduction you qualify for.",
    cta: "Start Filing Free",
    url: "https://turbotax.intuit.com/personal-taxes/online/self-employed.jsp",
    tag: "Tax Filing",
  },
  quickbooks: {
    name: "QuickBooks Self-Employed",
    description:
      "Track income, expenses, and mileage. Sorts transactions and estimates quarterly taxes automatically.",
    cta: "Try QuickBooks Free",
    url: "https://quickbooks.intuit.com/self-employed/",
    tag: "Accounting",
  },
  honeybook: {
    name: "HoneyBook",
    description:
      "Send proposals, contracts, and invoices in one beautiful client flow. Built for creative pros.",
    cta: "Try HoneyBook Free",
    url: "https://www.honeybook.com",
    tag: "Proposals",
  },
  wave: {
    name: "Wave",
    description:
      "Free accounting and invoicing software for small businesses and freelancers.",
    cta: "Get Wave Free",
    url: "https://www.waveapps.com",
    tag: "Accounting",
  },
};

// Map each calculator slug to its recommended services (ordered by relevance)
export const CALCULATOR_SERVICES: Record<string, string[]> = {
  "freelance-rate": ["freshbooks", "bonsai", "honeybook"],
  "self-employment-tax": ["turbotax", "quickbooks", "bonsai"],
  "salary-converter": ["freshbooks", "quickbooks"],
  "1099-vs-w2": ["turbotax", "quickbooks", "bonsai"],
  "profit-margin": ["quickbooks", "freshbooks", "wave"],
  "invoice-fees": ["freshbooks", "bonsai", "wave"],
  "tax-deductions": ["turbotax", "quickbooks", "bonsai"],
  "break-even": ["quickbooks", "freshbooks", "wave"],
  "project-price": ["bonsai", "honeybook", "freshbooks"],
  "side-hustle-tax": ["turbotax", "quickbooks"],
  "quarterly-tax": ["turbotax", "quickbooks", "bonsai"],
};
