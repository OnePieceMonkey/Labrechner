"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("labrechner-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("labrechner-cookie-consent", "all");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("labrechner-cookie-consent", "essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[60] animate-fade-in-up">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-brand-900/10 dark:shadow-black/40 border border-gray-200 dark:border-slate-800 ring-1 ring-black/5">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
            <Cookie className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="sm:hidden">
                  <Cookie className="w-4 h-4 text-brand-500" />
                </span>
                Cookies & Datenschutz
              </h4>
              <button
                onClick={handleDecline}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 -mt-1 -mr-1 p-1"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Wir nutzen Cookies, um Ihr Erlebnis zu verbessern und die Website sicher zu
              betreiben. Dazu zählen essenzielle Funktionen sowie optionale Analysen.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDecline}
                className="w-full inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 active:scale-95 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 shadow-sm px-4 py-2 text-xs sm:text-sm"
              >
                Nur Notwendige
              </button>
              <button
                onClick={handleAccept}
                className="w-full inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 active:scale-95 bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 px-4 py-2 text-xs sm:text-sm"
              >
                Alle akzeptieren
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-center sm:justify-start gap-4 text-xs text-slate-400 dark:text-slate-500">
              <Link
                href="/datenschutz"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" /> Datenschutz
              </Link>
              <Link
                href="/impressum"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
