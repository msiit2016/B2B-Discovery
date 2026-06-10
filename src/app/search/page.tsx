import { Metadata } from "next";
import SearchClient from "./SearchClient";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  
  if (!query) {
    return {
      title: "Search Suppliers | AI Supplier Discovery",
    };
  }

  // Capitalize query words for clean SEO title
  const formattedQuery = query
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedQuery} | AI Supplier Discovery`,
    description: `Discover top ${formattedQuery} suppliers, manufacturers, and dealers. Get contact details, product tags, and submit inquiries instantly.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col flex-1">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
      </div>
    }>
      <SearchClient initialQuery={query} />
    </Suspense>
  );
}
