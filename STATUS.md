# LABRECHNER – Projekt-Status

> **Stand:** 23. Januar 2026 (Session 5) | **Sprint:** 5 von 6

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
| 2 | Datenbank erweitern | ✅ DONE |
| 3 | Rechnungserstellung + PDF | ✅ DONE |
| 4 | KI-Integration (OpenAI) | ✅ DONE |
| 5 | Stripe Payment | ✅ DONE |
| 6 | Polish & Launch | ⚪ Nächster Schritt |

### Nice-to-Have (später)
- KI-Mehrwert-Tracking (ai_suggestions_log)
- Monatlicher Report per Email: "Dein KI-Mehrwert: X€ optimiert"

**Detaillierter Plan:** `C:\Users\Scan\.claude\plans\synchronous-wondering-river.md`

---

## ✅ Letzte Sessions

### 23. Januar 2026 - Session 5 (Phase 6: Admin-RBAC + V3-Design-Migration)
**Admin-Zugang + V3-Design komplett nach Next.js portiert**

Erstellte Dateien (RBAC):
- `supabase/migrations/004_add_user_roles.sql` - RBAC-System (user/admin/beta_tester)
- Helper-Funktionen: `is_admin()`, `has_beta_access()` (SQL + TypeScript)

Erstellte Dateien (Landing Page - 10 Komponenten):
- `src/components/landing/constants.ts` - Alle Konstanten (HERO_COPY, FEATURES, PRICING, etc.)
- `src/components/landing/Navbar.tsx` - Fixed Navigation mit Theme Toggle
- `src/components/landing/Hero.tsx` - Hero Section mit animierter Rechnungsvorschau
- `src/components/landing/InvoiceAnimation.tsx` - Animierte Rechnungs-Demo
- `src/components/landing/RegionTicker.tsx` - Scrollende 17 KZV-Regionen
- `src/components/landing/Features.tsx` - 4-Grid Masonry Feature-Layout
- `src/components/landing/Pricing.tsx` - 3 Pläne mit Monthly/Yearly Toggle
- `src/components/landing/WaitlistSection.tsx` - Beta-Waitlist
- `src/components/landing/Footer.tsx` - Footer mit Trust Badges
- `src/components/landing/CookieBanner.tsx` - DSGVO Cookie-Consent
- `src/components/landing/index.ts` - Export Barrel

Erstellte Dateien (Provider):
- `src/components/providers/ThemeProvider.tsx` - next-themes Integration
- `src/components/providers/index.ts` - Export Barrel

Aktualisierte Dateien:
- `src/types/database.ts` - role-Feld zu UserSettings
- `src/hooks/useUser.ts` - isAdmin, hasBetaAccess, canBypassLimits Flags
- `src/app/layout.tsx` - ThemeProvider + Dark Mode Support
- `src/app/(marketing)/page.tsx` - Komplett neue V3-Design Landing Page
- `tailwind.config.ts` - Erweiterte Animations + Spacing
- `package.json` - next-themes hinzugefügt
- `.gitignore` - V3, BEL 2026, Skills, branding ausgeschlossen
- `STATUS.md` - Vollständige Launch-Checkliste (25+ Tasks)

**Admin-Email:** werle.business@gmail.com
**GitHub-Strategie:** Monorepo beibehalten, unwichtige Ordner via .gitignore ausschließen
**Build:** ✅ Erfolgreich

---

### 23. Januar 2026 - Session 4 (Phase 4 + 5: KI & Payment)
**Phase 4 + 5 ABGESCHLOSSEN:** OpenAI Integration + Stripe Payment

Erstellte Dateien (Phase 4 - OpenAI):
- `src/app/api/ai/suggestions/route.ts` - KI-Vorschläge API (GPT-4o-mini)
- `src/hooks/useAISuggestions.ts` - React Hook für KI-Vorschläge
- `src/components/ai/AIAssistant.tsx` - KI-Assistent UI-Komponente

