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

## Aktuelle Fehler & Stabilisierungs-Fokus (25.01 - Abend)

### Bekannte Probleme (In Arbeit)
- [ ] **Suche filtert nicht:** Texteingabe triggert zwar den Hook, aber die Anzeige bleibt statisch.
- [ ] **Favoriten-Stern ohne Funktion:** Mapping zwischen UI-Code und Datenbank-ID bricht ab, wenn Mapping-Quelle nicht bereit ist.
- [ ] **Gruppen-Filter:** Auswahl in Sidebar führt nicht zur Filterung der Liste.
- [ ] **Selektions-Bug:** Multi-Auswahl für Vorlagen verhält sich wie Single-Auswahl oder wird zurückgesetzt.

### Heute erledigt (Meilensteine)
- [x] **Settings-Interaktivität:** Felder sind wieder flüssig editierbar (lokaler State entkoppelt).
- [x] **Profil-Speichern:** Neuer Button in den Einstellungen schreibt Daten erfolgreich in die Supabase-DB.
- [x] **Regions-Persistenz:** Grundlogik für das Speichern der KZV-Region im Profil steht.
- [x] **Build-Fixes:** Fehlende Imports und Type-Casts für Vercel korrigiert.

## Roadmap V2
... (Rest der Datei)
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