"use client";

import { WAITLIST_COPY } from "./constants";
import { WaitlistForm } from "@/components/layout/WaitlistForm";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="py-24 relative overflow-hidden dark:bg-slate-950"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white to-brand-50/50 dark:from-slate-950 dark:to-slate-900/50 -z-10" />
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-brand-900/5 dark:shadow-black/30 border border-white dark:border-slate-800 transition-colors">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {WAITLIST_COPY.headline}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {WAITLIST_COPY.subline}
            </p>
          </div>
          <WaitlistForm />
          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {WAITLIST_COPY.hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
