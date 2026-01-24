# Labrechner – Claude Organisation & MCP-Struktur

**Stand:** Januar 2025  
**Projektordner:** `C:\Users\Scan\Desktop\KI_Directory\Labrechner`

---

## Teil 1: Verfügbare MCP-Verbindungen – Analyse

### Aktuell verbundene MCPs

| MCP | Status | Relevanz für Labrechner | Einsatzbereich |
|-----|--------|------------------------|----------------|
| **Notion** | ✅ Verbunden | ⭐⭐⭐ Hoch | Projekt-Dokumentation, PRD, Wissensmanagement |
| **n8n** | ✅ Verbunden | ⭐⭐⭐ Kritisch | Backend-Workflows, API-Integration, Automatisierung |
| **Vercel** | ✅ Verbunden | ⭐⭐⭐ Kritisch | Frontend-Deployment, Hosting, Domain-Management |
| **Supabase** | ✅ Verbunden | ⭐⭐⭐ Kritisch | Datenbank, Auth, BEL-Daten, Warteliste |
| **Firecrawl** | ✅ Verbunden | ⭐⭐ Mittel | Web-Scraping für BEL-Datenquellen |
| **Context7** | ✅ Verbunden | ⭐⭐ Mittel | Dokumentations-Lookup (Next.js, Supabase, etc.) |
| **Google Drive** | ✅ Verbunden | ⭐⭐ Mittel | Dokumenten-Speicherung, Zusammenarbeit |
| **Hostinger** | ✅ Verbunden | ⭐⭐ Mittel | DNS, Domain-Management, VPS (falls nötig) |
| **Perplexity** | ✅ Verbunden | ⭐ Niedrig | Research, Marktanalyse |
| **Tavily** | ✅ Verbunden | ⭐ Niedrig | Web-Search für Research |
| **Apify** | ✅ Verbunden | ⭐ Niedrig | Backup für Web-Scraping |
| **LinkedIn** | ✅ Verbunden | ⭐ Niedrig | Marketing später |
| **Indeed** | ✅ Verbunden | ❌ Nicht relevant | - |
| **Kiwi.com** | ✅ Verbunden | ❌ Nicht relevant | - |
| **Airbnb** | ✅ Verbunden | ❌ Nicht relevant | - |

### Empfohlene Zusätzliche MCPs

| MCP | Priorität | Warum benötigt |
|-----|-----------|----------------|
| **Stripe** | 🔴 Nach MVP | Zahlungsabwicklung für Subscriptions |
| **Resend/Loops** | 🟡 Woche 5 | E-Mail für Warteliste & Transaktional |
| **Sentry** | 🟢 Woche 6 | Error-Tracking für Beta |

---

## Teil 2: Projekt-Kontext für Claude

### Was in dieses Projekt gehört

Diese Informationen sollten im Claude-Projekt-Kontext hinterlegt sein:

#### 1. Kern-Dokumente (bereits vorhanden)
- ✅ Business Plan (compass_artifact)
- ✅ 6-Wochen-Sprintplan

#### 2. Noch zu erstellen/hinzufügen
```
/Labrechner-Projekt
├── 📋 PROJEKT-KONTEXT.md          # Dieser File – Übersicht
├── 📋 BUSINESS-PLAN.md            # ✅ Vorhanden
├── 📋 SPRINT-PLAN.md              # ✅ Vorhanden
├── 📋 PRD.md                      # Product Requirements Document
├── 📋 BRAND-GUIDELINES.md         # Farben, Fonts, Voice (Woche 1)
├── 📋 TECH-ARCHITEKTUR.md         # Supabase Schema, API-Design
├── 📋 BEL-DATENSTRUKTUR.md        # BEL-II/BEB Datenformat
└── 📋 GLOSSAR.md                  # Zahntechnik-Fachbegriffe
```

#### 3. Domänen-Wissen (als Referenz)
- BEL II Katalog-Struktur (8 Gruppen, ~155 Positionen)
- KZV-Regionen (17 Kassenzahnärztliche Vereinigungen)
- VDDS-CSV-Format für Preislisten
- Zahntechnische Fachterminologie

