import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Bunch of Calcs terms of service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: April 4, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing and using Bunch of Calcs, you agree to these terms. If you do not agree, please
            do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Service Description</h2>
          <p className="mt-2">
            Bunch of Calcs provides free online calculator tools for informational and educational purposes.
            Our calculators provide estimates based on the inputs you provide and general formulas. They
            are not a substitute for professional financial, tax, or legal advice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Disclaimer</h2>
          <p className="mt-2">
            Calculator results are estimates only. Tax laws, rates, and regulations change frequently.
            While we strive for accuracy, we make no guarantees that our calculations are correct,
            complete, or current. Always consult a qualified professional (accountant, tax advisor,
            financial planner) before making financial decisions based on calculator results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Limitation of Liability</h2>
          <p className="mt-2">
            Bunch of Calcs and its operators shall not be liable for any damages arising from the use of
            our calculators or reliance on their results. Use our tools at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Affiliate Disclosure</h2>
          <p className="mt-2">
            Some links on this site are affiliate links. When you click these links and make a purchase
            or sign up for a service, we may earn a commission at no additional cost to you. We only
            recommend products and services we believe are genuinely useful.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Intellectual Property</h2>
          <p className="mt-2">
            All content, design, and code on Bunch of Calcs is owned by us or our licensors. You may use
            our calculators freely but may not copy, reproduce, or redistribute the site or its
            components without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Changes to Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these terms at any time. Continued use of the site after
            changes constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
