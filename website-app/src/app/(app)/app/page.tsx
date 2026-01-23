"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { FilterPanel } from "@/components/search/FilterPanel";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import { createClient } from "@/lib/supabase/client";

// KZV-Code zu ID Mapping (wird beim Laden gefüllt)
const KZV_CODE_TO_ID: Record<string, number> = {};

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [selectedKzv, setSelectedKzv] = useState("KZVB");
  const [selectedLaborType, setSelectedLaborType] = useState<
    "gewerbe" | "praxis"
  >("gewerbe");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [kzvId, setKzvId] = useState<number | undefined>(undefined);

  // KZV-IDs beim ersten Laden holen
  useEffect(() => {
    async function loadKzvIds() {
      if (Object.keys(KZV_CODE_TO_ID).length > 0) {
        setKzvId(KZV_CODE_TO_ID[selectedKzv]);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("kzv_regions")
        .select("id, code") as { data: { id: number; code: string }[] | null };

      if (data) {
        data.forEach((kzv) => {
          KZV_CODE_TO_ID[kzv.code] = kzv.id;
        });
        setKzvId(KZV_CODE_TO_ID[selectedKzv]);
      }
    }
    loadKzvIds();
  }, [selectedKzv]);

  // KZV-ID aktualisieren wenn sich die Auswahl ändert
  useEffect(() => {
    if (KZV_CODE_TO_ID[selectedKzv]) {
      setKzvId(KZV_CODE_TO_ID[selectedKzv]);
    }
  }, [selectedKzv]);

  // Suche mit echten Supabase-Daten
  const { results, isLoading, error, search } = useSearch({
    kzvId,
    laborType: selectedLaborType,
    groupId: selectedGroup,
  });

  // Query-Änderung an Hook weiterleiten
  useEffect(() => {
    search(query);
  }, [query, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BEL-Suche</h1>
          <p className="mt-1 text-sm text-gray-500">
            Finden Sie BEL-Positionen nach Nummer oder Bezeichnung
          </p>
        </div>
        <Link
          href="/app/settings"
          className="btn-ghost flex items-center gap-2 px-4 py-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Einstellungen</span>
        </Link>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Position suchen (z.B. 'Vollkrone' oder '102')"
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filter Panel (Sidebar) */}
        <div className="lg:col-span-1">
          <FilterPanel
            selectedKzv={selectedKzv}
            onKzvChange={setSelectedKzv}
            selectedLaborType={selectedLaborType}
            onLaborTypeChange={setSelectedLaborType}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
          />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <SearchResults
            results={results}
            isLoading={isLoading}
            query={query}
            laborType={selectedLaborType}
          />
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {query.length === 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="text-sm text-primary-700">
            <strong>Tipp:</strong> Geben Sie mindestens 2 Zeichen ein, um die
            Suche zu starten. Sie können nach Positionsnummer (z.B.
            &quot;102&quot;) oder Bezeichnung (z.B. &quot;Vollkrone&quot;)
            suchen.
          </p>
        </div>
      )}
    </div>
  );
}
