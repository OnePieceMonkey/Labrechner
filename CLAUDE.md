# Labrechner - Projekt-Kontext

## Quick Facts
- **Typ:** BEL-Preisrechner für Zahntechniker (Deutschland)
- **Stack:** Next.js 16.1.3 (App Router, Turbopack) + Supabase + Stripe + TypeScript + Tailwind
- **Domain:** labrechner.de
- **Pfad:** `website-app/` (Next.js App)
- **Status:** ERP-Module (Kunden, Vorlagen, Rechnungen) weitgehend funktional.

## Identifikatoren-Standard
- **BEL:** Nutzung von `position_code` (String) als UI-Identifier; Mapping auf numerische DB-IDs für Favoriten.
- **Custom:** Eigene IDs (String, z.B. "E-100") mit einstellbarer MwSt (7% / 19%).

## Preismodell
| Plan | Preis | Limits |
|------|-------|--------|
| Starter | 0€ | 3 Rechnungen/Monat |
| Pro | 49€ | Unbegrenzt, BEL+BEB |
| Expert | 89€ | KI-Check, Multi-User |

## Projektstruktur
```
website-app/src/
├── app/
│   ├── (marketing)/page.tsx    # Landing Page
│   ├── (app)/app/page.tsx      # Dashboard/Suche
│   ├── (app)/dashboard/        # ERP Dashboard
│   ├── (auth)/login/           # Auth
│   └── api/                    # Stripe, AI Routes
├── components/
│   ├── search/                 # SearchBar, FilterPanel, PriceCard
│   ├── dashboard/              # DashboardLayout, Views
│   ├── landing/                # Hero, Pricing, Footer
│   └── layout/                 # Header, Logo
├── hooks/
│   ├── useSearch.ts            # BEL-Suche
│   ├── useSubscription.ts      # Stripe Limits
│   └── useUser.ts              # User Settings + RBAC
├── lib/
│   ├── supabase/               # Client/Server
│   └── stripe/                 # Config, Server
└── types/                      # database.ts, bel.ts
```

## Datenbank (Supabase)
- **Tabellen:** `kzv_regions` (17), `bel_groups` (8), `bel_positions` (~155), `bel_prices` (3.663), `user_settings`, `invoices`, `clients`, `templates`, `organizations`, `bel_rules`, `shared_links`
- **Migrations:** `supabase/migrations/001-022*.sql`
  - 018: XML-Export Settings (ik_nummer, herstellungsort, link_type)
  - 019: Chargennummern (template_items, invoice_items)
  - 020: HKP-Nummer (invoices)
- **URL Config:** Site-URL `https://labrechner.de`, Redirects müssen `www` inkludieren (`https://www.labrechner.de/**`).

## Email-Integration (Resend)
- **Provider:** Resend für Transaktions-Emails
- **Domain:** `@mail.labrechner.de` (verifiziert)
- **Adressen:**
  - `hello@mail.labrechner.de`: Rechnungsversand (React-Email Templates)
  - `auth@mail.labrechner.de`: Supabase Auth SMTP
  - `support@labrechner.de`: Support-Tickets (→ n8n, geplant)
  - `info@labrechner.de`: Allgemeine Anfragen
  - `p.werle@labrechner.de`: CEO/Geschäftlich
- **Template:** React-Email mit Branding, personalisierter Anrede, CTA-Button

- **Supabase Auth Template:** HTML liegt in `docs/magic-link-email.html` (Dashboard: Auth > Emails)
- **SMTP Hinweis:** Resend SMTP Username = `resend`, Password = Resend API Key

## Share-Link-System
- **Tabelle:** `shared_links` mit Token-basiertem Zugriff
- **Link-Typen:** `pdf` (Standard) oder `xml` (DTVZ-Export)
- **Gültigkeit:** 7 Tage ab Erstellung
- **Limit:** Max. 10 Zugriffe pro Link
- **Route:** `/share/[token]` (öffentlich, keine Auth erforderlich)
- **Verwendung:** Rechnungsversand an Zahnärzte ohne Account
- **XML-Handling:** Bei `link_type='xml'` Redirect zur XML-Datei in Supabase Storage

## DTVZ-XML Export (NEU)
- **Format:** VDZI/KZBV v4.5 für Zahnarzt-Praxissoftware
- **Generator:** `lib/xml/generateDTVZ.ts`
- **Storage:** Supabase Storage Bucket `invoices`
- **User-Settings Felder:**
  - `ik_nummer`: Institutionskennzeichen (9-stellig)
  - `herstellungsort_*`: Abweichende Herstellungsadresse
  - `xml_export_default`: Standard-Einstellung für neue Rechnungen
- **Invoice-Felder:** `generate_xml`, `xml_url`, `xml_generated_at`
- **Chargennummern:** In `template_items` und `invoice_items` (charge_number)

## PDF-Rechnung
- **LOT/Charge Spalte:** Eigene Spalte zwischen Beschreibung und Menge mit Ueberschrift "LOT/Charge"
- **Spalten:** Pos. | Beschreibung | LOT/Charge | Menge | Faktor | Einzelpreis | Gesamt
- **Generator:** `components/pdf/InvoicePDF.tsx`

