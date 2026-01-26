'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Check, Mic, Layout, X, Loader2 } from 'lucide-react';
import type { BELPosition, CustomPosition } from '@/types/erp';

interface SearchViewProps {
  positions: (BELPosition | CustomPosition)[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  selectedForTemplate: string[];
  onToggleSelection: (id: string) => void;
  onClearSelection: () => void;
  onCreateTemplate: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  globalPriceFactor: number;
  labType: 'gewerbe' | 'praxis';
  isFavoritesView?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  is2026Data?: boolean;
}

export const SearchView: React.FC<SearchViewProps> = ({
  positions,
  favorites,
  onToggleFavorite,
  selectedForTemplate,
  onToggleSelection,
  onClearSelection,
  onCreateTemplate,
  searchQuery,
  onSearchChange,
  globalPriceFactor,
  labType,
  isFavoritesView = false,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  is2026Data = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Intersection Observer für Infinite Scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      console.error('Spracherkennung wird von diesem Browser nicht unterstuetzt.');
      alert('Spracherkennung wird von Ihrem Browser nicht unterstuetzt.');
      return;
    }

    const recognition: any = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onSearchChange(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Spracherkennungsfehler:', event.error);
      if (event.error === 'not-allowed') {
        alert('Mikrofonzugriff verweigert. Bitte Berechtigung erteilen.');
      } else if (event.error === 'no-speech') {
        alert('Keine Sprache erkannt. Bitte erneut versuchen.');
      } else {
        alert('Spracherkennung fehlgeschlagen.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Fehler beim Starten der Erkennung:', e);
      setIsListening(false);
      recognitionRef.current = null;
      alert('Spracherkennung konnte nicht gestartet werden.');
    }
  };

  const extractNumericKey = (code?: string) => {
    if (!code) return Number.NaN;
    const digits = code.match(/\d+/g)?.join('') ?? '';
    return digits ? parseInt(digits, 10) : Number.NaN;
  };

  const compareCodes = (a?: string, b?: string) => {
    const aNum = extractNumericKey(a);
    const bNum = extractNumericKey(b);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
      return aNum - bNum;
    }
    if (!Number.isNaN(aNum) && Number.isNaN(bNum)) return -1;
    if (Number.isNaN(aNum) && !Number.isNaN(bNum)) return 1;
    return (a || '').localeCompare(b || '', undefined, { numeric: true });
  };

  // Sort logic: Sort by numeric code (BEL) or id (Custom)
  const sortedPositions = [...positions].sort((a, b) => {
    const codeA = 'position_code' in a ? a.position_code : a.id;
    const codeB = 'position_code' in b ? b.position_code : b.id;
    return compareCodes(codeA, codeB);
  });

