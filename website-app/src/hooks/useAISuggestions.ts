'use client';

import { useState, useCallback } from 'react';

export interface BELSuggestion {
  positionCode: string;
  name: string;
  reason: string;
  confidence: number;
}

export interface SuggestionResponse {
  suggestions: BELSuggestion[];
  explanation: string;
}

export type SuggestionMode = 'positions' | 'template' | 'optimize';

interface UseAISuggestionsOptions {
  onError?: (error: string) => void;
}

export function useAISuggestions(options: UseAISuggestionsOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<BELSuggestion[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  // Vorschläge abrufen
  const getSuggestions = useCallback(
    async (
      context: string,
      mode: SuggestionMode = 'positions',
      existingPositions?: string[],
      region?: string
    ): Promise<SuggestionResponse | null> => {
      if (!context.trim()) {
        setError('Bitte geben Sie einen Kontext ein');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            context,
            mode,
            existingPositions,
            region,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `Fehler: ${response.status}`;
          setError(errorMessage);
          options.onError?.(errorMessage);
          return null;
        }

        const data: SuggestionResponse = await response.json();

        setSuggestions(data.suggestions);
        setExplanation(data.explanation);

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Netzwerkfehler';
        setError(message);
        options.onError?.(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Einzelnen Vorschlag annehmen (aus der Liste entfernen)
  const acceptSuggestion = useCallback((positionCode: string) => {
    setSuggestions((prev) => prev.filter((s) => s.positionCode !== positionCode));
  }, []);

  // Alle Vorschläge zurücksetzen
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setExplanation('');
    setError(null);
  }, []);

  // Vorschläge nach Confidence sortieren
  const sortedSuggestions = [...suggestions].sort((a, b) => b.confidence - a.confidence);

  return {
    loading,
    error,
    suggestions: sortedSuggestions,
    explanation,
    getSuggestions,
    acceptSuggestion,
    clearSuggestions,
  };
}
