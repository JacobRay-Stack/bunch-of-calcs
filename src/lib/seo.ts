import type { Metadata } from "next";
import type { CalculatorConfig } from "./types";

const SITE_NAME = "Bunch of Calcs";
const SITE_URL = "https://www.bunchofcalcs.com";
const OG_IMAGE = `${SITE_URL}/og-default.png`;

export function generateCalculatorMetadata(calc: CalculatorConfig): Metadata {
  const title = `${calc.name} | ${SITE_NAME}`;
  const description = calc.description;
  const url = `${SITE_URL}/${calc.slug}`;

  return {
    title,
    description,
    keywords: calc.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: SITE_NAME,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${calc.name} - ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function generateWebApplicationJsonLd(calc: CalculatorConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.name,
    description: calc.description,
    url: `${SITE_URL}/${calc.slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://www.bunchofcalcs.com"),
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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} - Free Calculators for Freelancers` }],
  },
};
