"use client";

import React, { useState } from "react";
import { X, Send, ShieldCheck } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";
import { toast } from "@/components/ui/Toast";

interface Supplier {
  id: string;
  name: string;
  location: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export default function InquiryModal({ isOpen, onClose, supplier }: InquiryModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [productRequirement, setProductRequirement] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !supplier) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(mobile.trim())) {
      newErrors.mobile = "Invalid mobile number";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!productRequirement.trim()) newErrors.productRequirement = "Product requirement is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await submitInquiry({
        supplierId: supplier.id,
        supplierName: supplier.name,
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        productRequirement: productRequirement.trim(),
        message: message.trim(),
      });

      if (response.success) {
        toast.success("Your inquiry has been submitted successfully.");
        // Reset form
        setName("");
        setMobile("");
        setEmail("");
        setProductRequirement("");
        setMessage("");
        setErrors({});
        onClose();
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Inquiry submission error:", err);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Inquiry</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              to <span className="font-semibold text-indigo-600 dark:text-indigo-400">{supplier.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.name ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20" : "border-slate-200 dark:border-slate-700"
              }`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.mobile ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20" : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="e.g. +91 9876543210"
              />
              {errors.mobile && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.email ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20" : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="e.g. john@example.com"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Product Requirement *
            </label>
            <input
              type="text"
              value={productRequirement}
              onChange={(e) => setProductRequirement(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                errors.productRequirement ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20" : "border-slate-200 dark:border-slate-700"
              }`}
              placeholder="e.g. Need 50 Metric Tons of Fe-550 TMT Bars"
            />
            {errors.productRequirement && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.productRequirement}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Provide more context about your query..."
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-6">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Safe & Secure B2B Connection</span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors border border-transparent dark:border-slate-700/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
