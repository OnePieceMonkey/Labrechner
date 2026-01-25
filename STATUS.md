# LABRECHNER - Projektstatus

> **Stand:** 25.01.2026 | **Phase:** V2 Rollout

## Quick Facts

| Metrik | Wert |
|--------|------|
| **Domain** | labrechner.de (live auf Vercel) |
| **BEL-Preise** | 3.663 (17 KZVs) |
| **Stack** | Next.js 14 + Supabase + Stripe |
| **Build** | OK |

## Preismodell (NEU)

| Plan | Preis | Limits |
|------|-------|--------|
| **Starter** | 0€ | 3 Rechnungen/Monat |
| **Pro** | 49€ | Unbegrenzt, BEL+BEB, Logo |
| **Expert** | 89€ | KI-Plausibilitäts-Check, Multi-User |

## Heute erledigt (25.01)

- [x] **Favoriten-System Final:** Stabiles Mapping via numerischer `db_id` und automatischer UI-Refresh. Favoriten-Tab filtert nun korrekt.
- [x] **Regions-Persistenz:** Region wird nun strikt aus dem DB-Profil geladen und Änderungen sofort synchronisiert (kein Reset auf Bayern).
- [x] **2026-Check:** Visuelle Kennzeichnung (grünes Häkchen & Label) für Positionen mit aktuellen 2026er Preisen.
- [x] **Onboarding-Tour v2:** Navigation mit "Zurück"-Button, automatischer Reset auf Schritt 1 und optimierte Animationen.
- [x] **Spracherkennung:** Echte Web Speech API Integration in der Suchleiste zum Diktieren von Positionen.
- [x] **Dashboard-Sync:** Region & Labortyp werden jetzt automatisch aus den User-Settings geladen.
- [x] **Vorlagen-Modal:** Detailliertes Popup für neue Vorlagen mit Name, Menge, Faktor und Live-Preisberechnung.
- [x] **Kunden-Sync:** Fix für die Speicherung und Anzeige neu angelegter Zahnärzte (Echtzeit-DB-Spiegelung).
- [x] **Rechnungserstellung v2:** "Rechnung erstellen" aus Vorlagen öffnet nun das Basisdaten-Modal (Kunde/Patient) und übernimmt alle Positionen.
- [x] **MwSt-Flexibilität:** Steuer-Auswahl (7%/19%) für Eigenpositionen implementiert; korrekte Berechnung in Rechnungen.
- [x] **PDF-Vollständigkeit:** Labordaten, Gerichtsstand und Steuer-IDs werden nun korrekt im Rechnungs-PDF ausgegeben.
- [x] Migration 005 - 010 in Supabase ausgeführt
- [x] Frontend Legal: AVV-Modal & KI-Disclaimer implementiert (Blocking)
- [x] Backend-Logik für Split-MwSt (7%/19%) via Trigger implementiert
- [x] InvoicePDF: Anzeige der MwSt-Trennung & Patientennamen
- [x] Patientenname in DB, UI und PDF implementiert
- [x] Admin-Rechte & Vercel Config für Stripe Pläne hinterlegt
- [x] Login-Loop Fix: Redirect URLs in Supabase inkl. 'www' konfiguriert
- [x] BEL-Suche: Infinite Scroll & initiale Liste (Lazy Loading) implementiert
- [x] Vorlagen: Suche über alle BEL-Positionen via `useAllPositions`
- [x] Kunden-Dropdown in Rechnungen mit DB-Kunden synchronisiert
- [x] Mobile UI: Fixes für Header, Kunden-Button und Einstellungen
- [x] Abonnements: Pricing-Section in Einstellungen integriert (Loop-Fix)
- [x] Bereinigung: Veraltete Dateien und Ordner gelöscht

## Noch offen (Prio)

### Diese Woche
- [ ] **E2E-Test:** Vollständiger Durchlauf: Kunde anlegen -> Vorlage erstellen -> Rechnung generieren -> MwSt-Split prüfen.
- [ ] **Stripe Webhook:** Signing Secret Verifizierung im Live-System.
- [ ] **Onboarding-Tour:** Kurze Einführung für neue Labore entwerfen.
- [ ] **BEB-Stamm:** Import-Möglichkeit für private BEB-Leistungen prüfen.

## Roadmap V2

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Pricing + Compliance | Erledigt |
| 2 | MwSt-Logik (7%/19%) | Erledigt |
| 3 | Multi-User (Organizations) | In Arbeit |
| 4 | KI-Plausibilitäts-Check | Geplant |
| 5 | CSV-Import, n8n Scraper | Geplant |
| 6 | VDDS-XML Export | Geplant |

## Known Issues

- 5 KZVs haben 2025-Daten (Berlin, Brandenburg, Bremen, Hessen, Saarland)
- Hamburg Multiplikatoren nicht implementiert

## Links

| Service | URL |
|---------|-----|
| Live | https://labrechner.de |
| Vercel | https://vercel.com/patrick-werles-projects/labrechner |
| Supabase | https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz |
| GitHub | https://github.com/OnePieceMonkey/Labrechner |
| Stripe | https://dashboard.stripe.com |

---

## Dokumentation

| Datei | Inhalt |
|-------|--------|
| `CLAUDE.md` | Projekt-Kontext für KI |
| `STATUS.md` | Aktueller Status (diese Datei) |
| `brand-guidelines.md` | Farben, Fonts, Voice |
| `docs/ARCHITECTURE.md` | Detaillierte Architektur |
| `docs/IDEAS.md` | Geparkte Feature-Ideen |