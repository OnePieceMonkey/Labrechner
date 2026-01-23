# Labrechner Brand Guidelines

> Diesen Skill verwenden bei: Landing Page, UI-Texte, Marketing-Content, E-Mails, Dokumentation

---

## Markenidentität

| Element | Wert |
|---------|------|
| **Produktname** | Labrechner |
| **Domain** | labrechner.de |
| **Tagline** | BEL-Abrechnung. Einfach. Aktuell. |

---

## Farbpalette

### Primärfarben

| Farbe | HEX | RGB | Verwendung |
|-------|-----|-----|------------|
| **Primary** | `#8B5CF6` | 139, 92, 246 | Buttons, Links, Akzente, CTAs |
| **Primary Dark** | `#7C3AED` | 124, 58, 237 | Hover-States, aktive Elemente |
| **Primary Light** | `#A78BFA` | 167, 139, 250 | Backgrounds, dezente Akzente |

### Neutralfarben

| Farbe | HEX | RGB | Verwendung |
|-------|-----|-----|------------|
| **Gray 900** | `#111827` | 17, 24, 39 | Überschriften, wichtiger Text |
| **Gray 700** | `#374151` | 55, 65, 81 | Body-Text |
| **Gray 500** | `#6B7280` | 107, 114, 128 | Sekundärer Text, Platzhalter |
| **Gray 300** | `#D1D5DB` | 209, 213, 219 | Borders, Trennlinien |
| **Gray 100** | `#F3F4F6` | 243, 244, 246 | Hintergründe, Cards |
| **White** | `#FFFFFF` | 255, 255, 255 | Haupthintergrund |

### Semantische Farben

| Farbe | HEX | Verwendung |
|-------|-----|------------|
| **Success** | `#10B981` | Erfolgsmeldungen, positive Werte |
| **Warning** | `#F59E0B` | Warnungen, Hinweise |
| **Error** | `#EF4444` | Fehler, kritische Meldungen |
| **Info** | `#3B82F6` | Informationen, Tooltips |

### CSS Custom Properties

```css
:root {
  /* Primary */
  --color-primary: #8B5CF6;
  --color-primary-dark: #7C3AED;
  --color-primary-light: #A78BFA;

  /* Neutrals */
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-300: #D1D5DB;
  --color-gray-100: #F3F4F6;
  --color-white: #FFFFFF;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
      },
    },
  },
}
```

---

## Typografie

### Schriftart

**Inter** – Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Schriftgrößen

| Element | Größe | Gewicht | Line-Height |
|---------|-------|---------|-------------|
| **H1** | 36px / 2.25rem | 700 (Bold) | 1.2 |
| **H2** | 30px / 1.875rem | 600 (Semibold) | 1.25 |
| **H3** | 24px / 1.5rem | 600 (Semibold) | 1.3 |
| **H4** | 20px / 1.25rem | 600 (Semibold) | 1.4 |
| **Body** | 16px / 1rem | 400 (Regular) | 1.6 |
| **Small** | 14px / 0.875rem | 400 (Regular) | 1.5 |
| **Caption** | 12px / 0.75rem | 500 (Medium) | 1.4 |

---

## Brand Voice

### Tonalität

**Freundlich & kompetent** – Wir sind Experten, die verständlich kommunizieren.

| Eigenschaft | Beschreibung |
|-------------|--------------|
| **Professionell** | Fachlich korrekt, aber nicht steif |
| **Klar** | Einfache Sprache, keine unnötige Komplexität |
| **Hilfsbereit** | Lösungsorientiert, unterstützend |
| **Vertrauenswürdig** | Zuverlässig, transparent |

### Ansprache

- **Siezen** – "Sie können...", "Ihre Daten..."
- Höflich, aber nicht übertrieben formell
- Direkte Ansprache bevorzugen

### Schreibregeln

1. **Aktiv statt passiv**: "Sie finden die Preise unter..." statt "Die Preise werden gefunden unter..."
2. **Konkret statt abstrakt**: "3 BEL-Positionen gefunden" statt "Einige Ergebnisse"
3. **Kurze Sätze**: Max. 20 Wörter pro Satz
4. **Keine Floskeln**: Kein "herzlich willkommen", kein "wir freuen uns"
5. **Fachbegriffe erlaubt**: BEL, KZV, Zahntechnik-Begriffe ohne Erklärung (Zielgruppe kennt sie)

### Beispiele

| Situation | So nicht | So besser |
|-----------|----------|-----------|
| Begrüßung | "Herzlich willkommen bei Labrechner!" | "Labrechner – BEL-Preise schnell finden" |
| Leere Suche | "Leider konnten wir nichts finden." | "Keine Ergebnisse für Ihre Suche." |
| Fehler | "Ups, da ist etwas schiefgelaufen!" | "Die Anfrage konnte nicht verarbeitet werden." |
| Erfolg | "Super, das hat geklappt!" | "Preisliste erfolgreich exportiert." |

---

## UI-Komponenten Stil

### Buttons

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: background-color 150ms;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
}
```

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px (0.5rem) |
| Cards | 12px (0.75rem) |
| Inputs | 8px (0.5rem) |
| Modals | 16px (1rem) |
| Pills/Tags | 9999px (full) |

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

---

## Logo

> Logo wird noch entwickelt. Vorerst Wortmarke verwenden:

**Wortmarke**: "Labrechner" in Inter Bold, Primary Color (#8B5CF6)

```css
.logo-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #8B5CF6;
}
```

---

## Zielgruppe

| Aspekt | Detail |
|--------|--------|
| **Primär** | Zahntechniklabore (Inhaber, Abrechnungsmitarbeiter) |
| **Sekundär** | Zahnarztpraxen mit Eigenlabor |
| **Region** | Deutschland |
| **Branche** | Zahntechnik, Dental |

---

## Kontakt & Rechtliches

| Element | Wert |
|---------|------|
| **Impressum** | [Nach Firmengründung ergänzen] |
| **Datenschutz** | DSGVO-konform, Gesundheitsdaten beachten |
| **Support-E-Mail** | [Noch festzulegen] |

---

*Erstellt: Januar 2025*
*Version: 1.0*
