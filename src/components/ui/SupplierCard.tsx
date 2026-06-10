"use client";

import { MapPin, Phone, Globe, Send, Award } from "lucide-react";
import { Supplier } from "@/app/actions/search";

interface SupplierCardProps {
  supplier: Supplier;
  onInquiry: (supplier: Supplier) => void;
}

export default function SupplierCard({ supplier, onInquiry }: SupplierCardProps) {
  // Infer business type based on supplier name or description keywords
  const getBusinessType = (name: string, desc: string) => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("manufactur") || text.includes("factory") || text.includes("producer")) {
      return { label: "Manufacturer", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30" };
    }
    if (text.includes("dealer") || text.includes("distribut") || text.includes("partner")) {
      return { label: "Authorized Dealer", color: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30" };
    }
    if (text.includes("trader") || text.includes("trading") || text.includes("wholesal")) {
      return { label: "Wholesaler & Trader", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30" };
    }
    return { label: "Verified Supplier", color: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50" };
  };

  const bizType = getBusinessType(supplier.name, supplier.description);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800/80">
      
      {/* Top Banner Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500" />
      
      <div>
        {/* Badges & Actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bizType.color}`}>
            <Award className="h-3.5 w-3.5 shrink-0" />
            {bizType.label}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active
          </span>
        </div>

        {/* Company Name */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {supplier.name}
        </h3>

        {/* Location Row */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{supplier.location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
          {supplier.description}
        </p>

        {/* Products List */}
        {supplier.products && supplier.products.length > 0 && (
          <div className="mt-5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Deals In
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {supplier.products.map((product, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100/70 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border border-slate-200/20"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons & Contact Row */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-700/50 pt-4 flex flex-col gap-3">
        {/* Contact info snippets (optional styling) */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-0.5">
          <div className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{supplier.phone}</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Call Now */}
          <a
            href={`tel:${supplier.phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-700/40 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200/10 active:scale-95"
            title="Call Supplier"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Call</span>
          </a>

          {/* Visit Website */}
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-700/40 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200/10 active:scale-95"
            title="Visit Website"
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Website</span>
          </a>

          {/* Send Inquiry */}
          <button
            onClick={() => onInquiry(supplier)}
            className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Send className="h-3.5 w-3.5 shrink-0" />
            <span>Inquiry</span>
          </button>
        </div>
      </div>

    </div>
  );
}
