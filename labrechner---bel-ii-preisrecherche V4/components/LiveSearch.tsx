import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Sparkles } from 'lucide-react';

const DEMO_DATA = [
  { code: '0010', name: 'Modell', price: '14,50 €' },
  { code: '0052', name: 'Einartikulieren', price: '9,80 €' },
  { code: '0120', name: 'Mittelwertartikulator', price: '22,10 €' },
  { code: '1022', name: 'Vollgusskrone', price: '120,00 €' },
  { code: '3800', name: 'Verblendung Keramik', price: '145,00 €' },
  { code: '9330', name: 'Versandkosten', price: '6,90 €' },
  { code: '9800', name: 'Provisorium', price: '45,00 €' },
];

export const LiveSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof DEMO_DATA>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = DEMO_DATA.filter(
      item => 
        item.code.includes(lowerQuery) || 
        item.name.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-900 transition-colors">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        
        <div className="mb-10">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-700 dark:text-purple-300">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">Live Demo</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Probieren Sie es selbst
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Erleben Sie die Geschwindigkeit. Tippen Sie z.B. <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">Krone</span> oder <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">0010</span>.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto">
          {/* Search Bar */}
          <div className={`relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-brand-900/5 dark:shadow-black/20 border-2 transition-all duration-300 ${isFocused ? 'border-brand-500 ring-4 ring-brand-500/10 scale-105' : 'border-transparent'}`}>
            <Search className={`w-6 h-6 ml-4 ${isFocused ? 'text-brand-500' : 'text-slate-400'} transition-colors`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="BEL-Position suchen..."
              className="w-full px-4 py-4 bg-transparent text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
                <button 
                    onClick={() => setQuery('')}
                    className="mr-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                >
                    <span className="sr-only">Löschen</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
          </div>

          {/* Results Dropdown */}
          <div className={`absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-brand-900/10 dark:shadow-black/40 border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-top ${query ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
            {results.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {results.map((item) => (
                  <div key={item.code} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group text-left">
                    <div>
                      <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{item.code}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">{item.price}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    Keine Treffer für "{query}"
                </div>
            )}
          </div>
          
          {/* Default State Hints (visible when no query) */}
           {!query && (
            <div className="absolute top-full left-0 w-full mt-6 flex justify-center gap-2 text-sm text-slate-400 animate-fade-in">
                <span>Beliebt:</span>
                <button onClick={() => setQuery('Modell')} className="hover:text-brand-500 underline decoration-dashed">Modell</button>
                <button onClick={() => setQuery('Keramik')} className="hover:text-brand-500 underline decoration-dashed">Keramik</button>
                <button onClick={() => setQuery('0120')} className="hover:text-brand-500 underline decoration-dashed">0120</button>
            </div>
           )}

        </div>
      </div>
    </section>
  );
};
