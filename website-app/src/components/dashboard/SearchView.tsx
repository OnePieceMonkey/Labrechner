'use client';

import React, { useState } from 'react';
import { Search, Star, Check, Mic, Layout, X } from 'lucide-react';
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
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulation - in Zukunft Web Speech API
    setTimeout(() => {
      setIsListening(false);
      onSearchChange('Krone');
    }, 2000);
  };

  // Filter positions based on search and favorites view
  const filteredPositions = positions.filter((pos) => {
    const codeToSearch = 'position_code' in pos ? pos.position_code : pos.id;
    const matchesSearch =
      pos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      codeToSearch?.includes(searchQuery);
    const isFavorite = isFavoritesView ? favorites.includes(pos.id) : true;
    return matchesSearch && isFavorite;
  });

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
        {filteredPositions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            {isFavoritesView
              ? 'Keine Favoriten gefunden. Markieren Sie Positionen mit dem Stern.'
              : 'Keine Positionen gefunden.'}
          </div>
        ) : (
          filteredPositions.map((pos) => (
            <PositionCard
              key={pos.id}
              position={pos}
              isFavorite={favorites.includes(pos.id)}
              isSelected={selectedForTemplate.includes(pos.id)}
              onToggleFavorite={() => onToggleFavorite(pos.id)}
              onToggleSelection={() => onToggleSelection(pos.id)}
              globalPriceFactor={globalPriceFactor}
              labType={labType}
            />
          ))
        )}
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
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  isFavorite,
  isSelected,
  onToggleFavorite,
  onToggleSelection,
  globalPriceFactor,
  labType,
}) => {
  const group = 'group' in position ? position.group : 'Eigenposition';

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between ${
        isSelected
          ? 'border-brand-500 ring-1 ring-brand-500'
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
        <div className="w-16 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center font-mono font-bold text-slate-700 dark:text-slate-300 text-sm border border-gray-100 dark:border-slate-700">
          {'position_code' in position ? position.position_code : position.id}
        </div>

        {/* Position Info */}
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-lg">
            {position.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Gruppe {group}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>{labType === 'gewerbe' ? 'Gewerbe' : 'Praxis'}</span>
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
