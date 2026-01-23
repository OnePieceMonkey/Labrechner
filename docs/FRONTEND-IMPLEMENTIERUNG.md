# Frontend-Implementierung: Legal, Marketing & SEO

**Stand:** 18. Januar 2026
**Für:** Frontend-Team
**Priorität:** HOCH (vor Go-Live erforderlich)

---

## Übersicht

Dieses Dokument beschreibt, welche Seiten und Dateien im `website-app` Projekt erstellt werden müssen, basierend auf den vorbereiteten Content-Dokumenten in `docs/`.

---

## 1. Legal-Seiten (KRITISCH)

> **Hinweis:** Der Footer verlinkt bereits auf `/impressum` und `/datenschutz` - diese zeigen aktuell 404!

### 1.1 Impressum-Seite

| Eigenschaft | Wert |
|-------------|------|
| **Route** | `/impressum` |
| **Datei erstellen** | `src/app/impressum/page.tsx` |
| **Content-Quelle** | `docs/legal/impressum-content.md` |
| **Layout** | Marketing-Layout (ohne App-Header) |

**Wichtig für Impressum:**
- Patrick tritt als **Kleinunternehmer** auf (keine GmbH)
- Folgende Platzhalter müssen ersetzt werden:
  - `[FIRMENNAME]` → Patrick Werle (Einzelunternehmer)
  - `[Straße Nr.]` → Tatsächliche Adresse
  - `[PLZ Ort]` → Tatsächliche Adresse
  - `[Geschäftsführer Name]` → Patrick Werle
  - Handelsregister/USt-ID: Entfällt bei Kleinunternehmer (§19 UStG)

```tsx
// src/app/impressum/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | Labrechner',
  description: 'Impressum und rechtliche Angaben zu Labrechner',
}

export default function ImpressumPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      {/* Content aus docs/legal/impressum-content.md */}

    </main>
  )
}
```

### 1.2 Datenschutz-Seite

| Eigenschaft | Wert |
|-------------|------|
| **Route** | `/datenschutz` |
| **Datei erstellen** | `src/app/datenschutz/page.tsx` |
| **Content-Quelle** | `docs/legal/datenschutz-content.md` |
| **Layout** | Marketing-Layout |

```tsx
// src/app/datenschutz/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Labrechner',
  description: 'Datenschutzerklärung für die Nutzung von Labrechner',
}

export default function DatenschutzPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      {/* Content aus docs/legal/datenschutz-content.md */}

    </main>
  )
}
```

### 1.3 AGB-Seite (Optional für Beta)

| Eigenschaft | Wert |
|-------------|------|
| **Route** | `/agb` |
| **Datei erstellen** | `src/app/agb/page.tsx` |
| **Content-Quelle** | `docs/legal/agb-entwurf.md` |
| **Priorität** | Mittel (kann nach Beta kommen) |

---

## 2. SEO-Dateien

### 2.1 robots.txt

| Eigenschaft | Wert |
|-------------|------|
| **Datei erstellen** | `public/robots.txt` |
| **Content-Quelle** | `docs/marketing/robots-sitemap-spec.md` |

```
# public/robots.txt
User-agent: *
Allow: /

Disallow: /app/settings
Disallow: /api/

Sitemap: https://labrechner.de/sitemap.xml
```

### 2.2 sitemap.xml (dynamisch)

