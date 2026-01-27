# Codex - MVP P0 Fixes (2026-01-27)

## Scope
- Work in `website-app/` only.
- Focus: Search view + filters + sidebar + multi-select.

## Must-fix (P0)
1. Search word queries: ensure text search triggers and results show (sanitize input, reset pagination on filter changes, reliable KZV sync).
2. Group filters (left): enforce correct filtering for BEL groups + Eigenpositionen, with UI fallback if backend misses.
3. Sidebar: stays visible while scrolling, still collapsible.
4. Multi-select positions: allow selecting multiple positions and keep selection across searches for template creation.

## Notes
- Keep behavior consistent with existing UI patterns.
- These are the highest priority items for the MVP.
-Antworte immer in deutsch