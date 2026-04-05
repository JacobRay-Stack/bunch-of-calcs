import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
          <span className="text-teal-600 dark:text-teal-400">Bunch</span>
          <span className="text-amber-500">of</span>
          <span className="text-gray-900 dark:text-gray-100">Calcs</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
              Calculators
            </Link>
            <Link href="/blog" className="hover:text-gray-900 dark:hover:text-gray-100">
              Blog
            </Link>
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-100">
              About
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
