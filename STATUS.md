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

## Noch offen (Prio)

### Diese Woche
- [ ] Migration 005 in Supabase ausführen
- [ ] Vercel: STRIPE_PRICE_EXPERT hinzufügen
- [ ] Admin-Rolle für werle.business@gmail.com setzen

### Nächste Woche
- [ ] AVV-Modal implementieren
- [ ] AI-Disclaimer Modal
- [ ] MwSt-Trennung (7%/19%) im PDF

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
