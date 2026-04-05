"use client";

import AdSlot from "./AdSlot";
import Breadcrumbs from "./Breadcrumbs";
import TrustBar from "./TrustBar";
import CalculatorToolbar from "./CalculatorToolbar";
import ServiceRecommendations from "./ServiceRecommendations";
import RelatedCalculators from "./RelatedCalculators";
import EmailCapture from "./EmailCapture";

interface CalculatorLayoutProps {
  name: string;
  slug: string;
  category: string;
  description: string;
  onReset?: () => void;
  serviceContext?: string;
  children: React.ReactNode;
}

export default function CalculatorLayout({
  name,
  slug,
  category,
  description,
  onReset,
  serviceContext,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs category={category} calculatorName={name} />

      <div className="mb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">{name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
          </div>
          <div className="flex-shrink-0 pt-1">
            <CalculatorToolbar onReset={onReset} />
          </div>
        </div>
      </div>

      <TrustBar />

      <div className="mt-8">{children}</div>

      <div className="mt-10">
        <AdSlot size="banner" />
      </div>

      <ServiceRecommendations calculatorSlug={slug} contextLine={serviceContext} />

      <EmailCapture />

      <RelatedCalculators currentSlug={slug} />
    </div>
  );
}
