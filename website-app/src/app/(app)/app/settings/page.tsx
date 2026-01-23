"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

const KZV_OPTIONS = [
  { value: "KZVBW", label: "KZV Baden-Württemberg" },
  { value: "KZVB", label: "KZV Bayern" },
  { value: "KZVBerlin", label: "KZV Berlin" },
  { value: "KZVLB", label: "KZV Land Brandenburg" },
  { value: "KZVBremen", label: "KZV Bremen" },
  { value: "KZVHH", label: "KZV Hamburg" },
  { value: "KZVH", label: "KZV Hessen" },
  { value: "KZVMV", label: "KZV Mecklenburg-Vorpommern" },
  { value: "KZVN", label: "KZV Niedersachsen" },
  { value: "KZVNR", label: "KZV Nordrhein" },
  { value: "KZVRLP", label: "KZV Rheinland-Pfalz" },
  { value: "KZVSaar", label: "KZV Saarland" },
  { value: "KZVS", label: "KZV Sachsen" },
  { value: "KZVSA", label: "KZV Sachsen-Anhalt" },
  { value: "KZVSH", label: "KZV Schleswig-Holstein" },
  { value: "KZVT", label: "KZV Thüringen" },
  { value: "KZVWL", label: "KZV Westfalen-Lippe" },
];

// KZV-Code zu ID Mapping
const KZV_CODE_TO_ID: Record<string, number> = {};
const KZV_ID_TO_CODE: Record<number, string> = {};

export default function SettingsPage() {
  const { user, settings, isLoading: userLoading, updateSettings } = useUser();
  const [selectedKzv, setSelectedKzv] = useState("KZVB");
  const [laborType, setLaborType] = useState<"gewerbe" | "praxis">("gewerbe");
  const [privateFactor, setPrivateFactor] = useState("1.0");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kzvLoaded, setKzvLoaded] = useState(false);

  // KZV-IDs laden
  useEffect(() => {
    async function loadKzvIds() {
      if (Object.keys(KZV_CODE_TO_ID).length > 0) {
        setKzvLoaded(true);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("kzv_regions")
        .select("id, code") as { data: { id: number; code: string }[] | null };

      if (data) {
        data.forEach((kzv) => {
          KZV_CODE_TO_ID[kzv.code] = kzv.id;
          KZV_ID_TO_CODE[kzv.id] = kzv.code;
        });
        setKzvLoaded(true);
      }
    }
    loadKzvIds();
  }, []);

  // Settings aus Supabase laden wenn vorhanden
  useEffect(() => {
    if (settings && kzvLoaded) {
      if (settings.kzv_id && KZV_ID_TO_CODE[settings.kzv_id]) {
        setSelectedKzv(KZV_ID_TO_CODE[settings.kzv_id]);
      }
      if (settings.labor_type) {
        setLaborType(settings.labor_type as "gewerbe" | "praxis");
      }
      if (settings.private_factor) {
        setPrivateFactor(String(settings.private_factor));
      }
    }
  }, [settings, kzvLoaded]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const kzvId = KZV_CODE_TO_ID[selectedKzv];

      await updateSettings({
        kzv_id: kzvId,
        labor_type: laborType,
        private_factor: parseFloat(privateFactor),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Einstellungen konnten nicht gespeichert werden.");
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-500">Lade Einstellungen...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/app"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zurück zur Suche
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Passen Sie die Standardwerte für Ihre BEL-Suche an.
        </p>
        {user && (
          <p className="mt-2 text-xs text-gray-400">
            Angemeldet als: {user.email}
          </p>
        )}
      </div>

      {/* Settings Form */}
      <div className="card space-y-6">
        {/* KZV Region */}
        <div>
          <label
            htmlFor="kzv"
            className="block text-sm font-medium text-gray-700"
          >
            KZV-Region
          </label>
          <select
            id="kzv"
            value={selectedKzv}
            onChange={(e) => setSelectedKzv(e.target.value)}
            className="input mt-1"
          >
            {KZV_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Die Preise werden basierend auf der gewählten Region angezeigt.
          </p>
        </div>

        {/* Labor Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Labor-Typ
          </label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="laborType"
                value="gewerbe"
                checked={laborType === "gewerbe"}
                onChange={() => setLaborType("gewerbe")}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Gewerbelabor (100% Höchstpreis)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="laborType"
                value="praxis"
                checked={laborType === "praxis"}
                onChange={() => setLaborType("praxis")}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Praxislabor (95% – 5% Abzug)
              </span>
            </label>
          </div>
        </div>

        {/* Private Factor */}
        <div>
          <label
            htmlFor="factor"
            className="block text-sm font-medium text-gray-700"
          >
            Privatleistungs-Faktor (optional)
          </label>
          <input
            type="number"
            id="factor"
            value={privateFactor}
            onChange={(e) => setPrivateFactor(e.target.value)}
            step="0.1"
            min="1.0"
            max="5.0"
            className="input mt-1 w-32"
          />
          <p className="mt-1 text-xs text-gray-500">
            Faktor für BEB-Privatleistungen (Standard: 1.0).
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div>
            {saved && (
              <span className="text-sm text-green-600">
                Einstellungen gespeichert!
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !user}
            className="btn-primary px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">Hinweis</h3>
        <p className="mt-1 text-sm text-gray-600">
          {user
            ? "Ihre Einstellungen werden mit Ihrem Konto synchronisiert und sind auf allen Geräten verfügbar."
            : "Melden Sie sich an, um Ihre Einstellungen dauerhaft zu speichern."}
        </p>
      </div>
    </div>
  );
}