Erstellte Dateien (Phase 5 - Stripe):
- `src/lib/stripe/config.ts` - Subscription-Pläne (Free/Pro/Enterprise)
- `src/lib/stripe/server.ts` - Stripe Server-Client
- `src/lib/stripe/client.ts` - Stripe Browser-Client
- `src/app/api/stripe/checkout/route.ts` - Checkout Session API
- `src/app/api/stripe/portal/route.ts` - Customer Portal API
- `src/app/api/stripe/webhook/route.ts` - Webhook Handler (6 Events)
- `src/hooks/useSubscription.ts` - Subscription State Management
- `src/components/subscription/PricingCard.tsx` - Pricing Card UI
- `src/components/subscription/PricingSection.tsx` - Pricing Section
- `src/components/subscription/SubscriptionStatus.tsx` - Status Widget

Aktualisierte Dateien:
- `src/types/database.ts` - Stripe-Felder in user_settings
- `package.json` - stripe, @stripe/stripe-js, openai hinzugefügt

**Build:** ✅ Erfolgreich

---

### 23. Januar 2026 - Session 3 (ERP Phase 2 + 3)
**Phase 2 + 3 ABGESCHLOSSEN:** Datenbank-Schema + PDF-Generator

Erstellte Dateien (Phase 2):
- `supabase/migrations/003_erp_schema.sql` - Komplettes ERP-Schema
  - `favorites` - Benutzer-Favoriten
  - `clients` - Kundenverwaltung (Zahnärzte)
  - `custom_positions` - Eigene Positionen
  - `templates` + `template_items` - Vorlagen-System
  - `invoices` + `invoice_items` - Rechnungen
  - `user_settings` erweitert (Lab-Stammdaten, Bank, Logo)
  - Helper-Funktionen: `generate_invoice_number()`, `recalculate_invoice_totals()`
  - Views: `invoice_overview`, `monthly_revenue`

- `src/hooks/useFavorites.ts` - Favoriten-Management Hook
- `src/hooks/useClients.ts` - Kunden-Management Hook
- `src/hooks/useTemplates.ts` - Vorlagen-Management Hook
- `src/hooks/useInvoices.ts` - Rechnungs-Management Hook
- `src/hooks/index.ts` - Export-Barrel

Erstellte Dateien (Phase 3):
- `src/components/pdf/InvoicePDF.tsx` - PDF-Rechnungsvorlage (@react-pdf/renderer)
- `src/components/pdf/index.ts` - Export-Barrel
- `src/hooks/usePDFGenerator.ts` - PDF-Generator Hook (Download, Preview, Base64)
- `src/components/dashboard/InvoicesView.tsx` - Rechnungsübersicht-Komponente

Aktualisierte Dateien:
- `src/types/database.ts` - Erweiterte Typen für alle neuen Tabellen
- `package.json` - @react-pdf/renderer hinzugefügt

**Build:** ✅ Erfolgreich

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
2. [x] ~~**Datenbank-Schema** erweitern~~ ✅ DONE (favorites, templates, clients, invoices + Hooks)
3. [x] ~~**PDF-Generator** implementieren~~ ✅ DONE (@react-pdf/renderer + InvoicePDF + usePDFGenerator)
4. [x] ~~**OpenAI Integration**~~ ✅ DONE (API + Hook + AIAssistant Komponente)
5. [x] ~~**Stripe Payment**~~ ✅ DONE (Checkout, Webhook, Portal, 3 Pläne)
6. [ ] **Phase 6: Polish & Launch** 🔜

### Phase 6 Todo - VOLLSTÄNDIGE LAUNCH-CHECKLISTE

#### Kritisch vor Launch
- [ ] **Stripe Products erstellen** - 3 Produkte (Free, Pro €29, Enterprise €79) im Stripe Dashboard
- [ ] **Stripe Webhook URL** - Production URL in Stripe Dashboard konfigurieren
- [ ] **Environment Variables (Vercel)** - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, OPENAI_API_KEY
- [ ] **Domain kaufen** - labrechner.de bei Provider kaufen
- [ ] **Domain → Vercel** - DNS A/CNAME Records setzen
- [ ] **SSL-Zertifikat** - Automatisch via Vercel
- [ ] **OpenAI API Key (Production)** - Eigenen Key erstellen, Usage Limits setzen
- [ ] **KI-Prompts optimieren** - BEL-spezifische System-Prompts testen

