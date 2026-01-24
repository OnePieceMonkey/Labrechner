import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { TRUST_BADGES } from "./constants";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
            <p className="mb-2">
              © {CURRENT_YEAR} Labrechner. Entwickelt für deutsche
              Dentallabore.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                {badge}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800 pt-8">
          <Link
            href="/impressum"
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Datenschutz
          </Link>
          <Link
            href="/agb"
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            AGB
          </Link>
        </div>
      </div>
    </footer>
  );
}
