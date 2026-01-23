# Labrechner – Agent-Orchestrator

> Dieses Dokument definiert das Agent-System für das Labrechner-Projekt.

---

## Schnellreferenz: Agent-Aktivierung

| Kürzel | Agent | Aktivierung |
|--------|-------|-------------|
| **CPO:** | Chief Product Officer | Produkt-Strategie, Features, PRD |
| **BRAND:** | Brand Director | Design, Texte, Voice, UI-Copy |
| **FE:** | Frontend Engineer | React, Next.js, UI-Komponenten |
| **BE:** | Backend Engineer | Supabase, API, Datenbank, n8n |
| **LEGAL:** | Legal Officer | DSGVO, Impressum, AGB |
| **MKTG:** | Marketing Lead | Landing Page, SEO, E-Mails |
| **QA:** | QA Analyst | Testing, Datenprüfung, Research |

---

## Agent-Hierarchie

```
┌─────────────────────────────────────────────────────────────────┐
│                         CEO (Patrick)                           │
│              Entscheidungen, Vision, Beta-Kontakte              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌─────────┐         ┌─────────┐          ┌─────────┐
│  CPO:   │         │ BRAND:  │          │  BE:    │
│Strategie│         │ Design  │          │  Tech   │
└────┬────┘         └────┬────┘          └────┬────┘
     │                   │                    │
     ▼                   │               ┌────┴────┐
┌─────────┐              │               │         │
│ MKTG:   │              │               ▼         ▼
│Marketing│              │          ┌─────────┐ ┌─────────┐
└─────────┘              │          │  FE:    │ │ LEGAL:  │
                         │          │Frontend │ │Compliance│
                         │          └─────────┘ └─────────┘
                         │
                         ▼
                    ┌─────────┐
                    │  QA:    │
                    │ Testing │
                    └─────────┘
```

---

## Wann welchen Agent nutzen?

### Produkt & Strategie

| Aufgabe | Agent |
|---------|-------|
| Feature priorisieren | **CPO:** |
| User Story schreiben | **CPO:** |
| PRD erstellen | **CPO:** |
| MVP-Scope definieren | **CPO:** |

### Design & Content

| Aufgabe | Agent |
|---------|-------|
| UI-Texte formulieren | **BRAND:** |
| Farben/Fonts anwenden | **BRAND:** |
| Landing Page Copy | **BRAND:** oder **MKTG:** |
| E-Mail-Texte | **MKTG:** |
| SEO-Keywords | **MKTG:** |

### Technische Entwicklung

| Aufgabe | Agent |
|---------|-------|
| Komponente bauen | **FE:** |
| Styling mit Tailwind | **FE:** |
| Supabase Schema | **BE:** |
| API-Funktion | **BE:** |
| n8n Workflow | **BE:** |
| Daten importieren | **BE:** |

### Rechtliches

| Aufgabe | Agent |
|---------|-------|
| Impressum erstellen | **LEGAL:** |
| Datenschutzerklärung | **LEGAL:** |
| DSGVO-Check | **LEGAL:** |
| AGB-Entwurf | **LEGAL:** |

### Qualität & Research

| Aufgabe | Agent |
|---------|-------|
| Daten verifizieren | **QA:** |
| Testfälle schreiben | **QA:** |
| KZV-Quellen finden | **QA:** |
| Bugs dokumentieren | **QA:** |
| Wettbewerber beobachten | **QA:** |

---

## Skill-Abhängigkeiten

```
┌─────────────────────────────────────────────────────────────┐
│                    WISSENS-SKILLS                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│ labrechner-     │ bel-            │ labrechner-             │
│ brand           │ abrechnungs-    │ tech                    │
│                 │ wissen          │                         │
│ • Farben        │ • BEL-Gruppen   │ • Stack                 │
│ • Fonts         │ • KZVen         │ • Schema                │
│ • Voice         │ • Preislogik    │ • API                   │
└────────┬────────┴────────┬────────┴────────┬────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    AGENT-SKILLS                             │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│ CPO     │ BRAND   │ FE      │ BE      │ LEGAL   │ MKTG    │
│         │         │         │         │         │         │
│ nutzt:  │ nutzt:  │ nutzt:  │ nutzt:  │ nutzt:  │ nutzt:  │
│ • tech  │ • brand │ • tech  │ • tech  │ • tech  │ • brand │
│ • bel   │ • bel   │ • brand │ • bel   │ • bel   │ • bel   │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## Beispiel-Workflows

### Feature entwickeln (End-to-End)

```
1. CPO: User Story definieren
2. FE: Komponenten bauen
3. BE: API implementieren
4. BRAND: UI-Texte formulieren
5. QA: Testen und verifizieren
6. LEGAL: Datenschutz prüfen (falls nötig)
```

### Landing Page erstellen

```
1. CPO: Value Proposition definieren
2. MKTG: Struktur und Copy schreiben
3. BRAND: Texte auf Voice prüfen
4. FE: Seite implementieren
5. LEGAL: Impressum, Datenschutz
6. QA: Links und Daten prüfen
```

### BEL-Daten aktualisieren

```
1. QA: Neue Preisliste von KZV finden
2. BE: Import-Workflow ausführen
3. QA: Daten verifizieren
4. CPO: Release Notes (falls relevant)
```

---

## Prompt-Beispiele

### Multi-Agent-Aufgabe

```
"CPO: Definiere die User Story für BEL-Export,
 dann FE: implementiere den Export-Button"
```

### Agent-Wechsel

```
"BRAND: Formuliere den Button-Text für Export"
[Antwort]
"FE: Baue jetzt den Button mit diesem Text"
```

### Kontext-Weitergabe

```
"BE: Schau dir das Schema an. QA: Erstelle dann Testfälle dafür"
```

---

## MCP-Übersicht nach Agent

| Agent | Primäre MCPs |
|-------|--------------|
| CPO | Notion, Google Drive |
| BRAND | Web Search, Vercel |
| FE | Vercel, Supabase, Context7 |
| BE | Supabase, n8n, Firecrawl, Context7 |
| LEGAL | Web Search, Perplexity |
| MKTG | Web Search, Notion, Perplexity |
| QA | Firecrawl, Web Search, Supabase, Tavily |

---

## Agent-Dateien

```
Skills/agents/
├── ORCHESTRATOR.md          ← Du bist hier
├── cpo/
│   └── SKILL.md
├── brand-director/
│   └── SKILL.md
├── frontend-engineer/
│   └── SKILL.md
├── backend-engineer/
│   └── SKILL.md
├── legal-officer/
│   └── SKILL.md
├── marketing-lead/
│   └── SKILL.md
└── qa-analyst/
    └── SKILL.md
```

---

*Orchestrator-Version: 1.0*
*Projekt: Labrechner*
