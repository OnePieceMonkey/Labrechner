# Labrechner – Technische Architektur

> Diesen Skill verwenden bei: Supabase, API, Backend, Deployment, Datenbank, Frontend-Entwicklung

---

## Tech Stack Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui       │
│                         Vercel                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│              Supabase (PostgreSQL + Auth)                   │
│                    + Edge Functions                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │   n8n    │   │ KI-API   │   │ Storage  │
    │ Workflows│   │ (TBD)    │   │ Supabase │
    └──────────┘   └──────────┘   └──────────┘
```

---

## Frontend

### Framework

| Aspekt | Technologie |
|--------|-------------|
| **Framework** | Next.js 14+ |
| **Router** | App Router (Server Components) |
| **Styling** | Tailwind CSS |
| **UI-Komponenten** | shadcn/ui |
| **Icons** | Lucide React |
| **State Management** | React Query / SWR |
| **Forms** | React Hook Form + Zod |

### Projektstruktur

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── magic-link/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard / Suche
│   │   ├── search/
│   │   │   └── page.tsx          # BEL-Suche
│   │   ├── chat/
│   │   │   └── page.tsx          # KI-Chat
│   │   └── settings/
│   │       └── page.tsx          # Benutzereinstellungen
│   ├── layout.tsx
│   ├── page.tsx                  # Landing Page
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui Komponenten
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── PriceCard.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   └── ChatMessage.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── useSearch.ts
│   ├── useUser.ts
│   └── useSettings.ts
└── types/
    ├── bel.ts
    ├── user.ts
    └── database.ts
```

### Wichtige Pakete

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@supabase/ssr": "^0.1.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0"
  }
}
```

---

## Backend (Supabase)

### Datenbank-Schema

#### Tabelle: `kzv_regions`

```sql
CREATE TABLE kzv_regions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,        -- z.B. "KZVB", "KZVNR"
  name VARCHAR(100) NOT NULL,              -- z.B. "KZV Bayern"
  bundesland VARCHAR(50) NOT NULL,         -- z.B. "Bayern"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beispieldaten
INSERT INTO kzv_regions (code, name, bundesland) VALUES
  ('KZVBW', 'KZV Baden-Württemberg', 'Baden-Württemberg'),
  ('KZVB', 'KZV Bayern', 'Bayern'),
  ('KZVNR', 'KZV Nordrhein', 'Nordrhein-Westfalen'),
  ('KZVWL', 'KZV Westfalen-Lippe', 'Nordrhein-Westfalen');
  -- ... weitere 13 KZVen
```

#### Tabelle: `bel_groups`

```sql
CREATE TABLE bel_groups (
  id SERIAL PRIMARY KEY,
  group_number INTEGER UNIQUE NOT NULL,    -- 0-8
  name VARCHAR(100) NOT NULL,              -- z.B. "Modelle & Hilfsmittel"
  description TEXT,
  position_range VARCHAR(20)               -- z.B. "001-032"
);

INSERT INTO bel_groups (group_number, name, position_range) VALUES
  (0, 'Modelle & Hilfsmittel', '001-032'),
  (1, 'Kronen & Brücken', '101-165'),
  (2, 'Metallbasis / Modellguss', '201-212'),
  (3, 'Prothesen', '301-384'),
  (4, 'Schienen & Aufbissbehelfe', '401-404'),
  (5, 'UKPS', '501-521'),
  (7, 'KFO', '701-751'),
  (8, 'Instandsetzung & Erweiterung', '801-870');
