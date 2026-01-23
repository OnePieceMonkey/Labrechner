"use client";

import { Search, Map, RefreshCw, Bot, ArrowUpRight } from "lucide-react";

export function Features() {
  return (
    <section
      id="features"
      className="py-32 bg-white dark:bg-slate-950 relative border-t border-transparent dark:border-slate-900"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Alles, was Sie für die <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
              perfekte Abrechnung
            </span>{" "}
            brauchen.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Unsere Tools sind darauf ausgelegt, Ihren Workflow zu beschleunigen und
            Fehler zu vermeiden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {/* Feature 1: Large Search (Col Span 2) */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 md:p-10 hover:shadow-2xl hover:shadow-brand-900/5 dark:hover:shadow-black/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/50 dark:bg-brand-900/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Suche in Sekunden
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Finden Sie jede BEL-Position sofort durch intelligente Volltextsuche.
                  Egal ob Nummer oder Bezeichnung.
                </p>
              </div>

              {/* Visual Decor */}
              <div className="mt-8 relative h-32 md:h-24 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 flex items-center gap-4 opacity-90 group-hover:scale-[1.02] transition-transform duration-500 origin-bottom-left">
                <Search className="w-5 h-5 text-slate-300" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-24"></div>
                <div className="ml-auto h-8 px-4 bg-brand-500 rounded-lg text-white text-sm font-medium flex items-center">
                  Finden
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Regions (Row Span 2, Col Span 1) */}
          <div className="md:row-span-2 group relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-slate-800 border border-gray-800 dark:border-slate-700 p-8 md:p-10 text-white hover:shadow-2xl hover:shadow-brand-900/20 transition-all duration-500">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 shadow-sm flex items-center justify-center mb-6 backdrop-blur-md">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Alle 17 Regionen</h3>
              <p className="text-slate-300 mb-8">
                Vollständige Abdeckung aller KZV-Regionen in Deutschland. Preise passen
                sich automatisch Ihrem Standort an.
              </p>

              {/* Visual List */}
              <div className="mt-auto space-y-3">
                {["Bayern", "Berlin", "Hessen", "Nordrhein"].map((region, i) => (
                  <div
                    key={region}
                    className="flex items-center justify-between py-2 border-b border-white/10 text-sm text-slate-300 group-hover:pl-2 transition-all duration-300"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <span>KZV {region}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </div>
                ))}
                <div className="pt-2 text-xs text-slate-500 font-mono">+ 13 weitere</div>
              </div>
            </div>
          </div>

          {/* Feature 3: Always Current (Col Span 1) */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 hover:shadow-xl hover:shadow-brand-900/5 dark:hover:shadow-black/20 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 shadow-sm flex items-center justify-center mb-6">
              <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Immer aktuell
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              BEL-II 2026 integriert. Wir aktualisieren Preise automatisch zum Stichtag.
            </p>
          </div>

          {/* Feature 4: AI Assistant (Col Span 1) */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-500/20 p-8 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-500/20 shadow-sm flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              KI-Assistent
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unsicher bei der Abrechnung? Unser Assistent schlägt passende Positionen
              vor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
