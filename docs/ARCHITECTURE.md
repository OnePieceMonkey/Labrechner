# LABRECHNER - Projekt-Dokumentation

> **Dokumentationsstand:** 24. Januar 2026
> **Version:** 1.0
> **Projektphase:** 6 (Launch Preparation)

---

## Inhaltsverzeichnis

1. [Executive Summary](#1-executive-summary)
2. [Projektbeschreibung](#2-projektbeschreibung)
3. [UI & Features](#3-ui--features)
4. [Funktionsumfang](#4-funktionsumfang)
5. [Projektstruktur](#5-projektstruktur)
6. [Datenbank & Preisstruktur](#6-datenbank--preisstruktur)
7. [Technischer Stack](#7-technischer-stack)
8. [Aktueller Status](#8-aktueller-status)
9. [Links & Ressourcen](#9-links--ressourcen)

---

## 1. Executive Summary

### Quick Facts

| Metrik | Wert |
|--------|------|
| **Projektname** | Labrechner |
| **Typ** | BEL-II-Preisrechner (Webapplikation) |
| **Zielgruppe** | Zahntechniker & Dentallabore in Deutschland |
| **Phase** | 6 - Launch Preparation |
| **Build-Status** | OK |
| **Blocker** | Keine |

### Kerndaten

| Datenpunkt | Wert |
|------------|------|
| BEL-Positionen | ~155 Leistungen |
| BEL-Preise | 3.663 Einträge |
| KZV-Regionen | 17 Bundesländer |
| BEL-Gruppen | 8 Kategorien |

### Technologie-Stack

```
Frontend:   Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
Backend:    Supabase (PostgreSQL + Auth + RLS)
Payments:   Stripe (3-Tier Subscription)
KI:         OpenAI GPT-4o-mini
Deployment: Vercel
```

---

## 2. Projektbeschreibung

### Was ist der Labrechner?

Der **Labrechner** ist eine moderne Webapplikation für Zahntechniker und Dentallabore in Deutschland. Er ermöglicht die schnelle Suche und Berechnung von BEL-II-Preisen (Bundeseinheitliches Leistungsverzeichnis für zahntechnische Leistungen) für alle 17 Kassenzahnärztlichen Vereinigungen (KZVs).

### Zielgruppe

- **Primär:** Zahntechniker in gewerblichen Laboren
- **Sekundär:** Praxislabore in Zahnarztpraxen
- **Region:** Deutschland (17 Bundesländer)

### Hauptfunktionen

1. **BEL-Preissuche** - Schnelle Suche nach Leistungspositionen mit Preisanzeige
2. **Regionale Preise** - Automatische Anpassung an die lokale KZV
3. **Rechnungserstellung** - PDF-Rechnungen mit Vorlagen
4. **Kundenverwaltung** - Zahnärzte und Praxen verwalten
5. **KI-Assistent** - Intelligente Positionsvorschläge

### Problemlösung

Bisher mussten Zahntechniker BEL-Preise manuell in veralteten Listen oder PDFs nachschlagen. Der Labrechner digitalisiert diesen Prozess und bietet:

- **Zeitersparnis:** Sekunden statt Minuten pro Preisabfrage
- **Aktualität:** BEL-II 2026 Preise immer aktuell
- **Regionalisierung:** Automatische KZV-spezifische Preise
- **Integration:** Direkte Übernahme in Rechnungen

---

## 3. UI & Features

### 3.1 Landing Page (Marketing)

Die öffentliche Landing Page präsentiert den Service für potenzielle Kunden.

#### Komponenten-Aufbau

```
Landing Page (/)
├── Navbar
│   ├── Logo "Labrechner"
│   ├── Navigation (Funktionen, Preise, App starten)
│   └── Theme Toggle (Dark/Light)
├── Hero Section
│   ├── Badge: "Neu: BEL II 2026 integriert"
│   ├── Headline mit Gradient
│   ├── Subheadline
│   ├── CTA-Buttons
│   └── Invoice-Animation (Demo)
├── RegionTicker
│   └── Scrollende BEL-Regionen-Anzeige
├── Features Section (4 Features)
│   ├── Suche in Sekunden (2 Spalten)
│   ├── Alle 17 Regionen (1 Spalte, 2 Reihen)
│   ├── Immer aktuell (1 Spalte)
│   └── KI-Assistent (1 Spalte, Premium)
├── Pricing Section
│   ├── Monthly/Yearly Toggle
│   └── 3 Preiskarten (Free, Pro, Enterprise)
├── Waitlist Section
│   └── E-Mail-Sammlung für Updates
├── Footer
│   ├── Impressum
│   ├── Datenschutz
│   └── Trust Badges
└── Cookie Banner
```

#### Design-Merkmale

- **Dark Mode:** Vollständig unterstützt via `next-themes`
- **Responsive:** Mobile-First Design
- **Animationen:** Fade-in, Hover-Effekte, Smooth Scroll
- **Glassmorphism:** Navbar mit backdrop-blur
- **Gradient-Texte:** Brand-Farben (Purple/Indigo)

---

### 3.2 Dashboard (App-Bereich)

Der geschützte Bereich für eingeloggte Nutzer.

#### Layout-Struktur

```
Dashboard (/app)
├── Header (sticky, h-16)
│   ├── Logo "Labrechner | App"
│   ├── Tab-Navigation
│   │   ├── Suche (Search Icon)
│   │   ├── Favoriten (Star Icon)
│   │   ├── Vorlagen (Layout Icon)
│   │   ├── Kunden (Users Icon)
│   │   └── Einstellungen (Settings Icon)
│   ├── "Zur Website" Link
│   ├── Theme Toggle
│   └── Sidebar Toggle
├── Sidebar (w-72, collapsible)
│   ├── KZV-Region Dropdown
│   ├── Labor-Typ Radio Buttons
│   └── BEL-Gruppe Buttons (8 Kategorien)
└── Main Content (flex-1)
    └── [Aktive Tab-Ansicht]
```

#### Welcome Toast

Bei Login erscheint ein personalisierter Gruß:
- `< 10:00 Uhr`: "Guten Morgen" + Coffee Icon
- `< 18:00 Uhr`: "Guten Tag" + Sun Icon
- `>= 18:00 Uhr`: "Guten Abend" + Moon Icon

---

### 3.3 BEL-Suche (Hauptfeature)

Die Kernfunktion der Anwendung.

#### SearchBar-Komponente

```
┌────────────────────────────────────────────────────────────┐
│ 🔍 Position suchen...                              [X] [🎤] │
└────────────────────────────────────────────────────────────┘
```

- **Features:**
  - Echtzeit-Suche mit Debouncing (300ms)
  - Mindestens 2 Zeichen für Suche
  - Clear-Button (X)
  - Voice-Input Button (vorbereitet)
  - Focus Ring in Primary-Farbe

#### FilterPanel (Sidebar)

```
┌─ KZV-Region ──────────────────┐
│ [▼ KZV Bayern auswählen     ] │  → 17 Regionen
└───────────────────────────────┘

┌─ Labor-Typ ───────────────────┐
│ ○ Praxislabor                 │
│ ● Gewerbelabor (Default)      │
└───────────────────────────────┘

┌─ BEL-Gruppe ──────────────────┐
│ [001-032] Modelle & Hilfsm.   │
│ [101-165] Kronen & Brücken    │
│ [201-212] Metallbasis         │
│ [301-384] Prothesen           │
│ [401-404] Schienen            │
│ [501-521] UKPS                │
│ [701-751] KFO                 │
│ [801-870] Instandsetzung      │
│                               │
│ [Zurücksetzen]                │
└───────────────────────────────┘
```

#### SearchResults

**Loading State:**
```
┌─────────────────────────────┐
│     ⟳ Suche läuft...        │
└─────────────────────────────┘
```

**Empty Query (< 2 Zeichen):**
```
┌─────────────────────────────┐
│     🔍 Suche starten        │
│  Geben Sie mindestens 2     │
│  Zeichen ein...             │
└─────────────────────────────┘
```

**No Results:**
```
┌─────────────────────────────┐
│     🔍 Keine Ergebnisse     │
│  Keine Positionen für       │
│  "xyz" gefunden             │
└─────────────────────────────┘
```

**Results:**
```
3 Ergebnisse für "Vollkrone"

┌─────────────────────────────────────────────────────────┐
│ [102]  Vollkrone/Metall                      €125,00    │
│ UKPS  [Implantat]                           Gewerbelabor │
│ Kronen & Brücken                                        │
├─────────────────────────────────────────────────────────┤
│ [103]  Vollkrone/Keramik                     €145,00    │
│        Kronen & Brücken                     Gewerbelabor │
├─────────────────────────────────────────────────────────┤
│ [104]  Vollkrone/Zirkon                      €165,00    │
│        Kronen & Brücken                     Gewerbelabor │
└─────────────────────────────────────────────────────────┘
```

#### PriceCard-Komponente

```
┌──────────────────────────────────────────────────────────┐
│ [102]  Vollkrone/Metall                                  │
│ UKPS  [Implantat]                          €125,00       │
│ Kronen & Brücken                          Gewerbelabor   │
└──────────────────────────────────────────────────────────┘

Elemente:
├── Position Code (font-mono, primary color)
├── Badges: UKPS, Implantat (optional)
├── Name (truncate bei Überlänge)
├── Gruppenname
├── Preis (2xl, bold, rechts)
└── Labor-Typ (xs, rechts)
```

---

### 3.4 Kundenverwaltung (ClientsView)

Verwaltung von Zahnärzten und Praxen als Rechnungsempfänger.

#### Übersicht

```
┌─ Kundenverwaltung ─────────────────────────────┐
│ Verwalten Sie Ihre Kunden und Rechnungsempf.   │
│                                    [+ Neuer Kunde] │
├────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐       │
│ │ Praxis Dr. Meier│  │ Zahnarzt Müller │       │
│ │ #1001           │  │ #1002           │       │
│ │ Herr Dr. Meier  │  │ Frau Dr. Müller │       │
│ │ 📍 Hauptstr. 1  │  │ 📍 Ringstr. 5   │       │
│ │    80331 München│  │    10115 Berlin │       │
│ │ [✏️] [🗑️]       │  │ [✏️] [🗑️]       │       │
│ └─────────────────┘  └─────────────────┘       │
└────────────────────────────────────────────────┘
```

#### Kunden-Modal (Erstellen/Bearbeiten)

```
┌─ Neuer Kunde ──────────────────────────────────┐
│                                                │
│ Kundennummer:    [1003                      ]  │
│ Anrede:          [▼ Herr                    ]  │
│ Titel:           [Dr. med. dent.            ]  │
│ Vorname:         [Max                       ]  │
│ Nachname:        [Mustermann                ]  │
│ Praxisname:      [Zahnarztpraxis Mustermann ]  │
│ Straße:          [Musterstraße 123          ]  │
│ PLZ:             [12345 ]  Stadt: [Musterst.]  │
│                                                │
│              [Abbrechen]  [Speichern]          │
└────────────────────────────────────────────────┘
```

**Datenfelder:**
- Kundennummer (Pflicht)
- Anrede (Herr/Frau)
- Titel (optional: Dr., Prof., etc.)
- Vor- und Nachname (Pflicht)
- Praxisname (optional)
- Adresse (Straße, PLZ, Stadt)
- Telefon, E-Mail, Notizen (optional)

---

### 3.5 Vorlagen (TemplatesView)

Verwaltung von Rechnungsvorlagen mit Positionslisten.

#### Vorlagen-Übersicht

```
┌─ Vorlagen ─────────────────────────────────────┐
│ Erstellen Sie wiederverwendbare Vorlagen       │
├────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐    │
│ │ 📋 Standardkrone          Faktor: 1.0   │    │
│ │                          [✏️] [🗑️]      │    │
│ │ ┌─────────────────────────────────────┐ │    │
│ │ │ 2x102  3x103  1x201        [+]      │ │    │
│ │ └─────────────────────────────────────┘ │    │
│ │ 6 Positionen              Gesamt: €520 │    │
│ │ [In Rechnung übernehmen]               │    │
│ └─────────────────────────────────────────┘    │
│                                                │
│ ┌ - - - - - - - - - - - - - - - - - - - ┐    │
│ :              [+] Neue Vorlage          :    │
│ └ - - - - - - - - - - - - - - - - - - - ┘    │
└────────────────────────────────────────────────┘
```

#### Vorlagen-Modal

```
┌─ Vorlage bearbeiten ───────────────────────────┐
│                                                │
│ Name:            [Standardkrone              ] │
│ Preisfaktor:     [1.0                        ] │
│                                                │
│ ┌─ KI-Assistent ─────────────────────────────┐ │
│ │ [✨ Vorschläge generieren]                 │ │
│ │                                            │ │
│ │ Vorschläge:                                │ │
│ │ ├── 0010 Modell (90% Konfidenz) [+]       │ │
│ │ ├── 0020 Artikulator (85%) [+]            │ │
│ │ └── 1031 Verblendung (80%) [+]            │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌─ Positionen ───────────────────────────────┐ │
│ │ [102] Vollkrone        Menge: [2▲▼] [X]   │ │
│ │ [103] Keramikkrone     Menge: [1▲▼] [X]   │ │
│ │ [201] Metallbasis      Menge: [1▲▼] [X]   │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│              [Abbrechen]  [Speichern]          │
└────────────────────────────────────────────────┘
```

**Features:**
- KI-gestützte Positionsvorschläge
- Mengenangabe pro Position
- Preisfaktor (z.B. 1.2 für 20% Aufschlag)
- Automatische Gesamtpreisberechnung
- Sparkles-Icon für KI-Vorschläge

---

### 3.6 Einstellungen (SettingsView)

Umfassende Konfiguration aller Benutzereinstellungen.

#### Settings-Karten (6 Bereiche)

```
┌─ ⚙️ Einstellungen ─────────────────────────────┐
│ Konfigurieren Sie Ihre persönlichen Einstellungen │
├────────────────────────────────────────────────┤

┌─ 🏢 Labor-Stammdaten ──────────────────────────┐
│ Laborname:        [Dental Labor Mustermann   ] │
│ Ansprechpartner:  [Max Mustermann            ] │
│ Straße & Nr.:     [Laborstraße 42            ] │
│ PLZ + Stadt:      [12345] [Musterstadt       ] │
│ USt-IdNr.:        [DE123456789               ] │
│ Gerichtsstand:    [Musterstadt               ] │
└────────────────────────────────────────────────┘

┌─ 🖼️ Firmenlogo ────────────────────────────────┐
│ ┌───────────────────────────┐                  │
│ │                           │                  │
│ │       [Logo-Vorschau]     │                  │
│ │                           │                  │
│ └───────────────────────────┘                  │
│ [📁 Bild hochladen]  Max 500x500px, 3MB        │
└────────────────────────────────────────────────┘

┌─ 🏦 Bankverbindung ────────────────────────────┐
│ Bankname:         [Sparkasse Musterstadt     ] │
│ IBAN:             [DE89 3704 0044 0532 0130 00]│
│ BIC:              [COBADEFFXXX               ] │
└────────────────────────────────────────────────┘

┌─ 📋 Eigenpositionen ───────────────────────────┐
│ [E-100] Sonderanfertigung XYZ    €45,00 [✏️][🗑️]│
│ [E-101] Eilzuschlag              €25,00 [✏️][🗑️]│
│                                  [+ Neu]        │
└────────────────────────────────────────────────┘

┌─ 🧾 Rechnungskonfiguration ────────────────────┐
│ Nächste Rechnungsnr.: [2026-0042             ] │
│ Globaler Faktor:      [1.0                   ] │
└────────────────────────────────────────────────┘

┌─ 📍 KZV-Region ────────────────────────────────┐
│ [▼ KZV Bayern                                ] │
└────────────────────────────────────────────────┘

┌─ 🌙 Dunkelmodus ───────────────────────────────┐
│ Dunkelmodus aktivieren:  [ ○──── / ────● ]    │
└────────────────────────────────────────────────┘

┌─ ❓ Hilfe & Tour ──────────────────────────────┐
│ [🎯 Tour starten]                              │
└────────────────────────────────────────────────┘
```

**Eigenpositionen-Modal:**
```
┌─ Eigenposition anlegen ────────────────────────┐
│                                                │
│ Positions-Nr.:    [E-100                     ] │
│ Bezeichnung:      [Sonderanfertigung XYZ     ] │
│ Preis (€):        [45,00                     ] │
│                                                │
│              [Abbrechen]  [Speichern]          │
└────────────────────────────────────────────────┘
```

---

### 3.7 Login-Seite

Magic-Link-Authentifizierung ohne Passwort.

#### Login-Flow

```
┌─ Labrechner ───────────────────────────────────┐
│                    🧪                          │
│               Labrechner                       │
│                                                │
│ Melden Sie sich an, um fortzufahren            │
├────────────────────────────────────────────────┤
│                                                │
│ ✉️ E-Mail:   [max@labor.de                   ] │
│                                                │
│     [🔗 Mit Magic Link anmelden]               │
│                                                │
│ ℹ️ Wir senden Ihnen einen Link per E-Mail.     │
│                                                │
├────────────────────────────────────────────────┤
│ ← Zurück zur Startseite                        │
└────────────────────────────────────────────────┘
```

**Success State:**
```
┌────────────────────────────────────────────────┐
│                    ✓                           │
│              E-Mail gesendet!                  │
│                                                │
│ Klicken Sie auf den Link in Ihrer E-Mail,      │
│ um sich anzumelden.                            │
│                                                │
│ Keine E-Mail erhalten? Spam-Ordner prüfen.     │
│                                                │
│ [← Zurück]                                     │
└────────────────────────────────────────────────┘
```

---

### 3.8 Styling-System

#### Farbschema

```
Primary (Brand):
├── brand-500: #8B5CF6 (Purple)
├── brand-600: #7C3AED
└── brand-700: #6D28D9

Secondary: indigo-600

Semantic Colors:
├── success: green-500
├── warning: amber-500
├── error: red-500
└── info: blue-500

Neutral (Slate):
├── slate-50 bis slate-950
└── Dark Mode: slate-900 Basis
```

#### Responsive Breakpoints

```
Mobile:   < 768px  (default)
Tablet:   md: ≥ 768px
Desktop:  lg: ≥ 1024px
```

#### Animationen

- `animate-fade-in` - Einblenden
- `animate-fade-in-up` - Einblenden + Nach oben
- `animate-slide-in-left/right` - Seitliches Einfahren
- `animate-pulse` - Pulsieren
- `animate-bounce` - Hüpfen
- `animate-shimmer` - Schimmer-Effekt (Loading)

---

## 4. Funktionsumfang

### 4.1 BEL-Suche

#### Suchlogik

```
Input: "Vollkrone"

1. Full-Text-Search (deutsche Sprache)
   → Matching auf name + description
   → tsvector mit 'german' Konfiguration

2. Trigram Similarity (Fuzzy)
   → pg_trgm Extension
   → Ähnlichkeit > 0.3

3. Prefix Matching
   → position_code ILIKE 'Vollkrone%'

4. Contains Matching
   → name ILIKE '%Vollkrone%'

Output: Rangliste nach Relevanz
```

#### Filter-Optionen

| Filter | Werte | Standard |
|--------|-------|----------|
| KZV-Region | 17 Bundesländer | Benutzer-Einstellung |
| Labor-Typ | Gewerbe / Praxis | Gewerbe |
| BEL-Gruppe | 8 Kategorien | Alle |

#### Input-Validierung

```typescript
// Erlaubte Zeichen
/^[a-zA-Z0-9äöüÄÖÜß\s\-]+$/

// Limits
Min. Länge: 2 Zeichen
Max. Ergebnisse: 100
Debounce: 300ms
```

---

### 4.2 KZV-Regionen (17 Bundesländer)

| ID | Code | Name | Bundesland | Status |
|----|------|------|------------|--------|
| 1 | KZVB | KZV Bayern | Bayern | ✓ 2026 |
| 2 | KZVBW | KZV Baden-Württemberg | Baden-Württemberg | ✓ 2026 |
| 3 | KZVNR | KZV Nordrhein | NRW | ✓ 2026 |
| 4 | KZVWL | KZV Westfalen-Lippe | NRW | ✓ 2026 |
| 5 | KZVHH | KZV Hamburg | Hamburg | ✓ 2026 |
| 6 | KZVRP | KZV Rheinland-Pfalz | Rheinland-Pfalz | ✓ 2026 |
| 7 | KZVSA | KZV Sachsen-Anhalt | Sachsen-Anhalt | ✓ 2026 |
| 8 | KZVSH | KZV Schleswig-Holstein | Schleswig-Holstein | ✓ 2026 |
| 9 | KZVS | KZV Sachsen | Sachsen | ✓ 2026 |
| 10 | KZVMV | KZV Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | ✓ 2026 |
| 11 | KZVTH | KZV Thüringen | Thüringen | ✓ 2026 |
| 12 | KZVN | KZV Niedersachsen | Niedersachsen | ✓ 2026 |
| 13 | KZVB | KZV Berlin | Berlin | ⚠ 2025 |
| 14 | KZVBB | KZV Brandenburg | Brandenburg | ⚠ 2025 |
| 15 | KZVHB | KZV Bremen | Bremen | ⚠ 2025 |
| 16 | KZVHE | KZV Hessen | Hessen | ⚠ 2025 |
| 17 | KZVSL | KZV Saarland | Saarland | ⚠ 2025 |

---

### 4.3 BEL-Gruppen (8 Kategorien)

| Nr. | Bereich | Name | Positionen |
|-----|---------|------|------------|
| 0 | 001-032 | Modelle & Hilfsmittel | Modelle, Artikulatoren, Transferbögen |
| 1 | 101-165 | Kronen & Brücken | Vollkronen, Teilkronen, Brückenglieder |
| 2 | 201-212 | Metallbasis | Metallgerüste für Prothesen |
| 3 | 301-384 | Prothesen | Total- und Teilprothesen |
| 4 | 401-404 | Schienen | Aufbissschienen, Knirscherschienen |
| 5 | 501-521 | UKPS | Unterkiefer-Protrusionsschienen |
| 7 | 701-751 | KFO | Kieferorthopädische Leistungen |
| 8 | 801-870 | Instandsetzung | Reparaturen und Erweiterungen |

> **Hinweis:** Gruppe 6 existiert im BEL-II nicht.

---

### 4.4 Labor-Typen

| Typ | Beschreibung | Preise |
|-----|--------------|--------|
| **Gewerbelabor** | Eigenständiges Dentallabor | Höhere Preise (Standard) |
| **Praxislabor** | In Zahnarztpraxis integriert | Niedrigere Preise (~5% günstiger) |

**Preisberechnung:**
```typescript
praxisPreis = gewerbePreis * 0.95
privatPreis = basisPreis * privatFaktor
endPreis = basisPreis * globalerFaktor
```

---

### 4.5 Authentifizierung

#### Magic Link (Passwordless)

```
Flow:
1. Benutzer gibt E-Mail ein
2. Supabase sendet Magic Link
3. Benutzer klickt Link in E-Mail
4. Automatischer Login + Redirect zu /app
5. Session Cookie wird gesetzt
```

**Technische Details:**
- Provider: Supabase Auth (OTP)
- Session: JWT in HTTP-only Cookie
- Refresh: Automatisch bei Ablauf
- Timeout: 1 Stunde inaktiv

---

### 4.6 RBAC (Role-Based Access Control)

#### Rollen

| Rolle | Beschreibung | Rechte |
|-------|--------------|--------|
| `user` | Standard-Benutzer | Normale App-Nutzung |
| `beta_tester` | Early-Adopter | Zugang zu Beta-Features |
| `admin` | Administrator | Alle Rechte, Bypass Limits |

#### Berechtigungsprüfung

```typescript
// Hook: useUser()
const { isAdmin, hasBetaAccess, canBypassLimits } = useUser();

// Funktionen
isAdmin(settings) // role === "admin"
isBetaTester(settings) // role === "beta_tester"
hasBetaAccess(settings) // admin ODER beta_tester
canBypassLimits(settings) // admin only
```

---

### 4.7 Subscription-Modell (3 Stufen)

#### Preisübersicht

| Plan | Preis | Abrechnung |
|------|-------|------------|
| **Free** | €0 | - |
| **Professional** | €49 | /Monat |
| **Enterprise** | €79 | /Monat |

#### Feature-Limits

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Rechnungen/Monat | 5 | Unbegrenzt | Unbegrenzt |
| Kunden | 10 | Unbegrenzt | Unbegrenzt |
| Vorlagen | 3 | 50 | Unbegrenzt |
| KI-Vorschläge/Monat | 10 | 100 | Unbegrenzt |
| Multi-User | - | - | 5 Benutzer |
| API-Zugang | - | - | ✓ |
| Custom Branding | - | - | ✓ |

#### Jahres-Rabatt

Bei jährlicher Zahlung: **-20%** Rabatt

| Plan | Monatlich | Jährlich (pro Monat) |
|------|-----------|---------------------|
| Professional | €49 | €39,20 |
| Enterprise | €79 | €63,20 |

---

### 4.8 KI-Integration (OpenAI)

#### Einsatzbereiche

1. **Positionsvorschläge** - Vorschläge für fehlende BEL-Positionen
2. **Template-Optimierung** - Analyse bestehender Vorlagen
3. **Komplette Workflows** - Arbeitsschritte mit Positionen

#### API-Konfiguration

```typescript
Model: gpt-4o-mini
Temperature: 0.3 (konsistent)
Max Tokens: 1000
Rate Limit: 10 Anfragen/Minute pro IP
```

#### Response-Format

```json
{
  "suggestions": [
    {
      "positionCode": "0010",
      "name": "Modell",
      "reason": "Basis für jede Versorgung",
      "confidence": 0.95
    }
  ],
  "explanation": "Für eine Vollkrone werden typischerweise..."
}
```

---

### 4.9 PDF-Rechnungserstellung

#### Technologie

- **Library:** @react-pdf/renderer v4.3.2
- **Format:** DIN A4
- **Inhalt:** Rechnungskopf, Positionen, Summen, Fußzeile

#### Rechnungsinhalt

```
┌─────────────────────────────────────────────────┐
│ [LOGO]              Dental Labor Mustermann     │
│                     Laborstraße 42              │
│                     12345 Musterstadt           │
├─────────────────────────────────────────────────┤
│ Rechnung Nr.: 2026-0042                         │
│ Datum: 24.01.2026                               │
│ Fällig: 07.02.2026                              │
├─────────────────────────────────────────────────┤
│ An:                                             │
│ Zahnarztpraxis Dr. Meier                        │
│ Hauptstraße 1                                   │
│ 80331 München                                   │
├─────────────────────────────────────────────────┤
│ Pos  Bezeichnung              Menge   Preis     │
│ 0010 Modell                   2       16,90 €   │
│ 1021 Vollkrone/Metall         1      125,00 €   │
│ 1031 Verblendung              1       45,00 €   │
├─────────────────────────────────────────────────┤
│                          Netto:     186,90 €    │
│                          MwSt 7%:    13,08 €    │
│                          GESAMT:    199,98 €    │
├─────────────────────────────────────────────────┤
│ Bankverbindung:                                 │
│ Sparkasse Musterstadt                           │
│ IBAN: DE89 3704 0044 0532 0130 00               │
│ BIC: COBADEFFXXX                                │
└─────────────────────────────────────────────────┘
```

---

### 4.10 Dark/Light Mode

#### Implementierung

- **Library:** next-themes v0.4.4
- **Speicherung:** localStorage
- **Steuerung:** Toggle-Button in Header

#### CSS-Klassen

```css
/* Light Mode (Default) */
.bg-white, .text-slate-900

/* Dark Mode */
.dark .bg-slate-900, .dark .text-white
```

---

## 5. Projektstruktur

### 5.1 Ordnerübersicht

```
Labrechner/
├── website-app/                    # Next.js Applikation
│   ├── src/
│   │   ├── app/                    # App Router (Pages)
│   │   ├── components/             # React-Komponenten
│   │   ├── hooks/                  # Custom Hooks
│   │   ├── lib/                    # Utilities & Clients
│   │   ├── types/                  # TypeScript-Definitionen
│   │   └── middleware.ts           # Auth Middleware
│   ├── public/                     # Static Assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── supabase/
│   └── migrations/                 # Datenbank-Migrationen
├── BEL 2026/                       # BEL-Quelldaten (CSV)
├── CLAUDE.md                       # Projekt-Kontext
├── STATUS.md                       # Aktueller Status
└── .env.example                    # Umgebungsvariablen-Template
```

---

### 5.2 App-Verzeichnis (Next.js App Router)

```
website-app/src/app/
├── (marketing)/                    # Öffentliche Seiten
│   ├── page.tsx                    # Landing Page (/)
│   ├── agb/page.tsx                # AGB
│   ├── datenschutz/page.tsx        # Datenschutz
│   └── impressum/page.tsx          # Impressum
├── (app)/                          # Geschützter Bereich
│   ├── app/page.tsx                # Dashboard (/app)
│   ├── app/settings/page.tsx       # Einstellungen
│   ├── dashboard/page.tsx          # ERP Dashboard
│   └── layout.tsx                  # App-Layout
├── (auth)/                         # Auth-Seiten
│   ├── login/page.tsx              # Login
│   └── magic-link/                 # Magic Link Handler
├── api/                            # API-Routes
│   ├── ai/suggestions/route.ts     # KI-Vorschläge
│   └── stripe/                     # Stripe Webhooks
│       ├── checkout/route.ts
│       ├── portal/route.ts
│       └── webhook/route.ts
├── auth/callback/route.ts          # OAuth Callback
├── layout.tsx                      # Root Layout
└── globals.css                     # Globale Styles
```

---

### 5.3 Komponenten-Verzeichnis

```
website-app/src/components/
├── landing/                        # Landing Page
│   ├── Navbar.tsx                  # Navigation
│   ├── Hero.tsx                    # Hero-Section
│   ├── Features.tsx                # Feature-Grid
│   ├── Pricing.tsx                 # Preistabelle
│   ├── RegionTicker.tsx            # Regionen-Ticker
│   ├── WaitlistSection.tsx         # E-Mail-Sammlung
│   ├── InvoiceAnimation.tsx        # Demo-Animation
│   ├── Footer.tsx                  # Footer
│   └── CookieBanner.tsx            # Cookie-Consent
├── search/                         # BEL-Suche
│   ├── SearchBar.tsx               # Suchfeld
│   ├── FilterPanel.tsx             # Filter-Sidebar
│   ├── SearchResults.tsx           # Ergebnisliste
│   └── PriceCard.tsx               # Preis-Karte
├── dashboard/                      # Dashboard-Views
│   ├── DashboardLayout.tsx         # Haupt-Layout
│   ├── SearchView.tsx              # Suche-Tab
│   ├── ClientsView.tsx             # Kunden-Tab
│   ├── TemplatesView.tsx           # Vorlagen-Tab
│   ├── SettingsView.tsx            # Einstellungen-Tab
│   └── InvoicesView.tsx            # Rechnungen-Tab
├── ui/                             # Basis-Komponenten
│   ├── Button.tsx                  # Button-Varianten
│   └── ThemeToggle.tsx             # Dark Mode Toggle
├── pdf/                            # PDF-Generierung
│   └── InvoicePDF.tsx              # Rechnungs-PDF
├── subscription/                   # Abo-Verwaltung
│   ├── PricingCard.tsx
│   ├── PricingSection.tsx
│   └── SubscriptionStatus.tsx
├── ai/                             # KI-Features
│   └── AIAssistant.tsx             # KI-Komponente
├── layout/                         # Layout-Komponenten
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   └── WaitlistForm.tsx
└── providers/                      # Context Provider
    └── ThemeProvider.tsx           # next-themes
```

---

### 5.4 Hooks-Verzeichnis

```
website-app/src/hooks/
├── useSearch.ts           # BEL-Positionssuche (162 Zeilen)
│   └── RPC: search_bel_positions()
├── useUser.ts             # User & Settings (136 Zeilen)
│   └── RBAC: isAdmin, hasBetaAccess
├── useSubscription.ts     # Stripe Abo (137 Zeilen)
│   └── canUseFeature(), needsUpgrade()
├── useAISuggestions.ts    # OpenAI Integration (109 Zeilen)
│   └── getSuggestions(), acceptSuggestion()
├── useClients.ts          # Kunden-CRUD
├── useInvoices.ts         # Rechnungs-Management
├── useTemplates.ts        # Vorlagen-Management
├── useFavorites.ts        # Favoriten-Liste
└── usePDFGenerator.ts     # PDF-Erstellung
```

---

### 5.5 Lib-Verzeichnis

```
website-app/src/lib/
├── supabase/
│   ├── client.ts          # Browser Supabase Client
│   ├── server.ts          # Server Supabase Client
│   └── middleware.ts      # Auth + Rate Limiting (139 Zeilen)
├── stripe/
│   ├── client.ts          # Stripe.js Client
│   ├── config.ts          # Subscription Plans (113 Zeilen)
│   └── server.ts          # Stripe Server (Webhooks)
└── utils.ts               # Hilfsfunktionen
```

---

### 5.6 Types-Verzeichnis

```
website-app/src/types/
├── database.ts            # Supabase Types (649 Zeilen)
│   └── Auto-generiert: Alle 13 Tabellen
├── bel.ts                 # BEL-spezifisch (125 Zeilen)
│   ├── BEL_GROUPS Konstante (8 Gruppen)
│   ├── KZV_REGIONS Konstante (17 KZVs)
│   └── Preis-Hilfsfunktionen
└── erp.ts                 # ERP-Module
    └── Invoice, Client, Template Types
```

---

### 5.7 Dependencies (package.json)

#### Core Framework

| Package | Version | Beschreibung |
|---------|---------|--------------|
| next | 16.1.3 | React Framework |
| react | 18.3.1 | UI-Library |
| typescript | 5.7.2 | Type Safety |

#### Backend & Auth

| Package | Version | Beschreibung |
|---------|---------|--------------|
| @supabase/ssr | 0.5.2 | Supabase SSR Integration |
| @supabase/supabase-js | 2.47.10 | Supabase Client |

#### State & Forms

| Package | Version | Beschreibung |
|---------|---------|--------------|
| @tanstack/react-query | 5.62.7 | Data Fetching & Caching |
| react-hook-form | 7.54.2 | Form Management |
| zod | 3.24.1 | Schema Validation |

#### Payments

| Package | Version | Beschreibung |
|---------|---------|--------------|
| stripe | 20.2.0 | Stripe Server SDK |
| @stripe/stripe-js | 8.6.4 | Stripe Client SDK |

#### AI

| Package | Version | Beschreibung |
|---------|---------|--------------|
| openai | 6.16.0 | OpenAI API Client |

#### UI & Styling

| Package | Version | Beschreibung |
|---------|---------|--------------|
| tailwindcss | 3.4.17 | CSS Framework |
| lucide-react | 0.468.0 | Icons |
| next-themes | 0.4.4 | Dark Mode |
| class-variance-authority | 0.7.1 | Component Variants |
| tailwind-merge | 2.6.0 | Class Merging |
| tailwindcss-animate | 1.0.7 | Animationen |

#### PDF

| Package | Version | Beschreibung |
|---------|---------|--------------|
| @react-pdf/renderer | 4.3.2 | PDF-Generierung |

#### Dev Tools

| Package | Version | Beschreibung |
|---------|---------|--------------|
| eslint | 8.57.1 | Linting |
| tsx | 4.21.0 | TypeScript Executor |
| autoprefixer | 10.4.20 | CSS Prefixes |
| postcss | 8.4.49 | CSS Processing |

---

## 6. Datenbank & Preisstruktur

### 6.1 Tabellen-Schema (13 Tabellen)

#### BEL-Kerntabellen

```sql
-- 1. KZV-Regionen (17 Bundesländer)
kzv_regions
├── id (SERIAL PK)
├── code (VARCHAR UNIQUE) → "KZVB", "KZVNR"
├── name → "KZV Bayern"
└── bundesland → "Bayern"

-- 2. BEL-Gruppen (8 Kategorien)
bel_groups
├── id (SERIAL PK)
├── group_number (0-8, ohne 6)
├── name
├── description
└── position_range → "001-032"

-- 3. BEL-Positionen (~155 Leistungen)
bel_positions
├── id (SERIAL PK)
├── position_code (VARCHAR UNIQUE) → "0010"
├── name
├── description
├── group_id (FK → bel_groups)
├── is_ukps (Boolean)
├── is_implant (Boolean)
└── created_at, updated_at

-- 4. BEL-Preise (Position × KZV × Labortyp)
bel_prices
├── id (SERIAL PK)
├── position_id (FK)
├── kzv_id (FK)
├── labor_type (ENUM: 'gewerbe' | 'praxis')
├── price (DECIMAL 10,2)
├── valid_from (DATE)
└── valid_until (DATE, nullable)
```

#### Festzuschuss-Tabellen

```sql
-- 5. Festzuschuss-Befunde (40+ Befundnummern)
festzuschuss_befunde
├── id, befund_nummer (z.B. "1.1", "7.7")
├── befund_klasse (1-7)
└── bezeichnung, beschreibung

-- 6. Festzuschuss-Preise (pro Kassenart)
festzuschuss_preise
├── befund_id (FK)
├── kassenart (1=60%, 2=70%, 3=75%, 4=100%)
├── prozent, preis
└── valid_from, valid_until

-- 7. Kombinierbarkeit
festzuschuss_kombinierbarkeit
├── befund_id_1, befund_id_2
└── kombination_typ
```

#### User-Tabellen (RLS-geschützt)

```sql
-- 8. Benutzer-Einstellungen
user_settings
├── id, user_id (FK auth.users)
├── kzv_id, labor_type
├── Lab-Stammdaten: lab_name, street, city, tax_id, vat_id
├── Bank: bank_name, iban, bic
├── Rechnung: next_invoice_number, global_factor
├── Stripe: customer_id, subscription_id, status, plan
└── role (ENUM: 'user' | 'admin' | 'beta_tester')

-- 9. Favoriten
favorites
├── user_id, position_id
└── UNIQUE(user_id, position_id)

-- 10. Kunden (Zahnärzte)
clients
├── user_id, customer_number
├── salutation, title, first_name, last_name
├── practice_name, street, postal_code, city
└── phone, email, notes

-- 11. Eigenpositionen
custom_positions
├── user_id, position_code (z.B. "E001")
├── name, description, default_price
└── UNIQUE(user_id, position_code)

-- 12. Vorlagen
templates
├── user_id, name, description
└── icon, color

-- 13. Vorlagen-Positionen
template_items
├── template_id (FK)
├── position_id | custom_position_id
├── quantity, factor, custom_price
└── sort_order

-- 14. Rechnungen
invoices
├── user_id, invoice_number
├── client_id (FK), client_snapshot, lab_snapshot
├── kzv_id, labor_type
├── invoice_date, due_date
├── status (draft, sent, paid, overdue, cancelled)
├── subtotal, tax_rate, tax_amount, total
└── pdf_url, sent_at, paid_at

-- 15. Rechnungspositionen
invoice_items
├── invoice_id (FK)
├── position_id | custom_position_id
├── position_code, position_name (Snapshot)
├── quantity, factor, unit_price, line_total
└── notes, sort_order
```

---

### 6.2 RPC-Funktionen

#### search_bel_positions()

```sql
-- Suche nach BEL-Positionen mit Ranking
FUNCTION search_bel_positions(
  search_query VARCHAR,
  user_kzv_id INTEGER DEFAULT NULL,
  user_labor_type VARCHAR DEFAULT 'gewerbe',
  group_filter INTEGER DEFAULT NULL,
  result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id INTEGER,
  position_code VARCHAR,
  name VARCHAR,
  description TEXT,
  group_id INTEGER,
  group_name VARCHAR,
  price DECIMAL,
  is_ukps BOOLEAN,
  is_implant BOOLEAN,
  rank REAL
)
```

**Such-Algorithmus:**
1. Full-Text-Search (tsvector, german)
2. Trigram Similarity (> 0.3)
3. Prefix Match auf position_code
4. Contains Match auf name

#### get_position_prices()

```sql
-- Alle KZV-Preise für eine Position
FUNCTION get_position_prices(
  pos_code VARCHAR,
  labor VARCHAR DEFAULT 'gewerbe'
)
RETURNS TABLE (
  kzv_code VARCHAR,
  kzv_name VARCHAR,
  bundesland VARCHAR,
  price DECIMAL
)
```

---

### 6.3 Datenmengen

| Tabelle | Zeilen | Beschreibung |
|---------|--------|--------------|
| kzv_regions | 17 | Alle Bundesländer |
| bel_groups | 8 | BEL-Kategorien (ohne 6) |
| bel_positions | ~155 | Standard-Leistungen |
| bel_prices | 3.663 | Position × KZV × Labortyp |
| festzuschuss_befunde | 40+ | Festzuschuss-Befunde |
| festzuschuss_preise | ~160 | 40 × 4 Kassenarten |

---

### 6.4 Preisberechnungslogik

#### Basispreise

```
Preis = bel_prices.price
  WHERE position_id = X
    AND kzv_id = Y
    AND labor_type = 'gewerbe' | 'praxis'
    AND valid_from <= TODAY
    AND (valid_until IS NULL OR valid_until >= TODAY)
```

#### Praxislabor-Berechnung

```typescript
// Praxislabor ist ~5% günstiger als Gewerbelabor
praxisPreis = gewerbePreis * 0.95
```

#### Privatpreise

```typescript
// Privatpreise mit Faktor (Standard: 1.0)
privatPreis = basisPreis * privatFaktor
```

#### Endpreis mit globalem Faktor

```typescript
// Globaler Aufschlag (z.B. 1.1 = 10% Aufschlag)
endPreis = basisPreis * globalerFaktor
```

#### Steuerberechnung

```typescript
// Standard-MwSt für zahntechnische Leistungen: 7%
nettoPreis = endPreis
mwSt = nettoPreis * 0.07
bruttoPreis = nettoPreis + mwSt
```

---

### 6.5 BEL-Quelldaten (CSV-Format)

#### Verfügbare Bundesländer

| Bundesland | CSV-Format | Spalten | Status |
|------------|-----------|---------|--------|
| Bayern | Standard | Basis + KFO | ✓ 2026 |
| Baden-Württemberg | Dual | Praxis + Gewerbe | ✓ 2026 |
| NRW | Standard | Basis | ✓ 2026 |
| Hamburg | Mit Multiplikatoren | Basis + Kassenfaktoren | ✓ 2026 |
| Rheinland-Pfalz | Erweitert | 14 Spalten + KFO | ✓ 2026 |
| Sachsen-Anhalt | Standard | Basis + KFO | ✓ 2026 |
| Schleswig-Holstein | Standard | Basis + KFO | ✓ 2026 |
| Berlin, Brandenburg, Bremen, Hessen, Saarland | - | - | ⚠ 2025 |

#### CSV-Spalten (Rheinland-Pfalz Beispiel)

```csv
Kürzel | Nr. | Bezeichnung | Kassenart |
Preis Kons Praxis | Preis Kons Gewerbe |
Preis ZE Praxis | Preis ZE Gewerbe |
Preis KFO Praxis | Preis KFO Gewerbe |
Preis KB Praxis | Preis KB Gewerbe |
Preis PA Praxis | Preis PA Gewerbe
```

---

## 7. Technischer Stack

### 7.1 Frontend

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| **Next.js** | 16.1.3 | React Framework mit App Router |
| **React** | 18.3.1 | UI-Library |
| **TypeScript** | 5.7.2 | Type-Safety |
| **Tailwind CSS** | 3.4.17 | Utility-First CSS |
| **Lucide React** | 0.468.0 | Icon-Library (1000+ Icons) |
| **next-themes** | 0.4.4 | Dark/Light Mode |

### 7.2 Backend

| Technologie | Verwendung |
|-------------|------------|
| **Supabase** | PostgreSQL + Auth + Realtime + Storage |
| **Supabase RLS** | Row Level Security für Datenschutz |
| **PostgreSQL Extensions** | pg_trgm (Fuzzy Search), tsvector (FTS) |
| **Edge Functions** | API-Routes in Vercel |

### 7.3 Payments

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| **Stripe** | 20.2.0 | Server-Side Payments |
| **Stripe.js** | 8.6.4 | Client-Side Checkout |
| **Stripe Webhooks** | - | Subscription-Updates |

### 7.4 KI

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| **OpenAI** | 6.16.0 | GPT-4o-mini API |
| **Model** | gpt-4o-mini | Positionsvorschläge |

### 7.5 Deployment

| Service | Verwendung |
|---------|------------|
| **Vercel** | Hosting + Edge Functions |
| **GitHub** | Version Control |
| **Supabase Cloud** | Managed PostgreSQL |

### 7.6 Sicherheit

| Maßnahme | Implementierung |
|----------|-----------------|
| **HTTPS** | HSTS Header (1 Jahr) |
| **CSP** | Content Security Policy |
| **XSS-Schutz** | X-XSS-Protection Header |
| **Clickjacking** | X-Frame-Options: DENY |
| **Rate Limiting** | 100 Requests/Minute pro IP |
| **RLS** | Row Level Security auf allen User-Tabellen |
| **Webhook Signatur** | HMAC-SHA256 Verifizierung |

---

## 8. Aktueller Status

### 8.1 Projektphase

| Metrik | Wert |
|--------|------|
| **Phase** | 6 - Launch Preparation |
| **Datum** | 24. Januar 2026 |
| **Build** | OK |
| **Blocker** | Keine |

### 8.2 Launch Checklist

#### Tier 1 - Ohne diese kein Launch

- [x] Stripe Products erstellen (Starter €0, Pro €49, Enterprise €79)
- [x] Vercel Root Directory auf `website-app` setzen
- [ ] Vercel Environment Variables setzen
- [ ] Stripe Webhook URL konfigurieren
- [ ] Domain kaufen + DNS konfigurieren

#### Tier 2 - Vor Beta-Launch

- [ ] OpenAI Usage Limits setzen ($50/Monat)
- [ ] RLS Policies verifizieren
- [ ] Production Build testen

#### Tier 3 - Vor Public Launch

- [ ] Legal Pages mit echten Firmendaten
- [ ] E2E Testing (Login → Rechnung → PDF → Zahlung)

### 8.3 Letzte Session (24.01 - Session 6)

- Stripe Products erstellt (3 Preisstufen)
- `.env.local` mit allen Keys konfiguriert
- Preise in UI aktualisiert (Pro: 49€, Business: 79€)
- Doppelter Header entfernt (Marketing Layout bereinigt)
- KZV Dropdown Kontrast verbessert
- Vercel Root Directory auf `website-app` gesetzt → Deployment funktioniert

### 8.4 Known Issues

| Issue | Priorität | Status |
|-------|-----------|--------|
| 5 KZVs haben nur 2025-Daten | Medium | Offen |
| Hamburg Multiplikatoren nicht implementiert | Low | Backlog |
| Tour/Onboarding nicht implementiert | Low | Backlog |
| Mikrofon/Spracheingabe nicht implementiert | Low | Backlog |
| KI-Chatbot Interface nicht implementiert | Low | Backlog |

### 8.5 Backlog (Post-Launch)

| Feature | Beschreibung |
|---------|--------------|
| Chat-Interface für KI | Conversational BEL-Assistent |
| Festzuschuss-Rechner | Kassenanteil berechnen |
| Hamburg-Kalkulator | Kassenspezifische Multiplikatoren |
| KI-Mehrwert-Tracking | Nutzungsanalyse |
| Referral-System | Empfehlungsprogramm |
| Tour/Onboarding | Interaktive Einführung |

---

## 9. Links & Ressourcen

### 9.1 Service-URLs

| Service | URL |
|---------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz |
| **GitHub Repository** | https://github.com/OnePieceMonkey/Labrechner |
| **Vercel Deployment** | https://labrechner.vercel.app |
| **Stripe Dashboard** | https://dashboard.stripe.com |

### 9.2 Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/OnePieceMonkey/Labrechner.git
cd Labrechner

# Dependencies installieren
cd website-app
npm install

# Umgebungsvariablen kopieren
cp .env.example .env.local
# → Werte eintragen

# Dev Server starten
npm run dev
# → http://localhost:3000

# Production Build
npm run build
npm start
```

### 9.3 Umgebungsvariablen

```bash
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://yaxfcbokfyrcdgaiyrxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***
STRIPE_PRICE_PROFESSIONAL=price_***
STRIPE_PRICE_ENTERPRISE=price_***

# OPENAI
OPENAI_API_KEY=sk-***

# APP
NEXT_PUBLIC_APP_URL=https://labrechner.de
```

### 9.4 Projekt-Dateien

| Datei | Beschreibung |
|-------|--------------|
| `CLAUDE.md` | Projekt-Kontext für KI-Assistenten |
| `STATUS.md` | Aktueller Projektstatus |
| `.env.example` | Template für Umgebungsvariablen |

---

## Anhang: Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                     LABRECHNER ARCHITEKTUR                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND (Next.js 14)                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │   Landing   │  │  Dashboard  │  │    Auth     │     │   │
│  │  │    Page     │  │   (App)     │  │   (Login)   │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  │         │                │                │             │   │
│  │         └────────────────┴────────────────┘             │   │
│  │                         │                               │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │              React Components                    │   │   │
│  │  │  Search │ Clients │ Templates │ Settings │ PDF  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                         │                               │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                Custom Hooks                      │   │   │
│  │  │ useSearch │ useUser │ useSubscription │ useAI   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  API ROUTES (Edge)                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │     AI       │  │    Stripe    │  │     Auth     │   │   │
│  │  │ Suggestions  │  │   Webhook    │  │   Callback   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐    │
│  │   Supabase  │      │   Stripe    │      │   OpenAI    │    │
│  │  PostgreSQL │      │  Payments   │      │  GPT-4o-mini│    │
│  │  Auth + RLS │      │  Webhooks   │      │  API        │    │
│  └─────────────┘      └─────────────┘      └─────────────┘    │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   DATENBANK-SCHEMA                       │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐     │   │
│  │  │   BEL-DATEN      │  │      USER-DATEN (RLS)    │     │   │
│  │  │  • kzv_regions   │  │  • user_settings         │     │   │
│  │  │  • bel_groups    │  │  • clients               │     │   │
│  │  │  • bel_positions │  │  • templates             │     │   │
│  │  │  • bel_prices    │  │  • invoices              │     │   │
│  │  │  • festzuschuss  │  │  • favorites             │     │   │
│  │  └──────────────────┘  └──────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    DEPLOYMENT                            │   │
│  │  Vercel (Edge) ← GitHub (CI/CD) ← Local Development     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Dokumentation erstellt am:** 24. Januar 2026
**Autor:** Claude Code (Automatisch generiert)
**Version:** 1.0
