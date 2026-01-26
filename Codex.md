# Codex - Labrechner Fix Plan

## Scope
- Main app lives in `website-app/`.
- Ignore `labrechner---bel-ii-preisrecherche V4/` for this work.
- Primary docs: `CLAUDE.md`, `GEMINI.md`, `docs/ARCHITECTURE.md`, `docs/FRONTEND-IMPLEMENTIERUNG.md`.

## Structure (for future)
- `website-app/` - Next.js app (App Router)
- `supabase/` - migrations and seed data
- `docs/` - architecture, frontend, marketing, legal, QA
- `branding/`, `brand-guidelines.md` - brand assets and rules

## Environment
- Dev: `cd website-app && npm run dev`
- Build: `cd website-app && npm run build`
- Env: copy `.env.example` to `.env.local` in `website-app/` with Supabase/Stripe/OpenAI keys.

## Bug List (from Bugs+Prio.md)
### Search (S)
- S1: Favorite star cannot be set (High)
- S2: Group filter does not filter results (High)
- S3: Microphone input not working (Low)
- S4: Grouped results with separators per group (Low)
- S5: Custom positions ordering should be numeric (Medium)
- S6: Custom positions visually marked (Medium)
- S7: Custom positions filterable in left filter (Medium)
- S8: Left filter bar should stay sticky on scroll (High)

### Favorites (F)
- F1: Favorites list blocked because S1 cannot be set (High)

### Templates (V)
- V1: Custom positions marked with symbol/highlight in tile list (Medium)
- V2: Custom positions searchable (High)
- V3: Add-position popup allows per-position factor; global factor overrides (Medium)
- V4: Edit tile should allow quantity input (High)
- V5: Templates must persist and never auto-delete (High)
- V6: Create invoice button should generate invoice, jump to invoices, highlight entry, show preview, allow double-click open (High)

### Invoices (R)
- R1: Invoices list newest first; numbers sequential and non-editable (High)
- R2: Status color accents; email from customer data (Medium)
- R3: Filter button text contrast too low (High)

### Settings (E)
- E1: Dark mode toggle persistence + temp toggle still works (Medium)
- E2: Tour speed/arrow glitch (Medium)
- E3: Save button shows confirmation (Medium)
- E4: All settings persist in profile, esp region and master data incl bank (Very High)

## Timeline / Steps
- Step 1 (P0): Search + Favorites core (S1, S2, S8, F1)
- Step 2 (P0+): Settings persistence (E4)
- Step 3 (P0): Templates core (V2, V4, V5, V6)
- Step 4 (P0): Invoices core (R1, R3)
- Step 5 (P1): Medium priority set (S5-7, V1, V3, R2, E1-3)
- Step 6 (P2): Low priority set (S3, S4)

## Milestones
| ID | Bug | Status | Date | Notes |
| --- | --- | --- | --- | --- |
| M1 | S1 | Done | 2026-01-26 | Mapping hardened in `website-app/src/app/(app)/dashboard/page.tsx`. |
| M2 | S2 | Done | 2026-01-26 | Reset pagination + UI fallback filter in `website-app/src/hooks/useSearch.ts` and `website-app/src/app/(app)/dashboard/page.tsx`. |
| M3 | S8 | Done | 2026-01-26 | Sidebar sticky layout in `website-app/src/components/dashboard/DashboardLayout.tsx`. |
| M11 | F1 | Done | 2026-01-26 | Favorites now toggle correctly (depends on S1). |
| M4 | E4 | Done | 2026-01-26 | Persist settings + custom positions in `website-app/src/hooks/useUser.ts`, `website-app/src/hooks/useCustomPositions.ts`, `website-app/src/components/dashboard/SettingsView.tsx`. |
| M5 | V2 | Done | 2026-01-26 | Custom positions searchable in templates via `website-app/src/app/(app)/dashboard/page.tsx`, `website-app/src/components/dashboard/TemplatesView.tsx`. |
| M6 | V4 | Done | 2026-01-26 | Add-item modal supports quantity in `website-app/src/components/dashboard/TemplatesView.tsx`. |
| M7 | V5 | Done | 2026-01-26 | Template persistence wired in `website-app/src/app/(app)/dashboard/page.tsx`. |
| M8 | V6 | Done | 2026-01-26 | Invoice highlight + preview and jump in `website-app/src/app/(app)/dashboard/page.tsx`, `website-app/src/components/dashboard/InvoicesView.tsx`. |
| M12 | V1 | Done | 2026-01-26 | Custom position badge in templates `website-app/src/components/dashboard/TemplatesView.tsx`. |
| M13 | V3 | Done | 2026-01-26 | Per-item factor in add popup + global override in `website-app/src/components/dashboard/TemplatesView.tsx`. |
| M14 | R1 | Done | 2026-01-26 | Sorted invoices newest-first; invoice number read-only in `website-app/src/components/dashboard/InvoicesView.tsx`, `website-app/src/components/dashboard/SettingsView.tsx`. |
| M15 | R3 | Done | 2026-01-26 | Filter button text contrast improved in `website-app/src/components/dashboard/InvoicesView.tsx`. |
| M16 | E1 | Done | 2026-01-26 | Theme preference persisted in `website-app/src/app/(app)/dashboard/page.tsx`, `website-app/src/types/database.ts`, `website-app/supabase/migrations/012_user_settings_theme_preference.sql`. |
| M17 | E2 | Done | 2026-01-26 | Slower tour animations + cursor glitch removed in `website-app/src/components/dashboard/OnboardingTour.tsx`. |
| M18 | E3 | Done | 2026-01-26 | Save confirmation state added in `website-app/src/components/dashboard/SettingsView.tsx`. |
| M19 | S4 | Done | 2026-01-26 | Group separators in results in `website-app/src/components/dashboard/SearchView.tsx`. |
| M20 | S5 | Done | 2026-01-26 | Numeric ordering for custom codes in `website-app/src/components/dashboard/SearchView.tsx`, `website-app/src/app/(app)/dashboard/page.tsx`. |
| M21 | S6 | Done | 2026-01-26 | Custom marker styling in search list `website-app/src/components/dashboard/SearchView.tsx`. |
| M22 | S7 | Done | 2026-01-26 | Custom filter enforced in `website-app/src/app/(app)/dashboard/page.tsx`. |
| M23 | R2 | Done | 2026-01-26 | Status accents + client email in `website-app/src/components/dashboard/InvoicesView.tsx`. |
| M24 | S3 | Done | 2026-01-26 | Speech recognition support fixed in `website-app/src/components/dashboard/SearchView.tsx`. |

## Working Rules
- When a bug is fixed, update `Bugs+Prio.md` and mark the milestone here.
- Keep notes short and point to the file path that changed.
