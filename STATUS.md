# LABRECHNER – Projekt-Status

> **Stand:** 22. Januar 2026 | **Sprint:** 3 von 6

---

## 🎯 Quick Facts

| Metrik | Wert |
|--------|------|
| **BEL-Preise** | 3663 (17 KZVs importiert) |
| **Legal-Seiten** | ✅ Impressum, Datenschutz, AGB |
| **Security Audit** | ✅ 22.01.2026 bestanden |
| **Blocker** | Keine |

---

## 🚀 ERP-System Transformation

**Entscheidung:** V3-Frontend (vom Webdesigner) nach Next.js migrieren → Vollständiges ERP für Zahntechniker

### MVP-Fokus
1. **Rechnungserstellung + PDF Export**
2. **KI-Positionsvorschläge** (OpenAI GPT-4o-mini)

### Pricing (vorläufig)
| Tier | Preis | Features |
|------|-------|----------|
| Free | €0 | 2 Rechnungen/Monat |
| Pro | €49/M | Unbegrenzt + KI |
| Business | €79/M | Multi-User (tbd) |

### Roadmap
| Phase | Fokus | Status |
|-------|-------|--------|
| 1 | V3 → Next.js Migration | ✅ DONE |
| 2 | Datenbank erweitern | ⚪ |
| 3 | Rechnungserstellung + PDF | ⚪ |
| 4 | KI-Integration (OpenAI) | ⚪ |
| 5 | Stripe Payment | ⚪ |
| 6 | Polish & Launch | ⚪ |

### Nice-to-Have (später)
- KI-Mehrwert-Tracking (ai_suggestions_log)
- Monatlicher Report per Email: "Dein KI-Mehrwert: X€ optimiert"

**Detaillierter Plan:** `C:\Users\Scan\.claude\plans\synchronous-wondering-river.md`

---

## ✅ Letzte Sessions

### 22. Januar 2026 - Session 2 (ERP Migration)
**Phase 1 ABGESCHLOSSEN:** V3 → Next.js Migration

Erstellte Dateien:
- `src/types/erp.ts` - Alle TypeScript Interfaces
- `src/components/ui/Button.tsx` - Button mit 3 Varianten
- `src/components/ui/ThemeToggle.tsx` - Dark Mode Toggle
- `src/components/dashboard/DashboardLayout.tsx` - Layout mit Sidebar
- `src/components/dashboard/SearchView.tsx` - BEL-Suchansicht
- `src/components/dashboard/TemplatesView.tsx` - Vorlagen-Management
- `src/components/dashboard/ClientsView.tsx` - Kundenverwaltung
- `src/components/dashboard/SettingsView.tsx` - Einstellungen
- `src/app/(app)/dashboard/page.tsx` - Dashboard Page

Angepasste Dateien:
- `tailwind.config.ts` - brand colors + animations hinzugefügt

**Neue Route:** `/dashboard` (neues ERP-Dashboard)

### 22. Januar 2026 - Session 1
- Security-Härtung (CSP, HSTS, Rate-Limiting, Input-Validierung)
- 12 PDFs → CSV extrahiert & importiert
- Alle 17 KZVs nun in Supabase
- Git Branch-Problem behoben (master → main)
- ERP-Konzept mit V3-Frontend analysiert

### 21. Januar 2026
- Festzuschuss-Schema erstellt
- Hamburg Multiplikatoren dokumentiert
- 5 KZVs initial importiert

---

## 📋 Nächste Prioritäten

1. [x] ~~**V3 → Next.js Migration**~~ ✅ DONE
2. [ ] **Datenbank-Schema** erweitern (favorites, templates, clients, invoices)
3. [ ] **PDF-Generator** implementieren (@react-pdf/renderer)
4. [ ] **OpenAI Integration** für KI-Vorschläge
5. [ ] **Stripe Payment** einrichten

### Backlog
- Chat-Interface → wird Teil der KI-Integration
- Festzuschuss-Rechner → später
- Hamburg-Kalkulator → später

---

## 🔒 Security Status

| Maßnahme | Status |
|----------|--------|
| Open Redirect Protection | ✅ |
| Security Headers (CSP, HSTS) | ✅ |
| Input-Validierung | ✅ |
| Rate Limiting (100/min) | ✅ |
| RLS (Supabase) | ✅ |

---

## 📊 Daten-Status

**17/17 KZVs importiert** (3663 Preise)
- 12 KZVs mit 2026-Daten
- 5 KZVs mit 2025-Daten (Berlin, Brandenburg, Bremen, Hessen, Saarland)
- Hamburg: Multiplikatoren-System (später)

---

## 🔗 Quick Links

| Service | URL |
|---------|-----|
| **Supabase** | https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz |
| **GitHub** | https://github.com/OnePieceMonkey/Labrechner |
| **Vercel** | https://labrechner.vercel.app |
| **Domain** | labrechner.de |

---

## 📁 Projekt-Struktur

```
Labrechner/
├── website-app/                    # Next.js App
│   ├── src/app/
│   │   ├── (app)/dashboard/       # NEU: ERP Dashboard
│   │   ├── (app)/app/             # Alte Suche (deprecated)
│   │   └── (marketing)/           # Landing Page
│   ├── src/components/
│   │   ├── dashboard/             # NEU: ERP Komponenten
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── SearchView.tsx
│   │   │   ├── TemplatesView.tsx
│   │   │   ├── ClientsView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── ui/                    # NEU: UI Komponenten
│   │   └── search/                # Alte Search Components
│   ├── src/types/
│   │   └── erp.ts                 # NEU: ERP Types
│   └── src/hooks/
├── labrechner---bel-ii-preisrecherche V3/  # V3 Frontend (Referenz)
├── BEL 2026/                      # Rohdaten (17 KZVs)
└── docs/                          # Legal, Marketing
```

---

## 📊 Sprint-Übersicht

| Woche | Fokus | Status |
|-------|-------|--------|
| 1 | Foundation & Brand | ✅ |
| 2 | Daten & Backend | ✅ |
| 3 | Core Features | 🔄 Läuft |
| 4 | Frontend & KI-Chat | ⚪ |
| 5 | Landing Page | ⚪ |
| 6 | Beta Launch | ⚪ |

---

## 💡 Wichtige Hinweise

- **Git:** Immer auf `main` Branch pushen (nicht master)
- **Unternehmensform:** Kleinunternehmer §19 UStG
- **Hamburg:** Kassenspezifische Multiplikatoren (eigene Logik nötig)
- **Vercel:** Deployed automatisch von `main` Branch

---

*Aktualisiert nach jeder Claude-Session*
