import { Shield } from "lucide-react";

export default function SkeletonSupplierCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/40 animate-pulse-subtle">
      <div>
        {/* Badges placeholder */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Title placeholder */}
        <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mt-2" />
        
        {/* Location placeholder */}
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700 mt-2" />

        {/* Description placeholder */}
        <div className="space-y-2 mt-4">
          <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3.5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Products placeholder */}
        <div className="mt-5">
          <div className="h-2 w-10 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Footer buttons placeholder */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-700/50 pt-4 space-y-3">
        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
