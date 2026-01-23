# LABRECHNER - Status

> **Stand:** 23.01.2026 | **Phase:** 6 (Launch Prep)

## Quick Facts

| Metrik | Wert |
|--------|------|
| BEL-Preise | 3663 (17 KZVs) |
| Stack | Next.js 14 + Supabase + Stripe |
| Build | OK |
| Blocker | Keine |

## Launch Checklist (Priorisiert)

### Tier 1 - Ohne diese kein Launch
- [ ] Stripe Products erstellen (Free, Pro €29, Enterprise €79)
- [ ] Vercel Env-Variablen setzen (siehe unten)
- [ ] Stripe Webhook URL konfigurieren
- [ ] Domain kaufen + DNS

### Tier 2 - Vor Beta-Launch
- [ ] OpenAI Usage Limits ($50/Monat)
- [ ] RLS Policies verifizieren
- [ ] Production Build testen

### Tier 3 - Vor Public Launch
- [ ] Legal Pages mit echten Firmendaten
- [ ] E2E Testing (Login → Rechnung → PDF → Zahlung)

## Environment Variables (Vercel)

```
# Supabase (bereits gesetzt)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Stripe (FEHLT)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PROFESSIONAL
STRIPE_PRICE_ENTERPRISE

# OpenAI (FEHLT)
OPENAI_API_KEY

# App (FEHLT)
NEXT_PUBLIC_APP_URL
```

## Known Issues

- 5 KZVs haben 2025-Daten (Berlin, Brandenburg, Bremen, Hessen, Saarland)
- Hamburg Multiplikatoren nicht implementiert
- .env.example fehlt Stripe/OpenAI Keys

## Letzte Session (23.01 - Session 5)

V3-Landing komplett portiert (11 Komponenten) + Admin-RBAC (Migration 004).
Admin: werle.business@gmail.com

## Backlog (Post-Launch)

- Chat-Interface für KI
- Festzuschuss-Rechner
- Hamburg-Kalkulator
- KI-Mehrwert-Tracking
- Referral-System

## Links

| Service | URL |
|---------|-----|
| Supabase | https://supabase.com/dashboard/project/yaxfcbokfyrcdgaiyrxz |
| GitHub | https://github.com/OnePieceMonkey/Labrechner |
| Vercel | https://labrechner.vercel.app |
