"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-500">
            <Cpu className="h-5 w-5 animate-pulse-subtle" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            AI <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">Supplier Discovery</span>
          </span>
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
