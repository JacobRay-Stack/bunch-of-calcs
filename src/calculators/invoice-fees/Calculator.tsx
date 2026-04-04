"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CalculatorLayout from "@/components/CalculatorLayout";
import SliderInput from "@/components/SliderInput";
import HeroResult from "@/components/HeroResult";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";

const PROCESSORS = [
  { name: "Stripe", rate: 2.9, fixed: 0.3, maxFee: Infinity, color: "bg-indigo-500" },
  { name: "Stripe ACH", rate: 0.8, fixed: 0, maxFee: 5, color: "bg-indigo-300" },
  { name: "PayPal", rate: 3.49, fixed: 0.49, maxFee: Infinity, color: "bg-blue-500" },
  { name: "Square", rate: 2.6, fixed: 0.1, maxFee: Infinity, color: "bg-gray-800" },
  { name: "Venmo Business", rate: 1.9, fixed: 0.1, maxFee: Infinity, color: "bg-cyan-500" },
  { name: "Cash App Business", rate: 2.75, fixed: 0, maxFee: Infinity, color: "bg-emerald-500" },
  { name: "HoneyBook", rate: 3.0, fixed: 0, maxFee: Infinity, color: "bg-orange-500" },
  { name: "Wave", rate: 2.9, fixed: 0.6, maxFee: Infinity, color: "bg-sky-500" },
  { name: "Wise", rate: 1.5, fixed: 0, maxFee: Infinity, color: "bg-green-500" },
  { name: "Zelle", rate: 0, fixed: 0, maxFee: Infinity, color: "bg-purple-500" },
];

const FREQUENCY_OPTIONS = [
  { key: "weekly", label: "Weekly", multiplier: 52 },
  { key: "biweekly", label: "Biweekly", multiplier: 26 },
  { key: "monthly", label: "Monthly", multiplier: 12 },
  { key: "quarterly", label: "Quarterly", multiplier: 4 },
] as const;

type Frequency = (typeof FREQUENCY_OPTIONS)[number]["key"];