---

## Teil 3: Virtuelles Team – Agent-Rollen

### Übersicht der Agent-Rollen

```
┌─────────────────────────────────────────────────────────────────┐
│                         CEO (Du/Patrick)                        │
│              Entscheidungen, Vision, Beta-Kontakte              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌─────────┐         ┌─────────┐          ┌─────────┐
│  CPO    │         │ Brand   │          │  Tech   │
│Strategie│         │Director │          │  Lead   │
└────┬────┘         └────┬────┘          └────┬────┘
     │                   │                    │
     │              ┌────┴────┐          ┌────┴────┐
     │              │         │          │         │
     ▼              ▼         ▼          ▼         ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Marketing│   │Frontend │ │Backend  │ │Legal/   │ │  QA &   │
│ & Growth│   │Engineer │ │Engineer │ │Compliance│ │Research │
└─────────┘   └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

### Agent-Definitionen

#### 🎯 Agent 1: Chief Product Officer (CPO)

**Aktivierung:** "Als CPO..." oder bei Feature-Entscheidungen

**Verantwortlichkeiten:**
- PRD erstellen und pflegen
- User Stories definieren
- MVP-Scope priorisieren
- Feature-Roadmap verwalten
- Nutzer-Feedback interpretieren

**Benötigte MCPs:**
- Notion (PRD-Dokumentation)
- Google Drive (Research-Docs)

**Kontext benötigt:**
- Business Plan
- Sprint Plan
- Zielgruppen-Personas

**Beispiel-Prompts:**
- "Als CPO: Erstelle User Stories für die BEL-Suche"
- "Als CPO: Priorisiere diese Feature-Requests"

---

#### 🎨 Agent 2: Brand & Creative Director

**Aktivierung:** "Als Brand Director..." oder bei Design-Fragen

**Verantwortlichkeiten:**
- Produktname finalisieren
- Logo-Konzept entwickeln
- Farbpalette definieren
- Typografie wählen
- Brand Voice Guidelines erstellen
- UI-Tonalität festlegen

**Benötigte MCPs:**
- Web Search (Inspiration, Wettbewerber)
- Vercel (Domain-Check)

**Kontext benötigt:**
- Zielgruppen-Personas
- Wettbewerber-Analyse
- Deutsche B2B-SaaS-Standards

**Beispiel-Prompts:**
- "Als Brand Director: Entwickle 3 Namensvorschläge mit Begründung"
- "Als Brand Director: Definiere die Farbpalette für ein deutsches B2B-Tool"

**Output:** → BRAND-GUIDELINES.md (wird zum Skill)

---

#### 💻 Agent 3: Frontend Engineer

**Aktivierung:** "Als Frontend Engineer..." oder bei UI-Aufgaben

**Verantwortlichkeiten:**
- Next.js Setup & Konfiguration
- UI-Komponenten bauen
- Responsive Design
- Suche-Interface
- Chat-UI
- Landing Page

**Benötigte MCPs:**
- Vercel (Deployment)
- Supabase (API-Integration)
- Context7 (Next.js Docs)

**Kontext benötigt:**
- Brand Guidelines
- PRD / User Stories
- Tech-Architektur

**Tech Stack:**
```
Framework:    Next.js 14+ (App Router)
Styling:      Tailwind CSS
Components:   shadcn/ui
Icons:        Lucide React
State:        React Query / SWR
```

**Beispiel-Prompts:**
- "Als Frontend Engineer: Baue die Such-Komponente"
- "Als Frontend Engineer: Implementiere das Filter-System"

---

#### ⚙️ Agent 4: Backend & Data Engineer

**Aktivierung:** "Als Backend Engineer..." oder bei Daten/API-Aufgaben

**Verantwortlichkeiten:**
- Supabase Schema Design
- BEL-Daten Import & Parsing
- API-Endpoints definieren
- N8N Workflows bauen
- Row Level Security
- Performance-Optimierung

**Benötigte MCPs:**
- Supabase (Haupt-Tool)
- n8n (Workflows)
- Firecrawl (BEL-Daten scrapen)
- Context7 (Supabase Docs)

**Kontext benötigt:**
- BEL-Datenstruktur
- Tech-Architektur
- API-Spezifikation

**Tech Stack:**
```
Database:     Supabase (PostgreSQL)
Auth:         Supabase Auth (Magic Link)
Workflows:    n8n (Hostinger)
Storage:      Supabase Storage
Search:       PostgreSQL Full-Text / pg_trgm
```

**Beispiel-Prompts:**
- "Als Backend Engineer: Designe das Supabase Schema"
- "Als Backend Engineer: Baue den CSV-Import-Workflow in n8n"

---

#### ⚖️ Agent 5: Legal & Compliance Officer

**Aktivierung:** "Als Legal Officer..." oder bei Rechts-/DSGVO-Fragen

**Verantwortlichkeiten:**
- DSGVO-Compliance prüfen
- Impressum erstellen
- Datenschutzerklärung
- AGB-Entwurf
- AVV-Vorlage vorbereiten
- Disclaimer für KI-Chat

**Benötigte MCPs:**
- Web Search (Rechtliche Recherche)
- Perplexity (Tiefere Analyse)

**Kontext benötigt:**
- Business Plan (Rechtsform)
- Tech-Architektur (Datenflüsse)
- DSGVO-Anforderungen für Gesundheitsdaten

**Beispiel-Prompts:**
- "Als Legal Officer: Erstelle die Datenschutzerklärung"
- "Als Legal Officer: Prüfe das Supabase-Setup auf DSGVO"

---

#### 📈 Agent 6: Marketing & Growth Lead

**Aktivierung:** "Als Marketing Lead..." oder bei GTM-Fragen

**Verantwortlichkeiten:**
- Website-Texte (DE)
- Landing Page Copy
- SEO-Keywords
- Content-Strategie
- Beta-Tester-Kommunikation
- E-Mail-Sequenzen

**Benötigte MCPs:**
- Web Search (Keyword-Research)
- Notion (Content-Kalender)
- Perplexity (Marktanalyse)

**Kontext benötigt:**
- Brand Guidelines
- Zielgruppen-Personas
- Wettbewerber-Analyse

**Beispiel-Prompts:**
- "Als Marketing Lead: Schreibe die Hero-Section für die Landing Page"
- "Als Marketing Lead: Entwickle 5 Blog-Post-Ideen für SEO"

---

#### 🔍 Agent 7: QA & Research Analyst

**Aktivierung:** "Als QA Analyst..." oder bei Test/Research-Aufgaben

**Verantwortlichkeiten:**
- BEL-Daten verifizieren
- Edge Cases identifizieren
- User Testing koordinieren
- Bug Reports dokumentieren
- KZV-Preislisten recherchieren
- Wettbewerber monitoren

**Benötigte MCPs:**
- Firecrawl (Daten-Quellen)
- Web Search (KZV-Websites)
- Tavily (Deep Research)

**Kontext benötigt:**
- BEL-Datenstruktur
- KZV-Regionen-Liste
- Qualitätskriterien

**Beispiel-Prompts:**
- "Als QA Analyst: Verifiziere die BEL-Preise für Bayern"
- "Als QA Analyst: Erstelle Testfälle für die Suche"

---

## Teil 4: Zu erstellende Skills

### Skill 1: `labrechner-brand` (Woche 1)

**Zweck:** Brand Guidelines für konsistente Outputs

**Struktur:**
```
labrechner-brand/
├── SKILL.md
│   ├── Farbpalette
│   ├── Typografie
│   ├── Brand Voice (deutsch, B2B)
│   └── Logo-Nutzung
├── assets/
│   ├── logo.svg
│   ├── logo-favicon.svg
│   └── color-palette.png
└── references/
    └── voice-examples.md