```

#### Tabelle: `bel_positions`

```sql
CREATE TABLE bel_positions (
  id SERIAL PRIMARY KEY,
  position_code VARCHAR(10) UNIQUE NOT NULL,  -- z.B. "102 1"
  name VARCHAR(200) NOT NULL,                 -- z.B. "Vollkrone/Metall"
  group_id INTEGER REFERENCES bel_groups(id),
  is_ukps BOOLEAN DEFAULT FALSE,
  is_implant BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-Text Search Index
CREATE INDEX bel_positions_search_idx ON bel_positions
  USING GIN (to_tsvector('german', name));

-- Trigram Index für Fuzzy-Suche
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX bel_positions_trgm_idx ON bel_positions
  USING GIN (name gin_trgm_ops);
```

#### Tabelle: `bel_prices`

```sql
CREATE TABLE bel_prices (
  id SERIAL PRIMARY KEY,
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE CASCADE,
  kzv_id INTEGER REFERENCES kzv_regions(id) ON DELETE CASCADE,
  labor_type VARCHAR(20) NOT NULL CHECK (labor_type IN ('gewerbe', 'praxis')),
  price DECIMAL(10, 2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(position_id, kzv_id, labor_type, valid_from)
);

-- Index für schnelle Preisabfragen
CREATE INDEX bel_prices_lookup_idx ON bel_prices (position_id, kzv_id, labor_type, valid_from DESC);
```

#### Tabelle: `user_settings`

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  kzv_id INTEGER REFERENCES kzv_regions(id),
  labor_type VARCHAR(20) DEFAULT 'gewerbe' CHECK (labor_type IN ('gewerbe', 'praxis')),
  private_factor DECIMAL(3, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabelle: `waitlist`

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  labor_name VARCHAR(200),
  bundesland VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- User Settings: Nur eigene Daten
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- BEL-Daten: Öffentlich lesbar
ALTER TABLE bel_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE kzv_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BEL positions are public"
  ON bel_positions FOR SELECT
  USING (true);

CREATE POLICY "BEL prices are public"
  ON bel_prices FOR SELECT
  USING (true);

CREATE POLICY "KZV regions are public"
  ON kzv_regions FOR SELECT
  USING (true);
```

---

## Authentifizierung

### Magic Link Flow

```
1. User gibt E-Mail ein
        ↓
2. Supabase sendet Magic Link
        ↓
3. User klickt Link in E-Mail
        ↓
4. Redirect zu /magic-link?token=xxx
        ↓
5. Token wird verifiziert
        ↓
6. Session wird erstellt → Dashboard
```

### Supabase Auth Konfiguration

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}
```

---

## Such-Funktion

### PostgreSQL Full-Text Search

```sql
-- Suche nach BEL-Position
CREATE OR REPLACE FUNCTION search_bel_positions(
  search_query TEXT,
  user_kzv_id INTEGER DEFAULT NULL,
  user_labor_type VARCHAR DEFAULT 'gewerbe'
)
RETURNS TABLE (
  position_code VARCHAR,
  name VARCHAR,
  group_name VARCHAR,
  price DECIMAL,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.position_code,
    bp.name,
    bg.name AS group_name,
    pr.price,
    ts_rank(to_tsvector('german', bp.name), plainto_tsquery('german', search_query)) AS rank
  FROM bel_positions bp
  LEFT JOIN bel_groups bg ON bp.group_id = bg.id
  LEFT JOIN bel_prices pr ON bp.id = pr.position_id
    AND pr.kzv_id = COALESCE(user_kzv_id, 1)
    AND pr.labor_type = user_labor_type
    AND pr.valid_from <= CURRENT_DATE
    AND (pr.valid_until IS NULL OR pr.valid_until >= CURRENT_DATE)
  WHERE
    to_tsvector('german', bp.name) @@ plainto_tsquery('german', search_query)
    OR bp.name ILIKE '%' || search_query || '%'
    OR bp.position_code ILIKE '%' || search_query || '%'
  ORDER BY rank DESC, bp.position_code
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

### API-Aufruf (Frontend)

```typescript
// hooks/useSearch.ts
export function useSearch(query: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['bel-search', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_bel_positions', {
          search_query: query,
          user_kzv_id: userSettings.kzv_id,
          user_labor_type: userSettings.labor_type
        })

      if (error) throw error
      return data
    },
    enabled: query.length >= 2
  })
}
```

---

## KI-Chat (geplant)

### Architektur

```
User-Frage
     ↓
┌─────────────────┐
│  Edge Function  │
│  /api/chat      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  KI-Provider    │  ← OpenAI / Anthropic (TBD)
│  + BEL-Kontext  │
└────────┬────────┘
         │
         ▼
   Antwort mit BEL-Referenzen
```

### Geplante Funktionen

- Fragen zu BEL-Positionen beantworten
- Abrechnungstipps geben
- Positionsvorschläge machen
- Preisvergleiche erklären

### KI-Provider (noch offen)

| Provider | Modell | Vorteile |
|----------|--------|----------|
| OpenAI | GPT-4o-mini | Günstig, schnell |
| OpenAI | GPT-4o | Beste Qualität |
| Anthropic | Claude 3.5 Haiku | Schnell, günstig |
| Anthropic | Claude 3.5 Sonnet | Beste Qualität |

---

## n8n Workflows

### Geplante Workflows

| Workflow | Trigger | Aktion |
|----------|---------|--------|
| **BEL-Import** | Manuell / Cron | CSV-Dateien parsen, in Supabase importieren |
| **Preis-Update** | Cron (monatlich) | KZV-Websites prüfen, neue Preise importieren |
| **Waitlist-Bestätigung** | Webhook | Bestätigungs-E-Mail an neue Wartelisten-Einträge |
| **Beta-Einladung** | Manuell | E-Mails an Beta-Tester senden |

### BEL-Import Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ CSV-Datei   │ →  │ Parse &     │ →  │ Supabase    │
│ hochladen   │    │ Validieren  │    │ Insert      │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## Deployment

### Vercel Konfiguration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### Umgebungsvariablen

| Variable | Beschreibung | Wo |
|----------|--------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL | Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Key | Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key | Vercel (nur Server) |
| `OPENAI_API_KEY` | OpenAI API Key (falls gewählt) | Vercel |

### Domains

| Umgebung | Domain |
|----------|--------|
| Production | labrechner.de |
| Preview | *.vercel.app |
| Development | localhost:3000 |

---

## API-Endpunkte

### Supabase Auto-Generated

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| GET | `/rest/v1/bel_positions` | Alle BEL-Positionen |
| GET | `/rest/v1/bel_prices` | Alle Preise |
| GET | `/rest/v1/kzv_regions` | Alle KZVen |
| POST | `/rest/v1/rpc/search_bel_positions` | Suche |

### Custom Edge Functions (geplant)

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/api/chat` | KI-Chat Anfrage |
| POST | `/api/waitlist` | Warteliste Eintrag |
| POST | `/api/export` | Preisliste exportieren |

---

## DSGVO & Sicherheit

### Datenschutz-Maßnahmen

| Aspekt | Maßnahme |
|--------|----------|
| **Datenminimierung** | Nur notwendige Daten (E-Mail, Einstellungen) |
| **Verschlüsselung** | TLS für alle Verbindungen |
| **Hosting** | Supabase EU (Frankfurt), Vercel EU |
| **Auth** | Magic Link (keine Passwörter gespeichert) |
| **RLS** | Row Level Security für alle Tabellen |

### Keine Gesundheitsdaten

BEL-Preise sind **keine personenbezogenen Gesundheitsdaten**. Sie sind:
- Öffentlich verfügbar (KZV-Websites)
- Keine Patienten-Informationen
- Reine Preisinformationen

---

## Monitoring & Logging

### Geplant (Woche 6)

| Tool | Zweck |
|------|-------|
| **Sentry** | Error-Tracking |
| **Vercel Analytics** | Traffic-Analyse |
| **Supabase Dashboard** | DB-Monitoring |

---

*Erstellt: Januar 2025*
*Version: 1.0*
