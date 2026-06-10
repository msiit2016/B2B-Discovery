import Link from "next/link";
import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950/80 transition-colors duration-300 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              AI Supplier Discovery
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} AI Supplier Discovery. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              About
            </Link>
            <span>&middot;</span>
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              Search
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