| Eigenschaft | Wert |
|-------------|------|
| **Datei erstellen** | `src/app/sitemap.ts` |
| **Content-Quelle** | `docs/marketing/robots-sitemap-spec.md` |

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://labrechner.de'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/app`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
```

### 2.3 Open Graph Image

| Eigenschaft | Wert |
|-------------|------|
| **Option A** | `public/og-image.png` (statisch, 1200x630px) |
| **Option B** | `src/app/opengraph-image.tsx` (dynamisch) |
| **Design-Spec** | `docs/marketing/og-image-spec.md` |

**Nach Erstellung in `layout.tsx` ergänzen:**

```typescript
// In src/app/layout.tsx metadata ergänzen:
openGraph: {
  // ...existing
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Labrechner - BEL-Preise in Sekunden finden',
    },
  ],
},
```

---

## 3. Optional: FAQ-Seite

| Eigenschaft | Wert |
|-------------|------|
| **Route** | `/faq` |
| **Datei erstellen** | `src/app/faq/page.tsx` |
| **Content-Quelle** | `docs/marketing/faq-content.md` |
| **Priorität** | Niedrig (Nice-to-have) |

**Empfehlung:** Accordion-Komponente für FAQ verwenden.

---

## 4. KI-Disclaimer (für Chat-Feature)

Wenn der KI-Chat implementiert wird:

| Wo | Was anzeigen |
|----|--------------|
| Chat-Header | "KI-Assistent (Beta) - Orientierungshilfe für BEL-Fragen" |
| Vor erstem Chat | Willkommens-Text mit Disclaimer |
| Unter jeder Antwort | "ℹ️ Nur Orientierung. Keine Gewähr für Richtigkeit." |

**Content-Quelle:** `docs/legal/ki-disclaimer.md`

---

## 5. Checkliste für Frontend-Team

### Vor Go-Live (PFLICHT)

- [ ] `/impressum` Seite erstellen
- [ ] `/datenschutz` Seite erstellen
- [ ] `public/robots.txt` erstellen
- [ ] `src/app/sitemap.ts` erstellen
- [ ] Patrick's Kontaktdaten in Impressum eintragen

### Nach Go-Live (empfohlen)

- [ ] `og-image.png` erstellen und einbinden
- [ ] `/faq` Seite erstellen
- [ ] `/agb` Seite erstellen
- [ ] KI-Disclaimer im Chat einbauen

---

## 6. Kleinunternehmer-Hinweise für Impressum

Da Patrick als Kleinunternehmer auftritt:

### Was MUSS im Impressum stehen:
- Vollständiger Name: Patrick Werle
- Anschrift (Straße, PLZ, Ort)
- E-Mail-Adresse: kontakt@labrechner.de
- Verantwortlich für Inhalte: Patrick Werle

### Was NICHT nötig ist (bei Kleinunternehmer):
- ~~Handelsregisternummer~~ (nur bei eingetragenen Unternehmen)
- ~~Umsatzsteuer-ID~~ (Kleinunternehmer nach §19 UStG)
- ~~Geschäftsführer~~ (nur bei GmbH/AG)

### Angepasster Impressum-Text:

```markdown
## Impressum

**Angaben gemäß § 5 TMG:**

Patrick Werle
[Straße Nr.]
[PLZ Ort]
Deutschland

**Kontakt:**
E-Mail: kontakt@labrechner.de

**Umsatzsteuer:**
Kleinunternehmer gemäß § 19 UStG (keine Umsatzsteuer-ID)

**Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:**
Patrick Werle
[Adresse wie oben]
```

---

## Dateien-Übersicht

| Zu erstellen | Pfad | Quelle |
|--------------|------|--------|
| Impressum | `src/app/impressum/page.tsx` | `docs/legal/impressum-content.md` |
| Datenschutz | `src/app/datenschutz/page.tsx` | `docs/legal/datenschutz-content.md` |
| robots.txt | `public/robots.txt` | `docs/marketing/robots-sitemap-spec.md` |
| sitemap.ts | `src/app/sitemap.ts` | `docs/marketing/robots-sitemap-spec.md` |
| OG-Image | `public/og-image.png` | `docs/marketing/og-image-spec.md` |
| FAQ (optional) | `src/app/faq/page.tsx` | `docs/marketing/faq-content.md` |
| AGB (optional) | `src/app/agb/page.tsx` | `docs/legal/agb-entwurf.md` |

---

*Bei Fragen zu den Inhalten: Die Quell-Dokumente in `docs/` enthalten alle Details.*