#### Daten-Vollständigkeit
- [ ] **Fehlende KZV 2026 Listen** - Berlin, Brandenburg, Bremen, Hessen, Saarland (noch 2025er Daten)
- [ ] **Hamburg Multiplikatoren** - Kassenspezifische Logik implementieren
- [ ] **Daten-Validierung** - Stichproben mit echten BEL-Katalogen

#### Legal & Compliance
- [ ] **Impressum aktualisieren** - Echte Firmendaten eintragen
- [ ] **Datenschutzerklärung prüfen** - Stripe, OpenAI, Supabase erwähnen
- [ ] **AGB finalisieren** - Subscription-Bedingungen, Kündigungsfristen
- [ ] **Cookie-Banner testen** - Opt-in für Analytics

#### Testing & QA
- [ ] **End-to-End Tests** - Login → Suche → Rechnung → PDF → Zahlung
- [ ] **Mobile Testing** - iOS Safari, Android Chrome
- [ ] **Stripe Test-Zahlungen** - Alle 3 Pläne durchspielen
- [ ] **Webhook Reliability** - Retry-Logik prüfen
- [ ] **Error Monitoring** - Sentry oder ähnliches einrichten

#### Marketing & Launch
- [ ] **Beta-Tester einladen** - 5-10 echte Labore für Feedback
- [ ] **Feedback-Formular** - In-App Feedback-Button
- [ ] **Analytics einrichten** - Vercel Analytics oder Plausible
- [ ] **Social Media Präsenz** - LinkedIn für B2B

#### Design-Migration (V3 → Next.js)
- [x] Admin-RBAC implementiert (werle.business@gmail.com)
- [ ] **Landing-Komponenten portieren** - Navbar, Hero, Features, Pricing, Footer
- [ ] **Tailwind erweitern** - Brand Colors (violet), Animations
- [ ] **Navigation Flow** - Landing → Login → Dashboard nahtlos

### Backlog (Post-Launch)
- Chat-Interface → wird Teil der KI-Integration
- Festzuschuss-Rechner → später
- Hamburg-Kalkulator → später
- KI-Mehrwert-Tracking (ai_suggestions_log)
- Monatlicher KI-Report: "Dein KI-Mehrwert: X€ optimiert"
- Referral-System für Labore
- API für Drittanbieter (Enterprise)

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
│   │   ├── (app)/dashboard/       # ERP Dashboard
│   │   ├── (app)/app/             # Alte Suche (deprecated)
│   │   └── (marketing)/           # Landing Page
│   ├── src/components/
│   │   ├── dashboard/             # ERP Komponenten
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── SearchView.tsx
│   │   │   ├── TemplatesView.tsx
│   │   │   ├── ClientsView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── ui/                    # UI Komponenten
│   │   └── search/                # Alte Search Components
│   ├── src/types/
│   │   ├── erp.ts                 # ERP Types
│   │   └── database.ts            # Supabase Types (erweitert)
│   ├── src/hooks/
│   │   ├── useFavorites.ts        # NEU
│   │   ├── useClients.ts          # NEU
│   │   ├── useTemplates.ts        # NEU
│   │   ├── useInvoices.ts         # NEU
│   │   └── index.ts               # NEU
│   └── supabase/migrations/
│       └── 003_erp_schema.sql     # NEU: ERP Tabellen
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
| 3 | Core Features | ✅ |
| 4 | KI & Payment | ✅ |
| 5 | Polish & Integration | 🔄 Nächster |
| 6 | Beta Launch | ⚪ |

---

## 💡 Wichtige Hinweise

- **Git:** Immer auf `main` Branch pushen (nicht master)
- **Unternehmensform:** Kleinunternehmer §19 UStG
- **Hamburg:** Kassenspezifische Multiplikatoren (eigene Logik nötig)
- **Vercel:** Deployed automatisch von `main` Branch

---

*Aktualisiert nach jeder Claude-Session*
