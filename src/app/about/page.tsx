import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bunch of Calcs builds free online calculators for freelancers and solopreneurs. Built by Jacob Ray, a freelance developer.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About Bunch of Calcs</h1>

      <div className="mt-8 space-y-4 text-gray-600 dark:text-gray-300">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex-1">
            <p>
              Hi, I&apos;m <strong className="text-gray-900 dark:text-gray-100">Jacob Ray</strong> -- a freelance developer and military veteran.
              I built Bunch of Calcs because I got tired of Googling the same financial
              questions every month as a freelancer. &quot;What should I charge?&quot; &quot;How much do I owe in
              taxes?&quot; &quot;What does PayPal actually take from my invoice?&quot;
            </p>
          </div>
        </div>
        <p>
          Every calculator I found was either buried inside a 3,000-word article,
          hidden behind a signup wall, or built in 2010 and never updated. So I
          built the tools I actually wanted to use -- clean, fast, free, and
          accurate for the current tax year.
        </p>
        <p>
          Every calculator on this site is free to use, works on any device, and
          doesn&apos;t require you to create an account. Your data stays in your
          browser -- nothing is stored on our servers. The tax calculators are
          updated for {new Date().getFullYear()} with current federal brackets, SE tax rates, and state
          income tax estimates for all 50 states.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pt-4">
          How the calculators are built
        </h2>
        <p>
          I research every formula against IRS publications and cross-check results with
          professional tax software. Tax brackets, SE rates, standard deductions, and state
          income tax data are updated each year when the IRS publishes new numbers. The
          calculators run entirely in your browser -- no data leaves your device.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pt-4">
          What makes these calculators different
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Built for freelancers specifically.</strong> Not generic
            financial calculators -- every tool is designed for the way
            self-employed people actually work.
          </li>
          <li>
            <strong>State tax included.</strong> Most free calculators only do
            federal. Ours estimate state income tax for all 50 states so you get
            the full picture.
          </li>
          <li>
            <strong>No signup, no paywall.</strong> Use any calculator as many
            times as you want without giving us your email.
          </li>
          <li>
            <strong>Updated annually.</strong> Tax brackets, SE rates, and
            standard deductions are updated when the IRS publishes new numbers.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pt-4">
          How we keep the lights on
        </h2>
        <p>
          Bunch of Calcs is free because we earn revenue through non-intrusive ads and
          affiliate partnerships with tools like FreshBooks, QuickBooks, and Bonsai. We only
          recommend products we&apos;d use ourselves, and the calculators will always be free
          regardless of whether you click an affiliate link.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pt-4">
          Have an idea for a calculator?
        </h2>
        <p>
          I&apos;m always adding new tools. If there&apos;s a calculation you do
          regularly as a freelancer and wish there was a better tool for it,{" "}
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            let me know
          </Link>
          . The best calculators on this site came from real freelancer requests.
        </p>
      </div>
    </div>
  );
}
