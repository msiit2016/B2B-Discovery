import { Sparkles, Landmark, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | IndiConnect.AI",
  description: "Learn how IndiConnect.AI uses AI-powered semantic search and profile synthesis to connect B2B buyers with active industrial suppliers across India.",
};

export default function About() {
  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" />
      <div className="absolute top-1/4 left-1/3 -z-10 h-[300px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5" />

      <div className="mx-auto w-full max-w-3xl text-left">
        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white mb-4">
            About IndiConnect.AI
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            IndiConnect.AI is an AI-powered B2B supplier discovery and intelligence platform designed to connect B2B buyers with active suppliers, dealers, and manufacturers across India in real-time.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 p-8 rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Core Concept</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Rather than relying on outdated static supplier directories, IndiConnect.AI harnesses large language models to construct complete profiles on demand. By parsing search queries semantically, it categorizes products, identifies target locations, and synthesizes active B2B listings tailored to the buyer's exact procurement needs.
          </p>
        </div>

        {/* What We Do */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What We Do</h2>
        <div className="space-y-6 mb-12">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Intent-Aware Discovery</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                Procurement managers describe their needs naturally (e.g., specific materials, target cities). IndiConnect.AI extracts semantic search intent to retrieve verified supplier directories matching those parameters.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Landmark className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Real-Time Search Grounding</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                By leveraging real-time search grounding, the engine fetches live information about actual businesses operating in India, verifying company names, location details, active contact numbers, and product offerings.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Direct Buyer-Supplier Connection</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                The platform streamlines B2B outreach. Once buyers find matching suppliers, they can immediately fill and submit detailed material/service requirement inquiries directly through the built-in inquiry desk.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10 flex flex-col sm:flex-row items-center justify-end gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow"
          >
            <span>Start Searching</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
