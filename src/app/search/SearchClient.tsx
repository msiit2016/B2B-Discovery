"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowLeft, RefreshCw, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { searchSuppliers, SearchResult, Supplier } from "@/app/actions/search";
import SupplierCard from "@/components/ui/SupplierCard";
import SkeletonSupplierCard from "@/components/ui/SkeletonSupplierCard";
import InquiryModal from "@/components/ui/InquiryModal";
import Link from "next/link";

interface SearchClientProps {
  initialQuery: string;
}

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const router = useRouter();

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Inquiry Modal State
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Update browser URL query param without refreshing the page
    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(currentSearch);
    if (params.get("q") !== searchQuery) {
      params.set("q", searchQuery);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }

    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    setResult(null);
    setActiveQuery(searchQuery);
    setCurrentPage(1); // Reset page on new search

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("Failed to initialize supplier discovery stream");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming is not supported by your browser");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 1);

          if (line) {
            try {
              const packet = JSON.parse(line);
              if (packet.type === "metadata") {
                setResult({
                  category: packet.data.category,
                  location: packet.data.location,
                  suppliers: []
                });
                setIsLoading(false); // Stop showing skeletons as soon as metadata arrives
              } else if (packet.type === "supplier") {
                const supplier = packet.data;
                setResult(prev => {
                  if (!prev) {
                    return {
                      category: "",
                      location: "",
                      suppliers: [supplier]
                    };
                  }
                  // Prevent duplicate keys
                  if (prev.suppliers.some(s => s.id === supplier.id)) {
                    return prev;
                  }
                  return {
                    ...prev,
                    suppliers: [...prev.suppliers, supplier]
                  };
                });
              } else if (packet.type === "done") {
                break;
              }
            } catch (e) {
              // Ignore partial/invalid lines
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to fetch supplier information. Please try again.";
      setError(msg);
      setIsLoading(false);
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, [router]);

  // Trigger search on mount if initialQuery is set (defer to avoid synchronous setState warning)
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => {
        performSearch(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(queryInput);
  };

  const handleInquiryOpen = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Pagination math
  const totalItems = result?.suppliers.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSuppliers = result?.suppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col flex-1">
      {/* Back to Home & Search Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Discovery Results</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-generated supplier directory
            </p>
          </div>
        </div>

        {/* Top Search input for quick filtering */}
        <form onSubmit={handleSearchSubmit} className="flex max-w-md w-full gap-2">
          <div className="relative flex-1 flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <Search className="h-4.5 w-4.5 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search products, suppliers or locations..."
              className="w-full bg-transparent text-sm text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none py-2.5 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="flex flex-col flex-1">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 flex-1">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonSupplierCard key={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex flex-col flex-1 items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Search Failed</h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => performSearch(activeQuery)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Search results display */}
      {!isLoading && !error && result && (
        <div className="flex flex-col flex-1">
          {/* Header result count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Found Results for{" "}
                <span className="font-bold text-slate-900 dark:text-white">&ldquo;{activeQuery}&rdquo;</span>
              </p>
              {result.category && result.location && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-lg border border-indigo-200/20">
                    Category: {result.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-200/20">
                    <MapPin className="h-3 w-3" />
                    Location Focus: {result.location}
                  </span>
                </div>
              )}
            </div>
            
            {/* Stream and Disclaimer badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {isStreaming && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/20 px-2.5 py-1 rounded-lg animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Discovering Suppliers ({result.suppliers.length}/30)
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/20 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="h-3.5 w-3.5" />
                AI Synthesized Directory
              </span>
            </div>
          </div>

          {/* Supplier Grid */}
          {paginatedSuppliers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onInquiry={handleInquiryOpen}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 border-t border-slate-200/60 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> suppliers
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNumber = i + 1;
                      const isCurrent = pageNumber === currentPage;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-95 ${
                            isCurrent
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "border border-slate-200/60 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : isStreaming ? (
            // Show streaming skeletons while list is empty but stream is active
            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 flex-1 animate-pulse">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonSupplierCard key={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center py-16 text-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Suppliers Found</h2>
              <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mt-2">
                We couldn&apos;t find any B2B supplier matches. Try adjusting your query keywords (e.g. products, city, state).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={selectedSupplier}
      />
    </div>
  );
}
