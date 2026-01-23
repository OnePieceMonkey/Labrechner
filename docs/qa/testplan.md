# Testplan Labrechner

**Version:** 1.0
**Stand:** Januar 2026
**Geplante Umsetzung:** Woche 5 (laut Sprintplan)

---

## 1. Test-Strategie

### 1.1 Test-Pyramide

```
           /\
          /  \      E2E Tests (Playwright)
         /    \     → Kritische User Journeys
        /------\    → 5-10 Tests
       /        \
      /          \   Integration Tests (Vitest)
     /            \  → API-Endpunkte, Supabase-Queries
    /--------------\ → 20-30 Tests
   /                \
  /                  \ Unit Tests (Vitest)
 /                    \→ Utilities, Hooks, Helper
/----------------------\→ 30-50 Tests
```

### 1.2 Empfohlene Test-Libraries

| Library | Zweck | Version |
|---------|-------|---------|
| **Vitest** | Unit & Integration Tests | ^2.0.0 |
| **@testing-library/react** | React-Komponenten | ^16.0.0 |
| **@testing-library/jest-dom** | DOM-Assertions | ^6.0.0 |
| **Playwright** | E2E-Tests | ^1.48.0 |
| **MSW** | API-Mocking (optional) | ^2.0.0 |

---

## 2. Test-Szenarien

### 2.1 Such-Funktion (Priorität: HOCH)

| Test-ID | Beschreibung | Input | Erwartetes Ergebnis |
|---------|--------------|-------|---------------------|
| S-001 | Positions-Suche (exakt) | "102 1" | Position "Vollkrone/Metall" wird angezeigt |
| S-002 | Positions-Suche (nur Nummer) | "102" | Alle 102er Positionen |
| S-003 | Text-Suche | "Vollkrone" | Alle Positionen mit "Vollkrone" |
| S-004 | Text-Suche (Teilwort) | "Krone" | Vollkrone, Teleskopkrone, etc. |
| S-005 | Fuzzy-Suche (Typo) | "Volkrone" | Vollkrone vorgeschlagen |
| S-006 | Leere Suche | "" | Alle Positionen / Standardansicht |
| S-007 | Sonderzeichen | "Krone/Metall" | Korrekte Ergebnisse |
| S-008 | Keine Treffer | "xyz123" | "Keine Ergebnisse" Meldung |

### 2.2 Filter-Funktion (Priorität: HOCH)

| Test-ID | Beschreibung | Filter | Erwartung |
|---------|--------------|--------|-----------|
| F-001 | KZV-Filter Bayern | region=bayern | Nur Bayern-Preise |
| F-002 | KZV-Filter NRW | region=nordrhein | Nur NRW-Preise |
| F-003 | Labor-Typ Praxis | laborTyp=praxis | 95% der Preise |
| F-004 | Labor-Typ Gewerbe | laborTyp=gewerbe | 100% der Preise |
| F-005 | Kombination | Bayern + Praxis | Korrekt kombiniert |
| F-006 | Filter zurücksetzen | Clear | Alle Regionen/Typen |

### 2.3 Edge Cases (Priorität: MITTEL)

| Test-ID | Szenario | Beschreibung | Erwartung |
|---------|----------|--------------|-----------|
| E-001 | Position ohne festen Preis | 933 0 (Versandkosten) | "Nach Aufwand" oder Hinweis |
| E-002 | UKPS-Varianten | Position x vs. x5 | Beide korrekt angezeigt |
| E-003 | Implantat-Varianten | Position x vs. x8 | Beide korrekt angezeigt |
| E-004 | Regionale Differenzen | Gleiche Position, versch. KZVs | Unterschiedliche Preise |
| E-005 | Praxislabor-Abzug | Preis × 0.95 | Korrekter Abzug |

### 2.4 Authentifizierung (Priorität: HOCH)

| Test-ID | Beschreibung | Erwartung |
|---------|--------------|-----------|
| A-001 | Magic-Link anfordern | E-Mail wird gesendet |
| A-002 | Magic-Link einlösen | User wird eingeloggt |
| A-003 | Logout | Session beendet, Redirect zur Landing |
| A-004 | Geschützte Route ohne Login | Redirect zu /login |
| A-005 | Session abgelaufen | Automatischer Logout |

### 2.5 KI-Assistent (Priorität: MITTEL)

| Test-ID | Beschreibung | Erwartung |
|---------|--------------|-----------|
| K-001 | Einfache Preis-Frage | Korrekte Antwort mit Preis |
| K-002 | Positions-Erklärung | Verständliche Erklärung |
| K-003 | Ungültige Frage | Freundliche Fehlerantwort |
| K-004 | Disclaimer sichtbar | Hinweis immer präsent |

---

## 3. Daten-Verifizierung

### 3.1 Stichproben-Prüfung

Für jede importierte KZV-Region mindestens 5 Positionen gegen Original-PDF prüfen:

| Position | Bezeichnung | Quelle |
|----------|-------------|--------|
| 001 0 | Arbeitsmodell | Gruppe 0 |
| 102 1 | Vollkrone/Metall | Gruppe 1 |
| 120 0 | Teleskopkrone | Gruppe 1 |
| 301 0 | Aufstellung | Gruppe 3 |
| 801 0 | Instandsetzung | Gruppe 8 |

### 3.2 Automatisierte Daten-Tests

```typescript
// Beispiel: Preis-Plausibilitäts-Test
test('Alle Preise sind positiv', async () => {
  const prices = await getAllPrices()
  prices.forEach(p => {
    expect(p.price).toBeGreaterThan(0)
  })
})

test('Praxislabor ist immer 95% von Gewerbe', async () => {
  const pairs = await getPraxisGewerbePairs()
  pairs.forEach(pair => {
    expect(pair.praxis).toBeCloseTo(pair.gewerbe * 0.95, 2)
  })
})
```

---

## 4. Test-Umgebung Setup

### 4.1 package.json Erweiterungen

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@playwright/test": "^1.48.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 4.2 vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4.3 playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 5. Test-Ordnerstruktur

```
website-app/
├── tests/
│   ├── setup.ts                 # Test-Setup
│   ├── unit/
│   │   ├── hooks/
│   │   │   ├── useSearch.test.ts
│   │   │   └── useUser.test.ts
│   │   └── utils/
│   │       └── formatPrice.test.ts
│   ├── integration/
│   │   ├── api/
│   │   │   └── bel-search.test.ts
│   │   └── components/
│   │       └── SearchBar.test.tsx
│   └── e2e/
│       ├── search.spec.ts
│       ├── filter.spec.ts
│       └── auth.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 6. Acceptance Criteria

### MVP Ready wenn:

- [ ] 80%+ Unit-Test-Coverage für kritische Utils/Hooks
- [ ] Alle Such-Szenarien (S-001 bis S-008) bestanden
- [ ] Alle Filter-Szenarien (F-001 bis F-006) bestanden
- [ ] Mindestens 3 KZV-Regionen Daten verifiziert
- [ ] Kritischer E2E-Flow (Suche → Filter → Ergebnis) bestanden
- [ ] Auth-Flow (Login → Nutzung → Logout) bestanden
- [ ] Keine kritischen Bugs offen

---

## 7. CI/CD Integration (optional)

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## TODO für Woche 5

- [ ] Test-Libraries installieren
- [ ] Vitest konfigurieren
- [ ] Playwright konfigurieren
- [ ] Erste Unit-Tests schreiben
- [ ] E2E-Tests für kritische Flows
- [ ] Coverage-Report erstellen
