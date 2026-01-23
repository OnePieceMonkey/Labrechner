"use client";

import { PriceCard } from "./PriceCard";
import { Search, Loader2 } from "lucide-react";

interface SearchResult {
  id: number;
  position_code: string;
  name: string;
  group_name: string | null;
  price: number | null;
  is_ukps: boolean;
  is_implant: boolean;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  laborType: "gewerbe" | "praxis";
}

export function SearchResults({
  results,
  isLoading,
  query,
  laborType,
}: SearchResultsProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-500">Suche läuft...</span>
      </div>
    );
  }

  // Empty Query State
  if (query.length < 2) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <Search className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Suche starten
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Geben Sie mindestens 2 Zeichen ein, um BEL-Positionen zu suchen.
        </p>
      </div>
    );
  }

  // No Results State
  if (results.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <Search className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Keine Ergebnisse
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Keine Positionen gefunden für &quot;{query}&quot;. Versuchen Sie einen
          anderen Suchbegriff.
        </p>
      </div>
    );
  }

  // Results
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"}{" "}
          für &quot;{query}&quot;
        </p>
      </div>
      <div className="space-y-3">
        {results.map((result) => (
          <PriceCard
            key={result.id}
            positionCode={result.position_code}
            name={result.name}
            groupName={result.group_name}
            price={result.price}
            laborType={laborType}
            isUkps={result.is_ukps}
            isImplant={result.is_implant}
          />
        ))}
      </div>
    </div>
  );
}
