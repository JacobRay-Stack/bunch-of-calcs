import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bunch of Calcs builds free online calculators for freelancers and solopreneurs.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About Bunch of Calcs</h1>
      <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          Bunch of Calcs is a collection of free online calculators built
          specifically for freelancers, consultants, and solopreneurs.
        </p>
        <p>
          We know that running a freelance business means wearing a lot of hats.
          Pricing your work, estimating taxes, tracking profit margins -- these
          are things you deal with every week but shouldn&apos;t have to stress about.
        </p>
        <p>
          Every calculator on this site is free to use, works on any device, and
          doesn&apos;t require you to create an account. Your data stays in your
          browser -- we don&apos;t store anything.
        </p>
        <p>
          Have an idea for a calculator we should build? Reach out and let us
          know.
        </p>
      </div>
    </div>
  );
}
