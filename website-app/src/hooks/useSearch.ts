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
  // Only letters, numbers, whitespace, and basic punctuation (Unicode-aware for umlauts)
  return trimmed.replace(/[^\p{L}\p{N}\s\-.,]/gu, "");
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
  offset?: number;
  debounceMs?: number;
}

interface UseSearchReturn {
  results: BelSearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  search: (query: string) => void;
  loadMore: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    kzvId,
    laborType = "gewerbe",
    groupId = null,
    limit = 20,
    debounceMs = 300,
  } = options;

  // Validierte Werte
  const safeLimit = validateLimit(limit);
  const safeKzvId = validateKzvId(kzvId);
  const safeGroupId = validateGroupId(groupId);
  const safeLaborType = validateLaborType(laborType);

  const [results, setResults] = useState<BelSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(0);

  // Debounce query und Reset Page
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0); // Reset bei neuer Suche
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Reset pagination/results when filters change
  useEffect(() => {
    setPage(0);
    setResults([]);
    setHasMore(true);
  }, [safeKzvId, safeLaborType, safeGroupId, safeLimit]);

  // Execute search when debounced query or page changes
  useEffect(() => {
    const executeSearch = async () => {
      // Wir erlauben jetzt auch leere Queries für die initiale Liste
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const sanitizedQuery = sanitizeSearchQuery(debouncedQuery);
        const currentOffset = page * safeLimit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: searchError } = await (supabase.rpc as any)(
          "search_bel_positions",
          {
            search_query: sanitizedQuery || "", // Leere Query schickt ""
            user_kzv_id: safeKzvId,
            user_labor_type: safeLaborType,
            group_filter: safeGroupId,
            result_limit: safeLimit,
            result_offset: currentOffset, // Wir müssen sicherstellen, dass RPC Offset unterstützt
          }
        );

        if (searchError) throw searchError;

        const newResults = data ?? [];
        
        if (page === 0) {
          setResults(newResults);
        } else {
          setResults(prev => [...prev, ...newResults]);
        }

        setHasMore(newResults.length === safeLimit);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Search error:", err);
        }
        setError("Die Suche konnte nicht durchgeführt werden.");
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery, page, safeKzvId, safeLaborType, safeGroupId, safeLimit]);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  return {
    results,
    isLoading,
    hasMore,
    error,
    search,
    loadMore,
  };
}
