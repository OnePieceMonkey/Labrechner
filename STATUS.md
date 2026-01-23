# LABRECHNER - Status

> **Stand:** 24.01.2026 | **Phase:** 6 (Launch Prep)

## Quick Facts

| Metrik | Wert |
|--------|------|
| BEL-Preise | 3663 (17 KZVs) |
| Stack | Next.js 14 + Supabase + Stripe |
| Build | OK |
| Blocker | Vercel Root Directory |

## Launch Checklist (Priorisiert)

### Tier 1 - Ohne diese kein Launch
- [x] Stripe Products erstellen (Starter €0, Pro €49, Enterprise €79)
- [ ] Vercel Root Directory auf `website-app` setzen
- [ ] Vercel Env-Variablen setzen
- [ ] Stripe Webhook URL konfigurieren
- [ ] Domain kaufen + DNS

### Tier 2 - Vor Beta-Launch
- [ ] OpenAI Usage Limits ($50/Monat)
- [ ] RLS Policies verifizieren
- [ ] Production Build testen

### Tier 3 - Vor Public Launch
- [ ] Legal Pages mit echten Firmendaten
- [ ] E2E Testing (Login → Rechnung → PDF → Zahlung)

## Letzte Session (24.01 - Session 6)

- Stripe Products erstellt (3 Preisstufen)
- `.env.local` mit allen Keys konfiguriert
- Preise in UI aktualisiert (Pro: 49€, Business: 79€)
- Doppelter Header entfernt (Marketing Layout bereinigt)
- KZV Dropdown Kontrast verbessert
- Vercel-Problem identifiziert: Root Directory muss auf `website-app` gesetzt werden

## Known Issues

- 5 KZVs haben 2025-Daten (Berlin, Brandenburg, Bremen, Hessen, Saarland)
- Hamburg Multiplikatoren nicht implementiert
- Tour/Onboarding nicht implementiert
- Mikrofon/Spracheingabe nicht implementiert
- KI-Chatbot Interface nicht implementiert

## Backlog (Post-Launch)

- Chat-Interface für KI
- Festzuschuss-Rechner
- Hamburg-Kalkulator
- KI-Mehrwert-Tracking
- Referral-System
- Tour/Onboarding

## Links

| Service | URL |
|---------|-----|
| Supabase | https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz |
| GitHub | https://github.com/OnePieceMonkey/Labrechner |
| Vercel | https://labrechner.vercel.app |
| Stripe | https://dashboard.stripe.com |
