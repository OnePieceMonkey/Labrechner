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
- [ ] Settings: DB-Migration `014_user_settings_contact.sql` (contact_name + lab_email) in Supabase ausfuehren.
- [x] Settings: Kontaktname + Labor-Email + Region (kzv_id) werden jetzt gespeichert.
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
- [x] Rechnungen: E-Mail-Senden Button + Popup (prefilled Empfaenger, Mailto mit Magic-Link).
- [ ] Rechnungen: DB-Migration `013_add_invoice_columns.sql` (patient_name + vat_rate) in Supabase ausfuehren.
- [x] Rechnungen: Fallback-Rechnungsnummer falls RPC `generate_invoice_number` fehlt.
- [x] Rechnungen: Fehlerfeedback im Rechnungs-Modal beim Erstellen.

## Notes
- Search & Favorites: Volltextsuche, Gruppenfilter, Sidebar fix + einklappbar, Multi-Select fuer Vorlagen.
- Templates: Custom-Positionen suchbar + farblich markiert; Mengen/Faktoren persistent; Add-Dialog fragt Menge.
- Settings: Stammdaten/Bank/Logo/Region/Kontakt/Email/Eigenpositionen persistent; Save-Feedback.
- Rechnungen: Erstellung + Liste mit Status/Icons/Summen/Checkbox "bezahlt"; Preview-Popup; PDF-Download; Mailto-Share.
- Template-Items speichern jetzt Menge + Faktor via `template_items`.
- Custom-Positions werden aus `custom_positions` geladen und beim Speichern synchronisiert.
- Favorites unterstuetzen jetzt `custom_position_id`.
- Migration hinzugefuegt: `website-app/supabase/migrations/011_favorites_custom_positions.sql`.
- Migration hinzugefuegt: `website-app/supabase/migrations/012_user_settings_columns.sql`.
- Migration hinzugefuegt: `website-app/supabase/migrations/013_add_invoice_columns.sql`.
- Migration hinzugefuegt: `website-app/supabase/migrations/014_user_settings_contact.sql`.
- Share-API: `/api/invoices/share` erzeugt Magic-Link; `/share/[token]` zeigt PDF via Server-API.
- Hinweis: `SUPABASE_SERVICE_ROLE_KEY` in Vercel erforderlich fuer Share-Link Zugriff auf Rechnungsdaten.
- Templates-UI: Custom-Highlighting und Add-Search inkludiert Eigenpositionen.
- Templates: Custom-Erkennung nutzt jetzt Code oder `db_id` (robust bei numerischen Eigenpositionen).
- Settings: Save schreibt `contact_name`, `lab_email`, `kzv_id`.
- Rechnungen: RPC-Fallback fuer Rechnungsnummer aktiviert.

## 2026-01-29 Updates
- Stripe Checkout: Landing-Buttons starten Checkout (API + Fallback), Preis-IDs pro Intervall gemappt.
- Stripe Webhook/Portal: userId metadata handling, subscription_interval gespeichert, Portal-Fehler im UI sichtbar.
- Subscription Reminder: Cron `/api/stripe?task=reminders` + Template `SubscriptionRenewalEmail`.
- PDF Preview: CSP erlaubt `blob:`, Mobile-Fallback (Data-URL) + "In neuem Tab" stabil.
- Magic-Link Invoice Share: Base-URL Fix (origin/VERCEL_URL/NEXT_PUBLIC_APP_URL) fuer Share Links.
- Auth Magic-Link Branding: neues Supabase HTML Template (docs/magic-link-email.html) + Login-Confirmation UI im Brand-Look.
- Migration: `website-app/supabase/migrations/017_subscription_interval_reminder.sql`.

## 2026-01-29 Updates (Spaeter)
- **DTVZ-XML Integration:** XML-Export fuer Zahnarzt-Praxissoftware (VDZI v4.5).
  - `lib/xml/generateDTVZ.ts`: XML-Generator mit Auftragsnummer, BEL-Format, MwSt-Gruppen.
  - Settings: IK-Nummer, Herstellungsort, xml_export_default persistent im Profil.
  - Email: Optionaler XML-Link zusaetzlich zum PDF-Link.
  - Share-Links: `link_type` Spalte (pdf/xml) mit Fallback fuer alte DB.
- **Chargennummern:** In Vorlagen + Rechnungen, angezeigt im PDF unter Beschreibung.
- **Eigenpositionen:** Kollabierbar ab 3+ Eintraegen, CSV-Import verbessert (Auto-Save).
- **Senden-Dialog:** Button wird gruen bei Erfolg, Fenster schliesst automatisch.
- **Migrations:**
  - 018: XML-Export Settings + link_type
  - 019: Chargennummern
  - 020: HKP-Nummer


## Sprint 28.1 Completed (2026-01-29)
- BEL-Positionsnummern Fix (Fuehrende Nullen / Anzeige stabil)
- KZV-Region Persistenz in Settings
- Rechnungs-Preview nach Erstellung + Liste
- Kunden-Pflichtfelder mit Sternchen + Validierung
- Stripe Checkout + Subscriptions + Landing Payment Links
- Supabase Auth Magic-Link Branding (Email + Login-Confirmation)
- Tour-Video Loop/Timing geglaettet (1.25x)
- Rechnung-PDF Formatierung (Kundennr., Adresse, LOT/Charge)


## Sprint 30.1 Completed (2026-01-30)
- [x] Night Mode Toggle aus Header entfernt (jetzt nur in Settings)
- [x] Settings-Seite mit Tabs reorganisiert (Abo, Labor, Konfiguration, Darstellung)
- [x] KZV-Region Modal nach Onboarding (KzvRegionModal.tsx)
- [x] PDF: Logo in Footer verschoben (links neben Stammdaten)
- [x] PDF: Bankverbindung-Balken mit 60% transparenter Brand-Farbe
- [x] Premium Features: Logo + Brand-Color fuer Pro/Expert
- [x] MD-Dateien aufgeraeumt (Bugs+Prio, Phase2, sprintplan 28.1 geloescht)
- [x] CLAUDE.md verschlankt (228 → 96 Zeilen)

## Beta Tester (Allowlist + Feedback)
- Allowlist: Tabelle `beta_allowlist` (email, status, role).
- Rollen-Sync: `/auth/callback` setzt `user_settings.role = beta_tester` fuer erlaubte Emails.
- Feedback: Tabelle `beta_feedback` + UI (Feedback Tab + Modal) + Admin-Log mit Filtern/Status.
- Migration: `website-app/supabase/migrations/021_beta_allowlist_feedback.sql`.

**Telegram Alerts (Beta Feedback):**
- Edge Functions: `beta-feedback-telegram` (Instant Bug Push) + `beta-feedback-weekly-summary` (Wochenuebersicht).
- Migration: `website-app/supabase/migrations/022_beta_feedback_telegram.sql`.
- Secrets (Supabase Functions): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Cron: alle 3 Min fuer Bugs, Freitag 19:45 CET/CEST fuer Summary (UTC Offset beachten).

**Beta-Tester anlegen:**
- `beta_allowlist` Insert: `email` (lowercase), `status='invited'`, `role='beta_tester'`.
- Beim Login wird Status auf `active` gesetzt und Role vergeben.
