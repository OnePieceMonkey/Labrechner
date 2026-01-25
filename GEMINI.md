# Labrechner - Project Context for Gemini

## 1. Project Overview
**Labrechner** is a web application designed for dental laboratories in Germany to calculate prices based on the BEL-II (Bundeseinheitliches Leistungsverzeichnis) standard. It supports all 17 KZV regions and offers features like invoice generation, client management, and AI-assisted position suggestions.

*   **Type:** Web Application (SaaS)
*   **Domain:** labrechner.de
*   **Status:** Phase 6 - Launch Preparation (as of Jan 2026)

### Tech Stack
*   **Frontend:** Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS
*   **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
*   **Database:** PostgreSQL with `pg_trgm` for fuzzy search
*   **Payments:** Stripe (Subscriptions: Starter, Pro, Expert)
*   **AI:** OpenAI (GPT-4o-mini) for position suggestions
*   **Deployment:** Vercel

## 2. Getting Started

### Prerequisites
*   Node.js (matching Next.js 16 requirements)
*   Supabase account (for local dev or cloud connection)

### Installation & Run
The main application is located in the `website-app` directory.

```bash
cd website-app
npm install        # Install dependencies
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
```

### Environment Variables
Copy `.env.example` to `.env.local` in `website-app/`.
Required keys include:
*   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`
*   `OPENAI_API_KEY`

## 3. Project Structure

```
C:\Users\Scan\Desktop\KI_Directory\Labrechner\
├── website-app/                  # Main Next.js Application
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── (marketing)/      # Public pages (Landing, Pricing)
│   │   │   ├── (app)/            # Authenticated Dashboard
│   │   │   ├── (auth)/           # Login / Magic Link
│   │   │   └── api/              # API Routes (Stripe, AI)
│   │   ├── components/           # React Components
│   │   │   ├── search/           # Search functionality
│   │   │   ├── dashboard/        # Dashboard views
│   │   │   └── ui/               # Reusable UI elements
│   │   ├── hooks/                # Custom hooks (useSearch, useUser)
│   │   ├── lib/                  # Utilities (Supabase, Stripe clients)
│   │   └── types/                # TypeScript definitions (database.ts)
│   ├── public/                   # Static assets
│   └── package.json
├── supabase/
│   ├── migrations/               # SQL migrations
│   └── seed/                     # Seed data (KZV regions, BEL prices)
├── docs/                         # Detailed documentation (ARCHITECTURE.md)
└── STATUS.md                     # Current project status
```

## 4. Key Features & Architecture

### BEL Price Search
*   **Logic:** Uses a custom PostgreSQL RPC `search_bel_positions`.
*   **Algorithm:** Combines Full-Text Search (German), Trigram Similarity (Fuzzy), and Prefix Matching.
*   **Files:** `src/hooks/useSearch.ts`, `src/components/search/SearchBar.tsx`.

### Database Schema (Supabase)
*   **Core Data:** `kzv_regions`, `bel_groups`, `bel_positions`, `bel_prices`.
*   **User Data:** `user_settings` (RLS protected), `clients`, `invoices`, `templates`.
*   **Auth:** Supabase Auth (Magic Link).

### Subscription Model (Stripe)
*   **Tiers:** Free (Starter), Professional, Enterprise.
*   **Limits:** Enforced via `src/hooks/useSubscription.ts`.
*   **Implementation:** Webhooks handle status updates (`src/app/api/stripe/webhook/route.ts`).

### AI Integration
*   **Purpose:** Suggests BEL positions based on context.
*   **Implementation:** `src/app/api/ai/suggestions/route.ts` calls OpenAI.

## 5. Development Conventions

*   **Styling:** Tailwind CSS. Primary brand color is Purple (`brand-500`: #8B5CF6). Dark mode support via `next-themes`.
*   **State Management:** React Query (`@tanstack/react-query`) for server state, Context for global UI state.
*   **Icons:** Lucide React.
*   **Types:** Strictly typed. Database types are generated from Supabase schema (`src/types/database.ts`).
*   **Components:** Functional components, modularized by feature (`components/search`, `components/dashboard`).

## 6. Important Documentation
*   **`docs/ARCHITECTURE.md`:** The "Bible" of the project. Contains detailed schema, API descriptions, and feature breakdowns.
*   **`CLAUDE.md`:** Contains quick facts and context often used by AI assistants.
*   **`STATUS.md`:** Check this for the latest roadmap and known issues.
