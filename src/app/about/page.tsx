import { Sparkles, Code2, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | AI Supplier Discovery",
  description: "Learn how AI Supplier Discovery uses AI-powered semantic search and profile synthesis to connect B2B buyers with active industrial suppliers.",
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
            About AI Supplier Discovery
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            AI Supplier Discovery is a prototype B2B search application that demonstrates how generative artificial intelligence can synthesize structured business information in real-time.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 p-8 rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Core Concept</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Rather than relying on outdated static supplier directories, AI Supplier Discovery harnesses large language models to construct complete profiles on demand. By parsing search queries semantically, it categorizes products, identifies target locations, and synthesizes 5 active mock/verified entities tailored to standard B2B marketplace schema rules.
          </p>
        </div>

        {/* How it works */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Technical Architecture</h2>
        <div className="space-y-6 mb-12">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Next.js Server Actions</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                Queries are processed securely on the server side using Next.js Server Actions, keeping API keys private and eliminating the need for client-side API proxies.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">OpenAI GPT Integration</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                The engine queries GPT using structured response parameters, forcing the model to output strict JSON conforming directly to the B2B catalog schema.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">In-Memory Inquiry Desk</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                Buyer requirements are submitted using direct modals and stored temporarily in the server's running process memory, outputting detailed B2B log reports to the console.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Code2 className="h-4.5 w-4.5 text-indigo-500" />
            <span>Built with Next.js 15, React, and Tailwind CSS</span>
          </div>
          
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
