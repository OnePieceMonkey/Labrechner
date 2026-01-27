# Codex - MVP P0 Fixes (2026-01-27)

## Scope
- Work in `website-app/` only.
- Focus: Search, Favorites, Templates, Settings.

## Tasks (current)
- [x] Sidebar bleibt fix beim Scrollen und bleibt einklappbar.
- [x] Settings: Dark-Mode Toggle funktional.
- [x] Settings: Speichern-Button mit Erfolg/Fehler Feedback (Label: "Einstellungen Speichern").
- [x] Settings: Stammdaten, Bank, Logo, Eigenpositionen persistent speichern.
- [x] Favorites: Gruppen-Filter wirkt auch im Favoriten-Tab.
- [x] Favorites: Eigenpositionen als Favorit moeglich (Custom Favorites).
- [x] Templates: Menge + Faktor in Vorlagen bearbeiten und persistent speichern.
- [x] Templates: Eigenpositionen in der Suche hinzufuegbar (Name + Positionsnummer).
- [x] Templates: Eigenpositionen im Vorlagen-Tab farblich hervorgehoben.

## Notes
- Template-Items speichern jetzt Menge + Faktor via `template_items`.
- Custom-Positions werden aus `custom_positions` geladen und beim Speichern synchronisiert.
- Favorites unterstuetzen jetzt `custom_position_id`.
- Migration hinzugefuegt: `website-app/supabase/migrations/011_favorites_custom_positions.sql`.
- Templates-UI: Custom-Highlighting und Add-Search inkludiert Eigenpositionen.
