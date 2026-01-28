/**
 * BEL-spezifische TypeScript Types
 */

// Labor-Typ
export type LaborType = "gewerbe" | "praxis";

// BEL-Gruppe (0-8, ohne 6)
export interface BelGroupInfo {
  id: number;
  groupNumber: number;
  name: string;
  positionRange: string;
  description?: string;
}

// BEL-Gruppen Konstante
export const BEL_GROUPS: BelGroupInfo[] = [
  {
    id: 0,
    groupNumber: 0,
    name: "Modelle & Hilfsmittel",
    positionRange: "0010-0320",
    description: "Arbeitsmodelle, Artikulator, Löffel, Provisorien",
  },
  {
    id: 1,
    groupNumber: 1,
    name: "Kronen & Brücken",
    positionRange: "1010-1650",
    description: "Festsitzender Zahnersatz, Verblendungen, Teleskope",
  },
  {
    id: 2,
    groupNumber: 2,
    name: "Metallbasis / Modellguss",
    positionRange: "2010-2120",
    description: "Gegossene Prothesenbasis, Klammern, Geschiebe",
  },
  {
    id: 3,
    groupNumber: 3,
    name: "Prothesen",
    positionRange: "3010-3840",
    description: "Herausnehmbarer Zahnersatz, Aufstellung, Fertigstellung",
  },
  {
    id: 4,
    groupNumber: 4,
    name: "Schienen & Aufbissbehelfe",
    positionRange: "4010-4040",
    description: "Aufbissschienen, semipermanente Schienen",
  },
  {
    id: 5,
    groupNumber: 5,
    name: "UKPS",
    positionRange: "5010-5210",
    description: "Unterkiefer-Protrusionsschienen (Schlafapnoe)",
  },
  {
    id: 7,
    groupNumber: 7,
    name: "KFO",
    positionRange: "7010-7510",
    description: "Kieferorthopädische Geräte",
  },
  {
    id: 8,
    groupNumber: 8,
    name: "Instandsetzung & Erweiterung",
    positionRange: "8010-8700",
    description: "Reparaturen, Unterfütterungen, Erweiterungen",
  },
];

// KZV-Region Info
export interface KzvInfo {
  code: string;
  name: string;
  bundesland: string;
}

// Alle 17 KZV-Regionen
export const KZV_REGIONS: KzvInfo[] = [
  { code: "KZVBW", name: "KZV Baden-Württemberg", bundesland: "Baden-Württemberg" },
  { code: "KZVB", name: "KZV Bayern", bundesland: "Bayern" },
  { code: "KZVBerlin", name: "KZV Berlin", bundesland: "Berlin" },
  { code: "KZVLB", name: "KZV Land Brandenburg", bundesland: "Brandenburg" },
  { code: "KZVBremen", name: "KZV Bremen", bundesland: "Bremen" },
  { code: "KZVHH", name: "KZV Hamburg", bundesland: "Hamburg" },
  { code: "KZVH", name: "KZV Hessen", bundesland: "Hessen" },
  { code: "KZVMV", name: "KZV Mecklenburg-Vorpommern", bundesland: "Mecklenburg-Vorpommern" },
  { code: "KZVN", name: "KZV Niedersachsen", bundesland: "Niedersachsen" },
  { code: "KZVNR", name: "KZV Nordrhein", bundesland: "Nordrhein-Westfalen" },
  { code: "KZVRLP", name: "KZV Rheinland-Pfalz", bundesland: "Rheinland-Pfalz" },
  { code: "KZVSaar", name: "KZV Saarland", bundesland: "Saarland" },
  { code: "KZVS", name: "KZV Sachsen", bundesland: "Sachsen" },
  { code: "KZVSA", name: "KZV Sachsen-Anhalt", bundesland: "Sachsen-Anhalt" },
  { code: "KZVSH", name: "KZV Schleswig-Holstein", bundesland: "Schleswig-Holstein" },
  { code: "KZVT", name: "KZV Thüringen", bundesland: "Thüringen" },
  { code: "KZVWL", name: "KZV Westfalen-Lippe", bundesland: "Nordrhein-Westfalen" },
];

// Preis mit MwSt berechnen
export function calculatePriceWithVat(
  basePrice: number,
  vatRate: number = 0.07 // 7% für zahntechnische Leistungen
): number {
  return basePrice * (1 + vatRate);
}

// Praxislabor-Preis berechnen (5% Abzug)
export function calculatePraxisPrice(gewerbePrice: number): number {
  return gewerbePrice * 0.95;
}

// Privatleistungs-Preis mit Faktor berechnen
export function calculatePrivatePrice(
  basePrice: number,
  factor: number = 1.0
): number {
  return basePrice * factor;
}
