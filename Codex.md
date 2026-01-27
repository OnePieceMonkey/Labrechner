# Codex - MVP P0 Fixes (2026-01-27)

## Scope
- Work in `website-app/` only.
- Focus: Search, Favorites, Templates, Settings.

## Tasks (current)
- [x] Sidebar bleibt fix beim Scrollen und bleibt einklappbar.
- [x] Settings: Dark-Mode Toggle funktional.
- [x] Settings: Speichern-Button mit Erfolg/Fehler Feedback (Label: "Einstellungen Speichern").
- [x] Settings: Stammdaten, Bank, Logo, Eigenpositionen persistent speichern.
- [ ] Settings: DB-Migration `012_user_settings_columns.sql` in Supabase ausfuehren (sonst Fehler: bank_name fehlt).
- [x] Favorites: Gruppen-Filter wirkt auch im Favoriten-Tab.
- [x] Favorites: Eigenpositionen als Favorit moeglich (Custom Favorites).
- [x] Templates: Menge + Faktor in Vorlagen bearbeiten und persistent speichern.
- [x] Templates: Eigenpositionen in der Suche hinzufuegbar (Name + Positionsnummer).
- [x] Templates: Eigenpositionen im Vorlagen-Tab farblich hervorgehoben.
- [x] Templates: Hinzufuegen aus Suche funktioniert wieder (stabile Template-IDs).
- [x] Templates: Vor dem Einfuegen Menge abfragen + bestehende Positionen hochzaehlen.
- [x] Rechnungen: PDF-Vorschau als Popup (nach Erstellung + per Vorschau-Button).
- [x] Rechnungen: Liste als Status-Karte mit farblicher Markierung, Status-Icon, Summe, Zahnarztname.
- [x] Rechnungen: PDF-Miniatur in der Rechnungs-Liste.
- [ ] Rechnungen: DB-Migration `013_add_invoice_columns.sql` (patient_name + vat_rate) in Supabase ausfuehren.

## Notes
- Template-Items speichern jetzt Menge + Faktor via `template_items`.
- Custom-Positions werden aus `custom_positions` geladen und beim Speichern synchronisiert.
- Favorites unterstuetzen jetzt `custom_position_id`.
- Migration hinzugefuegt: `website-app/supabase/migrations/011_favorites_custom_positions.sql`.
- Migration hinzugefuegt: `website-app/supabase/migrations/012_user_settings_columns.sql`.
- Migration hinzugefuegt: `website-app/supabase/migrations/013_add_invoice_columns.sql`.
- Templates-UI: Custom-Highlighting und Add-Search inkludiert Eigenpositionen.
- Templates: Custom-Erkennung nutzt jetzt Code oder `db_id` (robust bei numerischen Eigenpositionen).
