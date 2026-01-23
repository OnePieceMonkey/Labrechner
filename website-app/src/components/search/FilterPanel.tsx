"use client";

interface FilterPanelProps {
  selectedKzv: string;
  onKzvChange: (kzv: string) => void;
  selectedLaborType: "gewerbe" | "praxis";
  onLaborTypeChange: (type: "gewerbe" | "praxis") => void;
  selectedGroup: number | null;
  onGroupChange: (group: number | null) => void;
}

const KZV_OPTIONS = [
  { value: "KZVBW", label: "Baden-Württemberg" },
  { value: "KZVB", label: "Bayern" },
  { value: "KZVBerlin", label: "Berlin" },
  { value: "KZVLB", label: "Brandenburg" },
  { value: "KZVBremen", label: "Bremen" },
  { value: "KZVHH", label: "Hamburg" },
  { value: "KZVH", label: "Hessen" },
  { value: "KZVMV", label: "Mecklenburg-Vorpommern" },
  { value: "KZVN", label: "Niedersachsen" },
  { value: "KZVNR", label: "Nordrhein" },
  { value: "KZVRLP", label: "Rheinland-Pfalz" },
  { value: "KZVSaar", label: "Saarland" },
  { value: "KZVS", label: "Sachsen" },
  { value: "KZVSA", label: "Sachsen-Anhalt" },
  { value: "KZVSH", label: "Schleswig-Holstein" },
  { value: "KZVT", label: "Thüringen" },
  { value: "KZVWL", label: "Westfalen-Lippe" },
];

const BEL_GROUPS = [
  { id: 0, name: "Modelle & Hilfsmittel", range: "001-032" },
  { id: 1, name: "Kronen & Brücken", range: "101-165" },
  { id: 2, name: "Metallbasis / Modellguss", range: "201-212" },
  { id: 3, name: "Prothesen", range: "301-384" },
  { id: 4, name: "Schienen & Aufbissbehelfe", range: "401-404" },
  { id: 5, name: "UKPS", range: "501-521" },
  { id: 7, name: "KFO", range: "701-751" },
  { id: 8, name: "Instandsetzung & Erweiterung", range: "801-870" },
];

export function FilterPanel({
  selectedKzv,
  onKzvChange,
  selectedLaborType,
  onLaborTypeChange,
  selectedGroup,
  onGroupChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* KZV Region */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900">KZV-Region</h3>
        <select
          value={selectedKzv}
          onChange={(e) => onKzvChange(e.target.value)}
          className="input mt-2 w-full"
        >
          {KZV_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Labor Type */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900">Labor-Typ</h3>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              name="laborType"
              checked={selectedLaborType === "gewerbe"}
              onChange={() => onLaborTypeChange("gewerbe")}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Gewerbelabor</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              type="radio"
              name="laborType"
              checked={selectedLaborType === "praxis"}
              onChange={() => onLaborTypeChange("praxis")}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Praxislabor</span>
          </label>
        </div>
      </div>

      {/* BEL Group */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">BEL-Gruppe</h3>
          {selectedGroup !== null && (
            <button
              onClick={() => onGroupChange(null)}
              className="text-xs text-primary hover:underline"
            >
              Zurücksetzen
            </button>
          )}
        </div>
        <div className="mt-3 space-y-1">
          {BEL_GROUPS.map((group) => (
            <button
              key={group.id}
              onClick={() =>
                onGroupChange(selectedGroup === group.id ? null : group.id)
              }
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedGroup === group.id
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="font-medium">{group.range}</span>
              <span className="ml-2 text-xs opacity-75">{group.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
