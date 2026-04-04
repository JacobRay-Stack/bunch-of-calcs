import type { Metadata } from "next";
import type { CalculatorConfig } from "./types";

const SITE_NAME = "Bunch of Calcs";
const SITE_URL = "https://bunchofcalcs.com";

export function generateCalculatorMetadata(calc: CalculatorConfig): Metadata {
  const title = `${calc.name} | ${SITE_NAME}`;
  const description = calc.description;

  return {
    title,
    description,
    keywords: calc.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${calc.slug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const defaultMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} -- Free Calculators for Freelancers`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free online calculators built for freelancers and solopreneurs. Calculate your rates, taxes, profit margins, and more.",
  keywords: [
    "freelance calculator",
    "rate calculator",
    "freelancer tools",
    "solopreneur calculator",
    "business calculator",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
};