```

**Trigger:** "Erstelle Content für Labrechner", "Landing Page", "UI-Texte"

---

### Skill 2: `bel-abrechnungswissen` (Woche 2)

**Zweck:** Domänenwissen für KI-Chat und Datenvalidierung

**Struktur:**
```
bel-abrechnungswissen/
├── SKILL.md
│   ├── BEL-II Struktur (8 Gruppen)
│   ├── KZV-Regionen (17)
│   ├── Preisberechnungslogik
│   └── Häufige Fehler
├── references/
│   ├── bel-gruppen.md
│   ├── kzv-regionen.md
│   └── abrechnungsfehler.md
└── assets/
    └── bel-struktur-diagram.png
```

**Trigger:** "BEL Position", "Abrechnung", "KZV", "Zahntechnik"

---

### Skill 3: `labrechner-tech` (Woche 2-3)

**Zweck:** Technische Architektur-Referenz

**Struktur:**
```
labrechner-tech/
├── SKILL.md
│   ├── Supabase Schema
│   ├── API-Endpoints
│   ├── N8N Workflow-Übersicht
│   └── Deployment-Prozess
├── references/
│   ├── supabase-schema.sql
│   ├── api-spec.md
│   └── n8n-workflows.md
└── scripts/
    └── import-bel-data.ts