export default function InvoiceFeeCalculator() {
  const searchParams = useSearchParams();
  const [invoiceAmount, setInvoiceAmount] = useState(1500);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  useEffect(() => {
    const amt = searchParams.get("amount");
    if (amt) setInvoiceAmount(Number(amt));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const frequencyMultiplier = FREQUENCY_OPTIONS.find((f) => f.key === frequency)!.multiplier;

  const results = useMemo(() => {
    return PROCESSORS.map((p) => {
      const rawFee = invoiceAmount * (p.rate / 100) + p.fixed;
      const fee = Math.min(rawFee, p.maxFee);
      const youReceive = invoiceAmount - fee;
      const effectiveRate = invoiceAmount > 0 ? (fee / invoiceAmount) * 100 : 0;
      const annualFees = fee * frequencyMultiplier;
      return { ...p, fee, youReceive, effectiveRate, annualFees };
    }).sort((a, b) => a.fee - b.fee);
  }, [invoiceAmount, frequencyMultiplier]);

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const savings = mostExpensive.fee - cheapest.fee;

  return (
    <CalculatorLayout
      name="Invoice Fee Calculator"
      slug="invoice-fees"
      category="pricing"
      description="Compare payment processor fees side by side. See exactly how much you keep from every invoice."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SliderInput
          label="Invoice Amount"
          value={invoiceAmount}
          onChange={setInvoiceAmount}
          type="currency"
          min={0}
          step={100}
          helpText="The total you're billing your client"
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Invoicing Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            {FREQUENCY_OPTIONS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      <HeroResult
        label="Annual Processing Fees (Most Expensive)"
        value={fmt(mostExpensive.annualFees)}
        subtext={`Using ${mostExpensive.name} -- switch to ${cheapest.name} to save ${fmt(mostExpensive.annualFees - cheapest.annualFees)}/year`}
      />

      {/* Comparison table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Processor</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Rate</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Fee</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">You Receive</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Annual Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map((p, i) => (
                <tr
                  key={p.name}
                  className={`transition-colors ${
                    i === 0 ? "bg-green-50 dark:bg-green-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                      {/* Replace href with affiliate links */}
                      <a href="#" rel="sponsored noopener" className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                        {p.name}
                      </a>
                      {i === 0 && (
                        <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-200">
                          Cheapest
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {p.rate}%{p.fixed > 0 ? ` + ${fmt(p.fixed)}` : ""}
                    {p.maxFee < Infinity ? ` (max ${fmt(p.maxFee)})` : ""}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-red-600 dark:text-red-400">
                    −{fmt(p.fee)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-gray-900 dark:text-gray-100">
                    {fmt(p.youReceive)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-700 dark:text-gray-300">
                    {fmt(p.annualFees)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Savings callout */}
      {savings > 0.01 && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Switching from <strong>{mostExpensive.name}</strong> to{" "}
            <strong>{cheapest.name}</strong> saves you
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
            {fmt(savings)} per invoice
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            That&apos;s {fmt((mostExpensive.annualFees - cheapest.annualFees))}/year at {frequency} invoicing
          </p>
        </div>
      )}

      {/* Reverse calculator */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Want the client to cover the fee?</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-2">Invoice these amounts to receive exactly {fmt(invoiceAmount)}:</p>
        <div className="space-y-1">
          {results.filter(p => p.fee > 0).slice(0, 4).map((p) => (
            <div key={p.name} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{p.name}:</span>
              <span className="font-medium tabular-nums">{fmt((invoiceAmount + p.fixed) / (1 - p.rate / 100))}</span>
            </div>
          ))}
        </div>
      </div>

      <SEOContent>
        <h2>Payment Processor Fees Compared</h2>
        <p>Every time a client pays you online, the payment processor takes a cut. These fees vary significantly between providers and can add up to thousands of dollars per year. Understanding the fee structure helps you choose the cheapest option and price your services to account for processing costs.</p>

        <h2>How Payment Processing Fees Work</h2>
        <p>Most processors charge a percentage of the transaction plus a small fixed fee. For example, Stripe charges 2.9% + $0.30. On a $1,000 invoice, that is $29.30 -- meaning you receive $970.70. The percentage portion scales with the invoice size, while the fixed fee hurts more on smaller transactions.</p>
        <p>On a $100 invoice, Stripe takes $3.20 (3.2% effective rate). On a $5,000 invoice, it takes $145.30 (2.9% effective rate). Larger invoices are more cost-efficient because the fixed fee becomes negligible.</p>

        <h2>How to Minimize Processing Fees</h2>
        <ul>
          <li><strong>Use ACH or bank transfers</strong> for large invoices -- Stripe charges only 0.8% for ACH (max $5). A $5,000 invoice costs $5 instead of $145.</li>
          <li><strong>Send fewer, larger invoices</strong> to reduce the impact of fixed per-transaction fees.</li>
          <li><strong>Pass fees to clients</strong> by invoicing a slightly higher amount. Many freelancers add a 3% processing fee line item.</li>
          <li><strong>Use Zelle for repeat clients</strong> -- zero fees for both parties, instant transfer between US bank accounts.</li>
        </ul>
      </SEOContent>

      <FAQ items={[
        { question: "Which payment processor has the lowest fees?", answer: "Zelle has zero fees but requires both parties to have US bank accounts. Among standard processors, Wise (1.5%) and Square (2.6% + $0.10) typically have the lowest rates. Stripe (2.9% + $0.30) and PayPal (3.49% + $0.49) charge more but offer the most features." },
        { question: "Can I pass processing fees to my client?", answer: "Yes, this is common. You can either add a line item like 'Payment processing: 3%' to your invoice, or simply build the fee into your project price. To receive exactly $1,000 after Stripe fees, invoice for $1,030.99 instead." },
        { question: "Are payment processing fees tax deductible?", answer: "Yes. Payment processing fees are a deductible business expense. Track them throughout the year and deduct them on your Schedule C when filing taxes. Over a year, these fees can add up to a significant deduction." },
        { question: "Why are PayPal fees higher than Stripe?", answer: "PayPal charges higher rates (3.49% + $0.49 for domestic payments) partly because of their buyer protection program and broader payment options. Stripe focuses on developer-friendly integrations with lower base rates. For pure invoicing, Stripe is almost always cheaper." },
        { question: "Should I use different processors for different clients?", answer: "It can make sense. Use Zelle or ACH for large, recurring invoices from trusted clients (lowest fees). Use Stripe or PayPal for new clients or international payments where buyer protection matters. The savings on large invoices alone can add up to hundreds per year." },
      ]} />
    </CalculatorLayout>
  );
}
