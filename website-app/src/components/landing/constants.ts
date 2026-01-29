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
    description: "Zum Testen und für Einsteiger.",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: [
      "BEL-Suche in allen Regionen",
      "Bis zu 3 Rechnungen/Monat",
      "Basis PDF-Erstellung",
      "E-Mail Support",
    ],
    cta: "Kostenlos starten",
    highlight: false,
  },
  {
    id: "professional",
    name: "Pro",
    description: "Für aktive Praxis- und Kleinlabore.",
    priceMonthly: 49,
    priceYearly: 39,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
    features: [
      "Alles aus Starter",
      "Unbegrenzte Rechnungen",
      "BEL + BEB (Eigenpositionen)",
      "Eigenes Logo auf Rechnung",
      "50 Vorlagen",
      "Prioritäts-Support",
    ],
    cta: "Pro buchen",
    highlight: true,
  },
  {
    id: "expert",
    name: "Expert",
    description: "Für Profi-Labore mit hohem Volumen.",
    priceMonthly: 89,
    priceYearly: 71,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPERT_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPERT_YEARLY,
    features: [
      "Alles aus Pro",
      "KI-Plausibilitäts-Check",
      "Unbegrenzte KI-Vorschläge",
      "XML-Export (sobald verfügbar)",
      "Multi-User (bis 5)",
      "Prio-Support",
    ],
    cta: "Expert buchen",
    highlight: false,
  },
];
