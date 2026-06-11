import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950/80 transition-colors duration-300 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-1.5">
            {/* Mini icon badge */}
            <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="10" fill="url(#footerGrad)" />
              <circle cx="22" cy="22" r="3" fill="white" />
              <circle cx="22" cy="10" r="2" fill="white" />
              <line x1="22" y1="12" x2="22" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="22" cy="34" r="2" fill="white" />
              <line x1="22" y1="25" x2="22" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="16" r="2" fill="white" />
              <line x1="11.7" y1="17.7" x2="20.3" y2="20.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="34" cy="16" r="2" fill="white" />
              <line x1="32.3" y1="17.7" x2="23.7" y2="20.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="28" r="2" fill="white" />
              <line x1="11.7" y1="26.3" x2="20.3" y2="23.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="34" cy="28" r="2" fill="white" />
              <line x1="32.3" y1="26.3" x2="23.7" y2="23.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="footerGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              IndiConnect<span className="text-orange-500">.AI</span>
            </span>
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