  const groupedPositions = (() => {
    const items: { type: 'group' | 'position'; label?: string; pos?: BELPosition | CustomPosition }[] = [];
    let currentGroup: string | null = null;
    sortedPositions.forEach((pos) => {
      const label = 'group' in pos ? pos.group : 'Eigenposition';
      const safeLabel = label && label !== 'all' ? label : 'Weitere Positionen';
      if (safeLabel !== currentGroup) {
        items.push({ type: 'group', label: safeLabel });
        currentGroup = safeLabel;
      }
      items.push({ type: 'position', pos });
    });
    return items;
  })();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isFavoritesView ? 'Meine Favoriten' : 'BEL-Suche'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isFavoritesView
            ? 'Ihre gespeicherten Positionen für schnellen Zugriff.'
            : 'Finden Sie BEL-Positionen nach Nummer oder Bezeichnung.'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Position suchen (z.B. 'Vollkrone' oder '1022')..."
          className="w-full pl-14 pr-14 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
        />
        <button
          onClick={handleVoiceInput}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
          }`}
          title="Diktieren"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Position List */}
      <div className="space-y-4 pb-20">
        {sortedPositions.length === 0 && !isLoading ? (
          <div className="text-center py-12 text-slate-400">
            {isFavoritesView
              ? 'Keine Favoriten gefunden. Markieren Sie Positionen mit dem Stern.'
              : 'Keine Positionen gefunden.'}
          </div>
        ) : (
          groupedPositions.map((item, idx) => {
            if (item.type === 'group') {
              return (
                <div key={`group-${item.label}-${idx}`} className="pt-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
                    <span className="whitespace-nowrap">{item.label}</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              );
            }
            const pos = item.pos as BELPosition | CustomPosition;
            return (
              <div 
                key={pos.id} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                <PositionCard
                  position={pos}
                  isFavorite={favorites.includes(pos.id)}
                  isSelected={selectedForTemplate.includes(pos.id)}
                  onToggleFavorite={() => onToggleFavorite(pos.id)}
                  onToggleSelection={() => onToggleSelection(pos.id)}
                  globalPriceFactor={globalPriceFactor}
                  labType={labType}
                  is2026={is2026Data && 'position_code' in pos}
                />
              </div>
            );
          })
        )}

        {/* Loading Indicator & Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Positionen werden geladen...</span>
            </div>
          )}
          {!hasMore && sortedPositions.length > 0 && (
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Ende der Liste
            </span>
          )}
        </div>
      </div>

      {/* Selection Action Bar */}
      {selectedForTemplate.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-fade-in-up">
          <div className="font-medium text-sm flex items-center gap-2">
            <span className="bg-white text-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
              {selectedForTemplate.length}
            </span>
            ausgewählt
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <button
            onClick={onCreateTemplate}
            className="flex items-center gap-2 hover:text-brand-300 transition-colors font-bold text-sm"
          >
            <Layout className="w-4 h-4" /> Als Vorlage speichern
          </button>
          <button
            onClick={onClearSelection}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Position Card Component
interface PositionCardProps {
  position: BELPosition | CustomPosition;
  isFavorite: boolean;
  isSelected: boolean;
  onToggleFavorite: () => void;
  onToggleSelection: () => void;
  globalPriceFactor: number;
  labType: 'gewerbe' | 'praxis';
  is2026?: boolean;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  isFavorite,
  isSelected,
  onToggleFavorite,
  onToggleSelection,
  globalPriceFactor,
  labType,
  is2026 = false,
}) => {
  const isCustom = !('position_code' in position);
  const group = 'group' in position ? position.group : 'Eigenposition';

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between ${
        isSelected
          ? 'border-brand-500 ring-1 ring-brand-500'
          : isCustom
            ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/5'
            : 'border-gray-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Selection Checkbox */}
        <div
          onClick={onToggleSelection}
          className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
            isSelected
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'border-gray-300 dark:border-slate-600 hover:border-brand-400'
          }`}
        >
          {isSelected && <Check className="w-4 h-4" />}
        </div>

        {/* Position ID Badge */}
        <div className={`w-16 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm border relative ${
          isCustom 
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-100 dark:border-slate-700'
        }`}>
          {(() => {
            const code = 'position_code' in position ? position.position_code : position.id;
            return code?.replace(/^0+/, '') || code;
          })()}
          {is2026 && !isCustom && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-slate-900" title="Aktueller Preis 2026">
              <Check className="w-2.5 h-2.5 stroke-[4]" />
            </div>
          )}
          {isCustom && (
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-slate-900" title="Eigenposition">
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
        </div>

        {/* Position Info */}
        <div>
          <div className={`font-bold text-lg flex items-center gap-2 ${isCustom ? 'text-amber-900 dark:text-amber-100' : 'text-slate-900 dark:text-white'}`}>
            {position.name}
            {isCustom && <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider">Eigen</span>}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{group}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>{labType === 'gewerbe' ? 'Gewerbe' : 'Praxis'}</span>
            {is2026 && !isCustom && (
              <>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-green-600 dark:text-green-400 font-bold">2026</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Price */}
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {(position.price * globalPriceFactor).toFixed(2)} €
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-slate-400">
            {globalPriceFactor !== 1 && (
              <span className="text-brand-500">x{globalPriceFactor}</span>
            )}
            <span>Höchstpreis</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? 'text-amber-400 bg-amber-50 dark:bg-amber-900/20'
              : 'text-slate-300 hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