## PDF Preview
- CSP erlaubt `blob:` fuer frame/object (Preview stabil).
- Mobile Fallback nutzt Data-URL; "Open in new tab" nutzt window.open Workaround.

## Stripe Subscriptions
- **Checkout:** API route erzeugt Sessions (monatlich/jaehrlich) + Fallback GET.
- **Webhook:** mappt price_id -> plan + speichert `subscription_interval`.
- **User Settings:** Felder `subscription_interval`, `subscription_renewal_reminded_for`.
- **Reminder:** Cron `/api/stripe?task=reminders` + Email `SubscriptionRenewalEmail`.

## Environment-Variablen
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]  # Für Share-Links

# Supabase Edge Functions (Telegram Alerts)
TELEGRAM_BOT_TOKEN=[telegram_bot_token]
TELEGRAM_CHAT_ID=[telegram_chat_id]

# Email (Resend)
RESEND_API_KEY=re_xxx
LABRECHNER_EMAIL_FROM=hello@mail.labrechner.de

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_YEARLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_YEARLY=price_xxx
STRIPE_PRICE_EXPERT_MONTHLY=price_xxx
STRIPE_PRICE_EXPERT_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_EXPERT_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_EXPERT_YEARLY=price_xxx
NEXT_PUBLIC_APP_URL=https://www.labrechner.de
```

## Commands
```bash
cd website-app && npm run dev    # Dev Server (localhost:3000)
cd website-app && npm run build  # Production Build

# BEL-Preise importieren (Hessen, Saarland, alle Regionen)
cd website-app && npx tsx scripts/import-bel.ts
```

## Git Workflow & Deployment (Beta-Phase)

### Branch-Struktur
```
main (Production)     → labrechner.de (Beta-Nutzer testen hier)
  │
  └── develop         → Preview-URL (Hauptentwicklung)
        │
        └── feature/* → Preview-URL (Feature-Branches)
```

### Deployment
- **Vercel:** Auto-Deploy bei Push
- **Production:** `main` Branch → labrechner.de
- **Preview:** Alle anderen Branches bekommen automatisch eine Preview-URL
- **Format:** `labrechner-git-<branch>-<username>.vercel.app`

### Workflow
```bash
# Entwicklung (IMMER auf develop!)
git checkout develop
# ... arbeiten ...
git add . && git commit -m "feat: neue Funktion"
git push

# Release zu Production
# 1. PR erstellen: develop → main
# 2. Review auf Preview-URL
# 3. Merge → Auto-Deploy auf labrechner.de
```

### Regeln waehrend Beta
- **main:** NUR Bug-Fixes und getestete Features (via PR)
- **develop:** Neue Features, Experimente
- **Keine** Breaking Changes an DB/API ohne Review
- **Migrations:** Erst auf develop testen, dann mergen

### Datenbank
- **Shared:** Alle Branches nutzen dieselbe Supabase-Instanz
- **Vorsicht:** Keine destruktiven Migrationen (DROP TABLE etc.)

## Admin & RBAC
- **Admin User:** werle.business@gmail.com
- **Roles:** `admin`, `beta_tester`, `user` (default)
- **Logic:** Admin → `/dashboard`, User → `/app` (redirect in `auth/callback`)


## Sprint 28.1 Completed Items (29.01.2026)
- BEL-Positionsnummern Fix (Fuehrende Nullen / Anzeige stabil)
- KZV-Region Persistenz in Settings
- Rechnungs-Preview nach Erstellung + Liste
- Kunden-Pflichtfelder mit Sternchen + Validierung
- Stripe Checkout + Subscriptions + Landing Payment Links
- Supabase Auth Magic-Link Branding (Email + Login-Confirmation)
- Tour-Video Loop/Timing geglaettet (1.25x)
- Rechnung-PDF Formatierung (Kundennr., Adresse, LOT/Charge)



## Beta Tester (Allowlist + Feedback)
- Allowlist: `beta_allowlist` (email, status, role). Status wechselt bei erstem Login von `invited` -> `active`.
- Rollen-Sync: `/auth/callback` setzt `user_settings.role = beta_tester` wenn Email erlaubt.
- Feedback: `beta_feedback` Tabelle + UI (Feedback Tab + Modal) + Admin-Log mit Filtern/Status.
- Migration: `website-app/supabase/migrations/021_beta_allowlist_feedback.sql`.

**Telegram Feedback Alerts (Beta):**
- Edge Functions: `beta-feedback-telegram` (Instant Bug Push) + `beta-feedback-weekly-summary` (Wochenuebersicht).
- Migration: `website-app/supabase/migrations/022_beta_feedback_telegram.sql` (telegram_notified_at, summary table, view).
- Secrets (Supabase Functions): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Cron: alle 3 Min fuer Bugs, Freitag 19:45 CET/CEST fuer Summary (UTC Offset beachten).

**Beta-Tester anlegen (Supabase):**
- Insert in `beta_allowlist`:
  - `email` (lowercase)
  - `status` = `invited`
  - `role` = `beta_tester`
- Beim Login wird `user_settings.role` automatisch gesetzt und der Allowlist-Status auf `active` aktualisiert.

## Status
Siehe `STATUS.md` für aktuellen Stand und Roadmap.
