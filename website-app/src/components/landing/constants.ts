import { Search, Map, RefreshCw, Bot } from "lucide-react";

export const HERO_COPY = {
  headline: "BEL-Preise in Sekunden finden",
  subline:
    "Aktuelle Höchstpreise für alle 17 KZV-Regionen – verlässlich, schnell, immer aktuell.",
  primaryCta: "Jetzt kostenlos testen",
  secondaryCta: "Funktionen ansehen",
};

export const FEATURES_DATA = [
  {
    id: 1,
    icon: Search,
    title: "Suche in Sekunden",
    text: "Finden Sie jede BEL-Position sofort – nach Nummer oder Bezeichnung.",
  },
  {
    id: 2,
    icon: Map,
    title: "Alle 17 Regionen",
    text: "Regionale Höchstpreise auf einen Blick – von Bayern bis Schleswig-Holstein.",
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Immer aktuell",
    text: "BEL-II-Preise ab 01.01.2026 integriert – automatische Updates.",
  },
  {
    id: 4,
    icon: Bot,
    title: "KI-Assistent",
    text: "Schnelle Hilfe bei Fragen zur Abrechnung und Positionsauswahl.",
  },
];

export const WAITLIST_COPY = {
  headline: "Bereit, Zeit zu sparen?",
  subline: "Sichern Sie sich frühen Zugang zur Beta-Version.",
  hint: "Kostenlos für Beta-Tester. Keine Kreditkarte nötig.",
};

export const TRUST_BADGES = ["BEL II 2026", "DSGVO-konform", "Made in Germany"];

export const REGIONS = [
  "KZV Bayern",
  "KZV Berlin",
  "KZV Brandenburg",
  "KZV Bremen",
  "KZV Hamburg",
  "KZV Hessen",
  "KZV Mecklenburg-Vorpommern",
  "KZV Niedersachsen",
  "KZV Nordrhein",
  "KZV Rheinland-Pfalz",
  "KZV Saarland",
  "KZV Sachsen",
  "KZV Sachsen-Anhalt",
  "KZV Schleswig-Holstein",
  "KZV Thüringen",
  "KZV Westfalen-Lippe",
  "KZV Baden-Württemberg",
];

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Starter",
    description: "Für kleine Labore und Einsteiger.",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Suche in allen Regionen", "Basis-Favoriten", "Community Support"],
    cta: "Kostenlos starten",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Für wachsende Labore mit Anspruch.",
    priceMonthly: 29,
    priceYearly: 24,
    features: [
      "Alles in Starter",
      "Unbegrenzte Favoriten",
      "KI-Assistent (Basis)",
      "Rechnungsvorlagen",
    ],
    cta: "Pro buchen",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    description: "Maximale Effizienz für Großlabore.",
    priceMonthly: 99,
    priceYearly: 79,
    features: [
      "Alles in Pro",
      "KI-Assistent (Unlimited)",
      "Team-Verwaltung",
      "Priorisierter Support",
      "API-Zugriff",
    ],
    cta: "Business buchen",
    highlight: false,
  },
];
