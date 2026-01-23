import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { HERO_COPY } from '../constants';
import { InvoiceAnimation } from './InvoiceAnimation';

interface HeroProps {
  onStartApp: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 dark:bg-brand-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Badge / Announcement */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium animate-fade-in-up dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-300">
            <span className="flex items-center">
              Neu: BEL II 2026 integriert
              <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
            <span className="block">BEL-Preise</span>
            <span className="block bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
              in Sekunden finden
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {HERO_COPY.subline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button onClick={onStartApp} size="lg" className="w-full sm:w-auto group">
              {HERO_COPY.primaryCta}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="#features" variant="secondary" size="lg" className="w-full sm:w-auto">
              {HERO_COPY.secondaryCta}
            </Button>
          </div>

          {/* Dynamic Invoice Builder Animation */}
          <div className="relative mx-auto max-w-4xl perspective-[2000px]">
             {/* Glow effect behind the card */}
             <div className="absolute inset-0 bg-brand-500/10 blur-[60px] rounded-full transform scale-90 translate-y-10 -z-10 dark:bg-brand-500/20"></div>
             
             <InvoiceAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};
