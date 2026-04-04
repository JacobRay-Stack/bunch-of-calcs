import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Bunch<span className="text-blue-600 dark:text-blue-400">ofCalcs</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Free calculators for freelancers and solopreneurs.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Calculators</Link>
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200">About</Link>
            <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-200">Contact</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200">Terms</Link>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Bunch of Calcs. Calculator results are estimates only -- not
            financial advice. Consult a professional before making financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
