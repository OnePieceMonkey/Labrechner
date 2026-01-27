import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BadgeProps {
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300 select-none">
      <ShieldCheck className="w-4 h-4 mr-2 text-brand-500 dark:text-brand-400" />
      {label}
    </div>
  );
};