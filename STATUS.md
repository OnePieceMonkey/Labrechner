# LABRECHNER - Projektstatus

> **Stand:** 30.01.2026 | **Phase:** MVP Beta-Test gestartet

## Quick Facts

| Metrik | Wert |
|--------|------|
| **Domain** | labrechner.de (live auf Vercel) |
| **Beta-Status** | AKTIV (seit 30.01.2026) |
| **BEL-Preise** | 3.663 (17 KZVs) |
| **Stack** | Next.js 16.1.3 + Supabase + Stripe + Resend |
| **Build** | ✅ OK |
| **Email-System** | ✅ Resend aktiv (@mail.labrechner.de) |

## Entwicklungs-Workflow (Beta-Phase)

| Branch | URL | Verwendung |
|--------|-----|------------|
| `main` | labrechner.de | Production (Beta-Nutzer) |
| `develop` | Preview-URL | Neue Features |
| `feature/*` | Preview-URL | Experimente |

**Wichtig:** Waehrend der Beta-Phase nur getestete Features via PR von `develop` nach `main` mergen!

## Preismodell (NEU)

| Plan | Preis | Limits |
|------|-------|--------|
| **Starter** | 0€ | 3 Rechnungen/Monat |
| **Pro** | 49€ | Unbegrenzt, BEL+BEB, Logo |
| **Expert** | 89€ | KI-Plausibilitäts-Check, Multi-User |

## Aktuelle Features & Stabilisierung (28.01.2026)

### Heute implementiert (Sprint 28.1)


- [x] **Telegram Alerts (Beta-Feedback):** Edge Functions + Cron eingerichtet, Migration 022 (Tests/Feinschliff ausstehend)
- [x] **Beta-Tester Allowlist + Feedback:** Allowlist (beta_allowlist), Rollen-Sync, Feedback-UI + Admin-Log
- [x] **Beta-Tester Anlage:** Insert in beta_allowlist (email lowercase, status invited, role beta_tester)
- [x] **React-Email Integration:** Professionelle Email-Templates für Rechnungsversand
- [x] **Email-Versand via Resend:** hello@mail.labrechner.de mit Branding, CTA-Button, Footer
- [x] **BEL Position-Nummern Fix:** Führende Nullen bleiben erhalten (001-815)
- [x] **Kunden-Pflichtfelder:** Sternchen-Markierung + Validierung mit Fehlermeldungen
- [x] **Environment-Variablen:** SUPABASE_SERVICE_ROLE_KEY + LABRECHNER_EMAIL_FROM konfiguriert
- [x] **Share-Link-System:** Funktioniert für öffentliche Rechnungsansicht

### Bereits implementiert (vorherige Sprints)
- [x] **Settings-Interaktivität:** Felder sind wieder flüssig editierbar (lokaler State entkoppelt)
- [x] **Profil-Speichern:** Button in Einstellungen mit Feedback
- [x] **KZV-Region Persistenz:** Region wird korrekt gespeichert und geladen
- [x] **Sidebar:** Fix + einklappbar
- [x] **Dark-Mode:** Toggle funktioniert
- [x] **Favoriten:** Gruppen-Filter + Custom-Positionen als Favorit
- [x] **Templates:** Menge + Faktor persistent + Custom-Positionen suchbar
- [x] **Rechnungen:** Status-Karten, PDF-Preview, Email-Send, paid-Checkbox
- [x] **Build-Fixes:** Fehlende Imports und Type-Casts für Vercel korrigiert

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
- [ ] **Telegram Alerts verifizieren:** Manuelle Tests + Logs pruefen (Instant-Bug + Weekly Summary)
- [ ] **Mobile Ansicht:** Responsive Fixes für Header, Modals, Dashboard-Views
- [ ] **Tour-Video Loop-Fix:** Doppel-Loop beheben
- [ ] **PDF-Formatierung:** Kundennr. Position, Adress-Trennung mit Komma
- [ ] **Stripe Payment Links:** Links auf Landing-Page korrigieren

### Nächste Woche
- [ ] **E2E-Test:** Vollständiger Durchlauf: Kunde anlegen -> Vorlage erstellen -> Rechnung generieren -> MwSt-Split prüfen
- [ ] **Stripe Webhook:** Signing Secret Verifizierung im Live-System
- [ ] **Onboarding-Tour:** Kurze Einführung für neue Labore entwerfen

### Backlog
- [ ] **Support-Ticket System:** n8n-Workflow für support@labrechner.de → Supabase Tickets
- [ ] **Kunden-Zugang nach Löschung:** 3-6 Monate Rechnungs-Zugriff via Share-Links
- [ ] **KI-Vorschläge:** Vector DB für Template-Vorschläge (OpenAI)
- [ ] **Chatbot:** KI-gesteuert, UI-Placeholder + Routing
- [ ] **Waitlist & Funnel:** Landing-Page Integration
- [ ] **BEB-Stamm:** Import-Möglichkeit für private BEB-Leistungen
- [ ] **Spracheingabe:** Mikrofon in Suchleiste für Sprachsuche
- [ ] **FAQ:** Erstellen und in Landing-Page einbauen
- [ ] **BEL-Listen:** Alte/neue BEL visuell kennzeichnen
- [ ] **IT Security Check:** Penetration-Test durchführen

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


## Beta-Tester anlegen (Kurz)
- Tabelle: `beta_allowlist`
- Felder: `email` (lowercase), `status='invited'`, `role='beta_tester'`
- Nach erstem Login: Status -> `active`, Role wird in `user_settings` gesetzt.
