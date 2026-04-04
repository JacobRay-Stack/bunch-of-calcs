import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import calculators, { getCalculatorBySlug } from "@/calculators";
import { generateCalculatorMetadata, generateWebApplicationJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((calc) => ({ slug: calc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return {};
  return generateCalculatorMetadata(calc);
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const Component = calc.component;
  const jsonLd = generateWebApplicationJsonLd(calc);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <Component />
      </Suspense>
    </>
  );
}
