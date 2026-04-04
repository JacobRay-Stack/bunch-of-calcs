"use client";

import AdSlot from "./AdSlot";
import Breadcrumbs from "./Breadcrumbs";
import TrustBar from "./TrustBar";
import ServiceRecommendations from "./ServiceRecommendations";
import RelatedCalculators from "./RelatedCalculators";

interface CalculatorLayoutProps {
  name: string;
  slug: string;
  category: string;
  description: string;
  children: React.ReactNode;
}

export default function CalculatorLayout({
  name,
  slug,
  category,
  description,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs category={category} calculatorName={name} />

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">{name}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      <TrustBar />

      <div className="mt-8">{children}</div>

      <div className="mt-10">
        <AdSlot size="banner" />
      </div>

      <ServiceRecommendations calculatorSlug={slug} />

      <RelatedCalculators currentSlug={slug} />
    </div>
  );
}
