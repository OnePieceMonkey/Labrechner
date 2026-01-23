import React from 'react';

const REGIONS = [
  "KZV Bayern", "KZV Berlin", "KZV Brandenburg", "KZV Bremen", "KZV Hamburg", 
  "KZV Hessen", "KZV Mecklenburg-Vorpommern", "KZV Niedersachsen", 
  "KZV Nordrhein", "KZV Rheinland-Pfalz", "KZV Saarland", "KZV Sachsen", 
  "KZV Sachsen-Anhalt", "KZV Schleswig-Holstein", "KZV Thüringen", 
  "KZV Westfalen-Lippe", "KZV Baden-Württemberg"
];

export const RegionTicker: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800 py-6 overflow-hidden relative">
      {/* Gradient Masks for Fade Effect */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>

      <div className="flex items-center gap-12 animate-scroll w-[200%]">
        {/* Render list twice to create infinite loop effect */}
        {[...REGIONS, ...REGIONS].map((region, index) => (
          <span 
            key={`${region}-${index}`} 
            className="text-lg font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap select-none"
          >
            {region}
          </span>
        ))}
      </div>
    </div>
  );
};