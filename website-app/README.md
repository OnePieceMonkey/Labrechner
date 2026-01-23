# Labrechner

BEL-Abrechnungsassistent für deutsche Dentallabore.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel
- **Domain:** labrechner.de

## Entwicklung starten

1. Dependencies installieren:
   ```bash
   npm install
   ```

2. Umgebungsvariablen konfigurieren:
   ```bash
   cp .env.local.example .env.local
   # Dann die Supabase-Keys eintragen
   ```

3. Development Server starten:
   ```bash
   npm run dev
   ```

4. Öffne [http://localhost:3000](http://localhost:3000)

## Supabase Setup

1. Gehe zu: https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz/settings/api
2. Kopiere die Credentials in `.env.local`
3. Führe die SQL-Migrations im Supabase Dashboard aus:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed/kzv_regions.sql`
   - `supabase/seed/bel_groups.sql`

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing Page (/)
│   ├── (app)/              # Dashboard (/app)
│   └── (auth)/             # Login (/login)
├── components/
│   ├── ui/                 # shadcn/ui Komponenten
│   ├── search/             # Such-Komponenten
│   └── layout/             # Header, Footer, Logo
├── lib/
│   └── supabase/           # Supabase Client
├── hooks/                  # React Hooks
└── types/                  # TypeScript Types
```

## Links

- **Produktion:** https://labrechner.de
- **Preview:** https://labrechner-*.vercel.app
- **Supabase:** https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz
- **GitHub:** https://github.com/OnePieceMonkey/Labrechner
