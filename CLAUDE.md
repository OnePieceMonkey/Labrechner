# Labrechner - Projekt-Kontext

## Quick Facts
- **Typ:** BEL-Preisrechner für Zahntechniker (Deutschland)
- **Stack:** Next.js 14 (App Router) + Supabase + TypeScript + Tailwind
- **Pfad:** `website-app/` (Next.js App)

## Projektstruktur
```
website-app/src/
├── app/
│   ├── (marketing)/page.tsx    # Landing Page
│   ├── (app)/app/page.tsx      # Dashboard/Suche
│   ├── (auth)/login/           # Auth
│   └── auth/callback/route.ts  # OAuth Callback
├── components/
│   ├── search/                 # SearchBar, FilterPanel, PriceCard, SearchResults
│   └── layout/                 # Header, Footer, Logo
├── hooks/
│   ├── useSearch.ts            # BEL-Suche (RPC: search_bel_positions)
│   └── useUser.ts              # User Settings
├── lib/supabase/               # Client/Server Clients
└── types/                      # database.ts, bel.ts
```

## Datenbank (Supabase)
- **Tabellen:** `kzv_regions` (17), `bel_groups` (8), `bel_positions` (~155), `bel_prices`, `user_settings`
- **RPC:** `search_bel_positions()`, `get_position_prices()`
- **Schema:** `supabase/migrations/001_initial_schema.sql`

## BEL 2026 Daten
- **Pfad:** `BEL 2026/BEL leistungen/` - 16 Bundesland-Ordner
- **CSVs:** Bayern, BW (Praxis+Gewerbe), NRW, Hamburg, Rheinland-Pfalz, Sachsen-Anhalt
- **KFO-Daten:** Rheinland-Pfalz (14-spaltig mit KFO-Preisen)

## Aktueller Status
Siehe `STATUS.md` für Details.

## Commands
```bash
cd website-app && npm run dev    # Dev Server (localhost:3000)
cd website-app && npm run build  # Production Build
```
