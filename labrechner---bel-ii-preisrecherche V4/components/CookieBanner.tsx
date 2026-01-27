import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('labrechner-cookie-consent');
    if (!consent) {
      // Small delay for better UX (don't overwhelm immediately)
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('labrechner-cookie-consent', 'all');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('labrechner-cookie-consent', 'essential');
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
                <span className="sm:hidden"><Cookie className="w-4 h-4 text-brand-500" /></span>
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
              Wir nutzen Cookies, um Ihr Erlebnis zu verbessern und die Website sicher zu betreiben. 
              Dazu zählen essenzielle Funktionen sowie optionale Analysen.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
               <Button onClick={handleDecline} variant="secondary" size="sm" className="w-full text-xs sm:text-sm font-medium">
                 Nur Notwendige
               </Button>
               <Button onClick={handleAccept} size="sm" className="w-full text-xs sm:text-sm font-medium">
                 Alle akzeptieren
               </Button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-center sm:justify-start gap-4 text-xs text-slate-400 dark:text-slate-500">
               <a href="#datenschutz" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
                 <ShieldCheck className="w-3 h-3" /> Datenschutz
               </a>
               <a href="#impressum" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                 Impressum
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};