```

**Trigger:** "Supabase", "API", "Backend", "Deployment"

---

## Teil 5: Workflow – Wie arbeiten wir zusammen?

### Standard-Arbeitsablauf

```
1. Du gibst Aufgabe/Kontext
        ↓
2. Ich identifiziere relevanten Agent
        ↓
3. Ich lade benötigte Skills/Docs
        ↓
4. Ich nutze relevante MCPs
        ↓
5. Ich liefere Output + stelle Rückfragen
        ↓
6. Du reviewst/entscheidest
        ↓
7. Ich iteriere bei Bedarf
```

### Aktivierungs-Shortcuts

| Kürzel | Agent | Beispiel |
|--------|-------|----------|
| `CPO:` | Chief Product Officer | "CPO: Priorisiere diese Features" |
| `BRAND:` | Brand Director | "BRAND: Entwickle Farbpalette" |
| `FE:` | Frontend Engineer | "FE: Baue Such-Komponente" |
| `BE:` | Backend Engineer | "BE: Designe Supabase Schema" |
| `LEGAL:` | Legal Officer | "LEGAL: Prüfe DSGVO" |
| `MKTG:` | Marketing Lead | "MKTG: Schreibe Landing Copy" |
| `QA:` | QA Analyst | "QA: Verifiziere BEL-Daten" |

### Täglicher Check-in (Empfohlen)

Am Anfang jeder Session kurz:
```
"Status-Update: Wir sind in Woche X, Fokus ist [Thema].
Heute möchte ich [Aufgabe]."
```

---

## Teil 6: Nächste Schritte

### Sofort (Heute)

1. [ ] **Dieses Dokument im Projekt speichern**
2. [ ] **PRD-Grundgerüst erstellen** (CPO-Agent)
3. [ ] **Brand-Exploration starten** (Name, erste Farbideen)

### Diese Woche (Woche 1)

4. [ ] Domain recherchieren & sichern
5. [ ] Brand Guidelines finalisieren
6. [ ] `labrechner-brand` Skill erstellen
7. [ ] Tech-Setup (Supabase, Vercel, Repo)

### Woche 2

8. [ ] BEL-Datenstruktur dokumentieren
9. [ ] `bel-abrechnungswissen` Skill erstellen
10. [ ] Supabase Schema implementieren
11. [ ] Erste BEL-Daten importieren

---

## Anhang: MCP-Nutzung nach Phase

| Phase | Primäre MCPs | Sekundäre MCPs |
|-------|--------------|----------------|
| Woche 1 (Brand) | Vercel, Web Search | Notion |
| Woche 2 (Daten) | Supabase, Firecrawl | n8n, Context7 |
| Woche 3 (Backend) | Supabase, n8n | Context7 |
| Woche 4 (Frontend) | Vercel, Supabase | Context7 |
| Woche 5 (Marketing) | Notion, Web Search | Vercel |
| Woche 6 (Beta) | Supabase, Vercel | Alle |

---

**Dokument erstellt:** 16. Januar 2025  
**Nächste Review:** Ende Woche 1
