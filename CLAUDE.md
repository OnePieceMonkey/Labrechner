# Labrechner - Projekt-Kontext

## Quick Facts
- **Typ:** BEL-Preisrechner für Zahntechniker (Deutschland)
- **Stack:** Next.js 14 (App Router) + Supabase + Stripe + TypeScript + Tailwind
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
- **Tabellen:** `kzv_regions` (17), `bel_groups` (8), `bel_positions` (~155), `bel_prices` (3.663), `user_settings`, `invoices`, `clients`, `templates`, `organizations`, `bel_rules`
- **Migrations:** `supabase/migrations/001-010*.sql` (inkl. Split-MwSt, Patientenname, Subscriptions, Search Update)
- **URL Config:** Site-URL `https://labrechner.de`, Redirects müssen `www` inkludieren (`https://www.labrechner.de/**`).

## Commands
```bash
cd website-app && npm run dev    # Dev Server (localhost:3000)
cd website-app && npm run build  # Production Build
```

## Admin & RBAC
- **Admin User:** werle.business@gmail.com
- **Roles:** `admin`, `beta_tester`, `user` (default)
- **Logic:** Admin → `/dashboard`, User → `/app` (redirect in `auth/callback`)

## Status
Siehe `STATUS.md` für aktuellen Stand und Roadmap.
