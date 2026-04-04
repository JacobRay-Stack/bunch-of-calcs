import type { CalculatorConfig } from "@/lib/types";
import InvoiceFeeCalculator from "./Calculator";

const config: CalculatorConfig = {
  name: "Invoice Fee Calculator",
  slug: "invoice-fees",
  description:
    "See exactly how much PayPal, Stripe, Square, and other processors take from your invoice.",
  keywords: [
    "paypal fee calculator",
    "stripe fee calculator",
    "payment processing fee calculator",
    "invoice fee calculator",
    "square fee calculator",
  ],
  category: "pricing",
  component: InvoiceFeeCalculator,
};

export default config;
