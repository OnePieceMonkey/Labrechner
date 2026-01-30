# Labrechner - Projekt-Kontext

## Quick Facts
- **Typ:** BEL-Preisrechner für Zahntechniker (Deutschland)
- **Stack:** Next.js 16.1.3 + Supabase + Stripe + TypeScript + Tailwind
- **Domain:** labrechner.de
- **Pfad:** `website-app/`
- **Status:** MVP Beta-Test aktiv

## Preismodell
| Plan | Preis | Features |
|------|-------|----------|
| Starter | 0€ | 3 Rechnungen/Monat |
| Pro | 49€ | Unbegrenzt, Logo, Brand-Color |
| Expert | 89€ | KI-Check, Multi-User |

## Projektstruktur
```
website-app/src/
├── app/
│   ├── (marketing)/    # Landing Page
│   ├── (app)/          # Dashboard
│   ├── (auth)/         # Login
│   └── api/            # Stripe, AI, Email
├── components/
│   ├── dashboard/      # DashboardLayout, Views, KzvRegionModal
│   ├── pdf/            # InvoicePDF
│   └── ui/             # Button, Input, etc.
├── hooks/              # useSearch, useInvoices, useUser
├── lib/                # supabase/, stripe/, xml/
└── types/              # database.ts, erp.ts
```

## Datenbank (Supabase)
- **Tabellen:** `kzv_regions`, `bel_positions`, `bel_prices`, `user_settings`, `invoices`, `clients`, `templates`, `shared_links`, `beta_allowlist`, `beta_feedback`
- **Migrations:** `supabase/migrations/001-024*.sql`
- **Auth Redirects:** `https://labrechner.de/**`, `https://www.labrechner.de/**`, `https://*.vercel.app/**`

## Wichtige Konzepte

### PDF-Rechnung
- Generator: `components/pdf/InvoicePDF.tsx`
- Logo: Footer links (Premium)
- Brand-Color: Titel + Bankverbindung
- Spalten: Pos. | Beschreibung | LOT/Charge | Menge | Faktor | Preis | Gesamt

### Share-Links
- Route: `/share/[token]` (öffentlich)
- Typen: `pdf` oder `xml`
- Gültigkeit: 7 Tage, max 10 Zugriffe

### XML-Export (DTVZ)
- Format: VDZI/KZBV v4.5
- Generator: `lib/xml/generateDTVZ.ts`

### Onboarding Flow
1. AVV akzeptieren (LegalGuard)
2. KI-Disclaimer (LegalGuard)
3. Tour (OnboardingTour)
4. KZV-Region wählen (KzvRegionModal)

## Commands
```bash
cd website-app && npm run dev    # Dev Server
cd website-app && npm run build  # Production Build
```

## Git Workflow (Beta-Phase)
```
main (Production) → labrechner.de
  └── develop     → Preview-URL (Entwicklung)
```
- Entwicklung auf `develop`
- Release via PR: develop → main
- **Keine** Breaking Changes ohne Review

## Admin & Rollen
- **Admin:** werle.business@gmail.com
- **Roles:** `admin`, `beta_tester`, `user`

## Beta-Tester anlegen
```sql
INSERT INTO beta_allowlist (email, status, role)
VALUES ('email@example.com', 'invited', 'beta_tester');
```

## Telegram Alerts
- Bug-Push: `beta-feedback-telegram` (alle 3 Min)
- Weekly Summary: `beta-feedback-weekly-summary` (Fr 19:45)
- Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## Weitere Dokumentation
- `STATUS.md` - Aktueller Stand, Roadmap, Backlog
- `Codex.md` - Feature-Checkliste
- `docs/ARCHITECTURE.md` - Detaillierte Architektur
