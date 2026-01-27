# Codex - MVP P0 Fixes (2026-01-27)

## Scope
- Work in `website-app/` only.
- Focus: Search, Favorites, Templates, Settings.

## Tasks (current)
- [x] Sidebar bleibt fix beim Scrollen und bleibt einklappbar.
- [x] Settings: Dark-Mode Toggle funktional.
- [x] Settings: Speichern-Button mit Erfolg/Fehler Feedback.
- [x] Settings: Stammdaten, Bank, Logo, Eigenpositionen persistent speichern.
- [x] Favorites: Gruppen-Filter wirkt auch im Favoriten-Tab.
- [x] Templates: Menge + Faktor in Vorlagen bearbeiten und persistent speichern.

## Notes
- Template-Items speichern jetzt Menge + Faktor via `template_items`.
- Custom-Positions werden aus `custom_positions` geladen und beim Speichern synchronisiert.
