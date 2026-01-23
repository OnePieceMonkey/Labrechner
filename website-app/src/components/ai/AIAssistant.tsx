'use client';

import { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Lightbulb,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAISuggestions, type BELSuggestion, type SuggestionMode } from '@/hooks/useAISuggestions';

interface AIAssistantProps {
  onSelectPosition?: (positionCode: string, name: string) => void;
  existingPositions?: string[];
  region?: string;
  className?: string;
  compact?: boolean;
}

const modeLabels: Record<SuggestionMode, { label: string; description: string }> = {
  positions: {
    label: 'Positionen vorschlagen',
    description: 'Finde passende BEL-Positionen für deine Arbeit',
  },
  template: {
    label: 'Vorlage erstellen',
    description: 'Erstelle eine vollständige Arbeitsvorlage',
  },
  optimize: {
    label: 'Optimieren',
    description: 'Prüfe und ergänze bestehende Positionen',
  },
};

const examplePrompts = [
  'Vollkrone Metall für Molar',
  'Verblendbrücke 3-gliedrig',
  'Totalprothese Oberkiefer',
  'Teleskoparbeit auf 4 Pfeilern',
  'Reparatur Kunststoffzahn',
];

export function AIAssistant({
  onSelectPosition,
  existingPositions = [],
  region,
  className = '',
  compact = false,
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SuggestionMode>('positions');
  const [acceptedCodes, setAcceptedCodes] = useState<Set<string>>(new Set());

  const {
    loading,
    error,
    suggestions,
    explanation,
    getSuggestions,
    clearSuggestions,
  } = useAISuggestions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setAcceptedCodes(new Set());
    await getSuggestions(input, mode, existingPositions, region);
  };

  const handleSelectSuggestion = (suggestion: BELSuggestion) => {
    onSelectPosition?.(suggestion.positionCode, suggestion.name);
    setAcceptedCodes((prev) => new Set([...prev, suggestion.positionCode]));
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Hoch';
    if (confidence >= 0.6) return 'Mittel';
    return 'Gering';
  };

  return (
    <div
      className={`bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-xl border border-brand-200 dark:border-brand-800 ${className}`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">KI-Assistent</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {modeLabels[mode].description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full">
            PRO
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Modus Auswahl */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(modeLabels) as SuggestionMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  mode === m
                    ? 'bg-brand-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {modeLabels[m].label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="z.B. Vollkrone Metall für Molar..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Beispiele */}
          {!suggestions.length && !loading && !error && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Beispiele:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button
                onClick={clearSuggestions}
                className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
              <span className="text-gray-500 dark:text-gray-400">Analysiere...</span>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              {/* Erklärung */}
              {explanation && (
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{explanation}</p>
                </div>
              )}

              {/* Liste */}
              <div className="space-y-2">
                {suggestions.map((suggestion) => {
                  const isAccepted = acceptedCodes.has(suggestion.positionCode);

                  return (
                    <div
                      key={suggestion.positionCode}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isAccepted
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'
                      }`}
                    >
                      {/* Code */}
                      <div className="w-16 flex-shrink-0">
                        <span className="font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
                          {suggestion.positionCode}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {suggestion.name}
                        </p>
                        {suggestion.reason && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {suggestion.reason}
                          </p>
                        )}
                      </div>

                      {/* Confidence */}
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={`text-xs font-medium ${getConfidenceColor(
                            suggestion.confidence
                          )}`}
                        >
                          {getConfidenceLabel(suggestion.confidence)}
                        </span>
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all"
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectSuggestion(suggestion)}
                        disabled={isAccepted}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          isAccepted
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-brand-500 text-white hover:bg-brand-600'
                        }`}
                        title={isAccepted ? 'Hinzugefügt' : 'Hinzufügen'}
                      >
                        {isAccepted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Clear Button */}
              <button
                onClick={clearSuggestions}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Vorschläge löschen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
