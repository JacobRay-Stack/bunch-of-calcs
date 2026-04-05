import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Bunch of Calcs team. Report bugs, suggest calculators, or ask a question.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Us</h1>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Have a question, found a bug, or have an idea for a calculator we should build?
        Fill out the form below or email us directly at{" "}
        <a
          href="mailto:hello@bunchofcalcs.com"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          hello@bunchofcalcs.com
        </a>
        . We typically respond within 24-48 hours.
      </p>

      <ContactForm />

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calculator Suggestions</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Want us to build a specific calculator? The more detail you provide about the inputs,
            outputs, and who it&apos;s for, the faster we can build it.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bug Reports</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            If a calculator is producing incorrect results, please include: which calculator,
            what values you entered, what result you got, and what you expected.
          </p>
        </div>
      </div>
    </div>
  );
}
