"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastDetail {
  message: string;
  type: ToastType;
  duration?: number;
}

export const toast = {
  success: (message: string, duration?: number) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message, type: "success", duration },
        })
      );
    }
  },
  error: (message: string, duration?: number) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message, type: "error", duration },
        })
      );
    }
  },
  info: (message: string, duration?: number) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message, type: "info", duration },
        })
      );
    }
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      const customEvent = event as CustomEvent<ToastDetail>;
      const { message, type, duration = 4000 } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener("app-toast", handleToastEvent);
    return () => {
      window.removeEventListener("app-toast", handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        let bgColor = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";
        let Icon = Info;
        let iconColor = "text-indigo-500";

        if (t.type === "success") {
          bgColor = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200";
          Icon = CheckCircle2;
          iconColor = "text-emerald-500";
        } else if (t.type === "error") {
          bgColor = "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200";
          Icon = AlertCircle;
          iconColor = "text-rose-500";
        }

        return (
          <div
            key={t.id}
            className={`flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 animate-slide-in ${bgColor}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
              <p className="text-sm font-semibold leading-tight">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
