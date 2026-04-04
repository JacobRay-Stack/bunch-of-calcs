import type { ComponentType } from "react";

export interface CalculatorConfig {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  category: string;
  component: ComponentType;
}
