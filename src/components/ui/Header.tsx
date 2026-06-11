"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
          <Image
            src="/logo.png"
            alt="IndiConnect.AI logo"
            width={140}
            height={40}
            className="h-9 w-auto object-contain transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02]"
            priority
          />
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
