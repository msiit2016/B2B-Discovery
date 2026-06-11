"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IndiConnectLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IndiConnect.AI"
    >
      {/* Icon badge */}
      <rect x="0" y="0" width="44" height="44" rx="10" fill="url(#logoGrad)" />

      {/* Network node icon — center hub */}
      <circle cx="22" cy="22" r="3" fill="white" />

      {/* 6 outer nodes and connecting lines */}
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

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Wordmark: "IndiConnect" */}
      <text
        x="54"
        y="30"
        fontFamily="'Geist', 'Inter', system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#1E1B4B"
        letterSpacing="-0.3"
      >
        IndiConnect
      </text>

      {/* ".AI" in orange */}
      <text
        x="175"
        y="30"
        fontFamily="'Geist', 'Inter', system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#F97316"
        letterSpacing="-0.3"
      >
        .AI
      </text>
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ height: "72px" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="IndiConnect.AI Home">
          <IndiConnectLogo className="h-10 w-auto transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02]" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isActive("/")
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isActive("/about")
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
