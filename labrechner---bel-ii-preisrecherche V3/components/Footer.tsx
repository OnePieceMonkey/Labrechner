import React from 'react';
import { TRUST_BADGES } from '../constants';
import { Badge } from './ui/Badge';

interface FooterProps {
  onNavigate: (page: 'impressum' | 'datenschutz' | 'agb') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-12 border-t border-gray-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
              <p className="mb-2">© {new Date().getFullYear()} Labrechner. Entwickelt für deutsche Dentallabore.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {TRUST_BADGES.map((badge) => (
                <Badge key={badge} label={badge} />
              ))}
            </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800 pt-8">
           <button onClick={() => onNavigate('impressum')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Impressum</button>
           <button onClick={() => onNavigate('datenschutz')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Datenschutz</button>
           <button onClick={() => onNavigate('agb')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AGB</button>
        </div>
      </div>
    </footer>
  );
};