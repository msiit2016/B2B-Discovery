"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handlePopularClick = (popularQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(popularQuery)}`);
  };

  const popularSearches = [
    { text: "TMT Bar in Kota", term: "TMT Bar Suppliers in Kota" },
    { text: "Cement in Jaipur", term: "Cement Dealers in Jaipur" },
    { text: "Steel Pipe in Delhi", term: "Steel Pipe Manufacturers in Delhi" },
    { text: "FRP Tank in Ahmedabad", term: "FRP Tank Manufacturers in Ahmedabad" },
  ];

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" />
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5" />
      <div className="absolute bottom-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/5" />

      <div className="mx-auto w-full max-w-4xl text-center">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-950/30 dark:text-indigo-400 mb-6 transition-all duration-300">
          <Sparkles className="h-4.5 w-4.5 animate-pulse-subtle" />
          <span>India's AI-Powered B2B Search Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-950 dark:text-white leading-[1.15] mb-4">
          Find Suppliers Using{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">
            AI Discovery
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
          Search products, suppliers, and locations to discover and connect with relevant businesses instantly.
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto max-w-2xl w-full flex items-center rounded-2xl bg-white dark:bg-slate-800/80 p-2 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-700/60 focus-within:ring-4 focus-within:ring-indigo-500/15 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-all duration-300 mb-6"
        >
          <div className="flex flex-1 items-center px-3 gap-2">
            <Search className="h-5.5 w-5.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, suppliers or locations..."
              className="w-full text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base bg-transparent focus:outline-none py-2 font-medium"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Popular Searches */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            Popular Searches:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePopularClick(item.term)}
                className="rounded-xl border border-slate-200/60 bg-white/50 px-3 py-1.5 font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all duration-200 active:scale-95 shadow-sm"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto mt-20 text-left">
          <div className="bg-white/40 dark:bg-slate-800/20 backdrop-blur border border-slate-200/40 dark:border-slate-700/30 p-6 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Describe Needs</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
              Type naturally. Mention the item name, specific standard specifications, and target cities.
            </p>
          </div>

          <div className="bg-white/40 dark:bg-slate-800/20 backdrop-blur border border-slate-200/40 dark:border-slate-700/30 p-6 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Synthesize Profiles</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
              Our AI discovery engine processes query keywords and retrieves details to build B2B profiles.
            </p>
          </div>

          <div className="bg-white/40 dark:bg-slate-800/20 backdrop-blur border border-slate-200/40 dark:border-slate-700/30 p-6 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Inquiries</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
              Review generated company details, verify products, and send immediate direct requirement forms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
