"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BelSearchResult } from "@/types/database";
import type { LaborType } from "@/types/bel";

// === INPUT VALIDATION ===
const MAX_QUERY_LENGTH = 100;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

function sanitizeSearchQuery(query: string): string {
  // Trimmen und Länge begrenzen
  const trimmed = query.trim().slice(0, MAX_QUERY_LENGTH);
  // Nur alphanumerische Zeichen, Umlaute, Leerzeichen und Bindestriche erlauben
  return trimmed.replace(/[^\w\säöüÄÖÜß\-.,]/gi, "");
}

function validateLimit(limit: number): number {
  const parsed = Math.floor(limit);
  if (isNaN(parsed) || parsed < MIN_LIMIT) return MIN_LIMIT;
  if (parsed > MAX_LIMIT) return MAX_LIMIT;
  return parsed;
}

function validateKzvId(kzvId: number | undefined): number | null {
  if (kzvId === undefined || kzvId === null) return null;
  const parsed = Math.floor(kzvId);
  // KZV IDs sind 1-17 (Bundesländer)
  if (isNaN(parsed) || parsed < 1 || parsed > 17) return null;
  return parsed;
}

function validateGroupId(groupId: number | null | undefined): number | null {
  if (groupId === undefined || groupId === null) return null;
  const parsed = Math.floor(groupId);
  // BEL Gruppen sind 1-8
  if (isNaN(parsed) || parsed < 1 || parsed > 8) return null;
  return parsed;
}

function validateLaborType(laborType: string): LaborType {
  const valid: LaborType[] = ["gewerbe", "praxis"];
  return valid.includes(laborType as LaborType)
    ? (laborType as LaborType)
    : "gewerbe";
}

interface UseSearchOptions {
  kzvId?: number;
  laborType?: LaborType;
  groupId?: number | null;
  limit?: number;
  debounceMs?: number;
}

interface UseSearchReturn {
  results: BelSearchResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    kzvId,
    laborType = "gewerbe",
    groupId = null,
    limit = 50,
    debounceMs = 300,
  } = options;

  // Validierte Werte
  const safeLimit = validateLimit(limit);
  const safeKzvId = validateKzvId(kzvId);
  const safeGroupId = validateGroupId(groupId);
  const safeLaborType = validateLaborType(laborType);

  const [results, setResults] = useState<BelSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Execute search when debounced query changes
  useEffect(() => {
    const executeSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        // Sanitize query vor dem Senden
        const sanitizedQuery = sanitizeSearchQuery(debouncedQuery);

        // Frühzeitig abbrechen wenn Query nach Sanitization zu kurz
        if (sanitizedQuery.length < 2) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: searchError } = await (supabase.rpc as any)(
          "search_bel_positions",
          {
            search_query: sanitizedQuery,
            user_kzv_id: safeKzvId,
            user_labor_type: safeLaborType,
            group_filter: safeGroupId,
            result_limit: safeLimit,
          }
        );

        if (searchError) {
          throw searchError;
        }

        setResults(data ?? []);
      } catch (err) {
        // Keine sensitive Fehlermeldungen an Console in Production
        if (process.env.NODE_ENV === "development") {
          console.error("Search error:", err);
        }
        setError("Die Suche konnte nicht durchgeführt werden.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery, safeKzvId, safeLaborType, safeGroupId, safeLimit]);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
  };
}
