# LABRECHNER - Projektstatus

> **Stand:** 24.01.2026 | **Phase:** V2 Rollout

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

## Heute erledigt (24.01)

- [x] Domain labrechner.de mit Vercel verbunden
- [x] Favicon erstellt (favicon.svg)
- [x] Doppelter Header im Dashboard behoben
- [x] Doppelter Footer auf Startseite behoben
- [x] Preise aktualisiert: Starter/Pro/Expert (0€/49€/89€)
- [x] Free-Limit auf 3 Rechnungen/Monat reduziert
- [x] Migration 005 erstellt (V2 Features)
- [x] `.env.example` korrigiert (ENTERPRISE → EXPERT)
- [x] `.env.local`: STRIPE_PRICE_EXPERT eingetragen
- [x] RBAC-Redirect: Admin → /dashboard, User → /app
- [x] Migration 005 korrigiert (custom_positions entfernt)

## Heute erledigt (25.01)

- [x] Migration 005, 006, 007 & 008 in Supabase ausgeführt
- [x] Frontend Legal: AVV-Modal & KI-Disclaimer implementiert (Blocking)
- [x] Type-Definitions für neue DB-Felder aktualisiert (AVV, AI, Split-MwSt, Subscriptions)
- [x] Backend-Logik für Split-MwSt (7%/19%) via Trigger implementiert
- [x] InvoicePDF aktualisiert: Anzeige der MwSt-Trennung (7%/19%) & Patientennamen
- [x] Patientenname in DB, UI und PDF implementiert
- [x] TypeScript Type-Mismatch für patient_name behoben (Build-Fix)
- [x] Admin-Rechte für werle.business@gmail.com vergeben
- [x] Vercel Konfiguration: STRIPE_PRICE_PROFESSIONAL & STRIPE_PRICE_EXPERT hinterlegt

## Noch offen (Prio)

### Diese Woche
- [ ] **E2E-Test:** In der App eine Test-Rechnung erstellen, die sowohl eine BEL-Position (7%) als auch eine Eigenposition/Material (19%) enthält, um den PDF-Split und Patientenamen zu prüfen.
- [ ] **Stripe Webhook:** Sicherstellen, dass die Webhook-URL in Stripe auf `https://labrechner.de/api/stripe/webhook` zeigt.
- [ ] **Onboarding-Tour:** (Optional für MVP) Erste Entwürfe für eine kurze Einführungstour für neue Nutzer.



## Roadmap V2

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Pricing + Compliance | In Arbeit |
| 2 | MwSt-Logik (7%/19%) | Geplant |
| 3 | Multi-User (Organizations) | Geplant |
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
| Vercel | https://labrechner.vercel.app |
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
