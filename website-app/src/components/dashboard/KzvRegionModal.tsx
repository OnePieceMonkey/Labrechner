'use client';

import React, { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KzvRegionModalProps {
  isOpen: boolean;
  onComplete: (regionName: string) => void;
  regions: string[];
}

export const KzvRegionModal: React.FC<KzvRegionModalProps> = ({
  isOpen,
  onComplete,
  regions,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedRegion) {
      onComplete(selectedRegion);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header mit Gradient */}
          <div className="bg-gradient-to-r from-brand-600 to-purple-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Fast geschafft!
            </h2>
            <p className="text-white/80 text-sm">
              Noch ein letzter Schritt zur optimalen Nutzung
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Ihre KZV-Region
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Die BEL-Preise variieren je nach Region. Bitte wählen Sie Ihre
                Kassenzahnärztliche Vereinigung, damit wir Ihnen die korrekten
                Preise anzeigen können.
              </p>
            </div>

            {/* Custom Dropdown */}
            <div className="relative mb-6">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedRegion
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-brand-300'
                } bg-white dark:bg-slate-800`}
              >
                <span className={`${selectedRegion ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}`}>
                  {selectedRegion || 'Region auswählen...'}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {regions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors ${
                        selectedRegion === region ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                      }`}
                    >
                      <span className="text-slate-900 dark:text-white">{region}</span>
                      {selectedRegion === region && (
                        <Check className="w-5 h-5 text-brand-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Hinweis:</strong> Sie können die Region jederzeit in den
                Einstellungen ändern.
              </p>
            </div>

            {/* Button */}
            <Button
              onClick={handleConfirm}
              disabled={!selectedRegion}
              className={`w-full py-4 text-lg font-semibold transition-all ${
                selectedRegion
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg shadow-brand-500/30'
                  : 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed'
              }`}
            >
              {selectedRegion ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Region bestätigen
                </>
              ) : (
                'Bitte Region auswählen'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
