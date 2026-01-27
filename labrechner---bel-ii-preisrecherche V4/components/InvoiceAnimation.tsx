import React, { useEffect, useState } from 'react';
import { Sparkles, Mic, FileText, Bot, User, Euro } from 'lucide-react';

type ItemType = 'manual' | 'ai' | 'voice';

interface InvoiceItem {
  id: number;
  code: string;
  name: string;
  price: number;
  type: ItemType;
}

const INVOICE_ITEMS: InvoiceItem[] = [
  { id: 1, code: '0010', name: 'Modell', price: 14.50, type: 'manual' },
  { id: 2, code: '0120', name: 'Mittelwertartikulator', price: 22.10, type: 'ai' },
  { id: 3, code: '0212', name: 'Guss der Basis', price: 45.80, type: 'manual' },
  { id: 4, code: '3800', name: 'Verblendung Keramik', price: 120.00, type: 'voice' },
  { id: 5, code: '9330', name: 'Versandkosten', price: 6.90, type: 'ai' },
];

export const InvoiceAnimation: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    // Reset and start animation sequence
    const startAnimation = () => {
      setVisibleItems([]);
      setTotalSum(0);
      
      let currentSum = 0;

      INVOICE_ITEMS.forEach((item, index) => {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => [...prev, item.id]);
          currentSum += item.price;
          setTotalSum(currentSum);
        }, (index + 1) * 800); // Stagger by 800ms
        timeouts.push(timeout);
      });
    };

    startAnimation();

    // Loop animation every 8 seconds (approx 5 items * 0.8s + pause)
    const loopInterval = setInterval(startAnimation, 8000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      {/* App Interface Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-brand-900/10 border border-gray-200 dark:border-slate-800 overflow-hidden relative transition-colors duration-300">
        
        {/* Header Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Rechnung #2024-001</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Patient: Max Mustermann</div>
                </div>
            </div>
            <div className="text-xs font-medium px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded border border-green-100 dark:border-green-500/20">
                Entwurf
            </div>
        </div>

        {/* Invoice Body / List */}
        <div className="p-6 min-h-[380px] bg-white dark:bg-slate-900 flex flex-col gap-3 transition-colors">
          {/* Table Header */}
          <div className="flex text-xs font-medium text-slate-400 dark:text-slate-500 pb-2 border-b border-gray-50 dark:border-slate-800 px-3">
            <div className="w-16">BEL-Nr.</div>
            <div className="flex-1">Leistung</div>
            <div className="w-20 text-right">Preis</div>
            <div className="w-8"></div>
          </div>

          {/* Dynamic Items */}
          {visibleItems.map((id, index) => {
            const item = INVOICE_ITEMS.find(i => i.id === id)!;
            const isLeft = index % 2 === 0; // Alternate sides
            
            // Define styles based on source type
            let containerClass = "flex items-center p-3 rounded-lg border text-sm transition-all ";
            let icon = null;

            if (item.type === 'ai') {
                containerClass += "bg-purple-50/50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-slate-800 dark:text-purple-100 shadow-sm shadow-purple-100/50 dark:shadow-none";
                icon = <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />;
            } else if (item.type === 'voice') {
                containerClass += "bg-blue-50/50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-slate-800 dark:text-blue-100 shadow-sm shadow-blue-100/50 dark:shadow-none";
                icon = <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
            } else {
                containerClass += "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                icon = <User className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />;
            }

            // Animation class
            const animClass = isLeft ? 'animate-slide-in-left' : 'animate-slide-in-right';

            return (
              <div 
                key={item.id} 
                className={`${containerClass} ${animClass}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="w-16 font-mono text-xs text-slate-500 dark:text-slate-500">{item.code}</div>
                <div className="flex-1 font-medium flex items-center gap-2">
                    {item.name}
                    {item.type === 'ai' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold tracking-wide uppercase">AI</span>}
                    {item.type === 'voice' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold tracking-wide uppercase">Voice</span>}
                </div>
                <div className="w-20 text-right font-mono text-slate-600 dark:text-slate-400">{item.price.toFixed(2)} €</div>
                <div className="w-8 flex justify-end">
                    {icon}
                </div>
              </div>
            );
          })}

            {/* Total Sum Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">Gesamtsumme (Netto)</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1 transition-all duration-300">
                    <span className="text-lg text-slate-400 dark:text-slate-600 font-normal">€</span>
                    {totalSum.toFixed(2)}
                </div>
            </div>
        </div>

        {/* Decorative AI input bar at bottom */}
        <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="h-2 w-32 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-2 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* Floating Labels / Legend (Optional decoration) */}
      <div className="absolute -right-4 top-20 bg-white/80 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-purple-100 dark:border-purple-500/30 text-xs text-purple-700 dark:text-purple-300 font-medium rotate-6 hidden md:block animate-fade-in transition-colors" style={{ animationDelay: '1.2s' }}>
         ✨ KI-Vorschlag
      </div>
      <div className="absolute -left-4 top-40 bg-white/80 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 dark:border-blue-500/30 text-xs text-blue-700 dark:text-blue-300 font-medium -rotate-3 hidden md:block animate-fade-in transition-colors" style={{ animationDelay: '2.5s' }}>
         🎙️ Sprachnotiz
      </div>

    </div>
  );
};