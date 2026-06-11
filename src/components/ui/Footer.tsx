import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950/80 transition-colors duration-300 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="IndiConnect.AI"
              width={110}
              height={30}
              className="h-7 w-auto object-contain"
            />
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} IndiConnect.AI. All rights reserved.
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
