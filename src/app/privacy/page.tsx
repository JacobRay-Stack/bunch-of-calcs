import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Bunch of Calcs privacy policy. How we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: April 4, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
          <p className="mt-2">
            Bunch of Calcs provides free online calculator tools. We are committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your rights.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Data We Collect</h2>
          <p className="mt-2">
            <strong>Calculator inputs:</strong> All calculations happen in your browser. We do not collect,
            store, or transmit any values you enter into our calculators. Your financial data never leaves
            your device.
          </p>
          <p className="mt-2">
            <strong>Analytics:</strong> We may use privacy-friendly analytics to understand how visitors
            use our site (pages visited, time on site, device type). This data is aggregated and cannot
            identify individual users.
          </p>
          <p className="mt-2">
            <strong>Cookies:</strong> We use essential cookies to remember your preferences (such as
            dark mode). If we display ads, our ad partners may use cookies to serve relevant
            advertisements. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Third-Party Services</h2>
          <p className="mt-2">
            We may use third-party services including advertising networks and analytics providers. These
            services have their own privacy policies. We may display links to third-party products and
            services. Some of these are affiliate links, meaning we earn a commission if you sign up at
            no extra cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Rights</h2>
          <p className="mt-2">
            Since we do not collect personal data from calculator usage, there is no personal data to
            request, modify, or delete. If you have questions about your data, contact us using the
            information on our contact page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Changes to This Policy</h2>
          <p className="mt-2">
            We may update this privacy policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
}
