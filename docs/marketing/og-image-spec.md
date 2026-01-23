# Open Graph Image Spezifikation

**Stand:** Januar 2026
**Version:** 1.0

---

## Anforderungen

| Eigenschaft | Wert |
|-------------|------|
| **Größe** | 1200 x 630 px |
| **Format** | PNG oder JPG |
| **Dateiname** | og-image.png |
| **Speicherort** | /public/og-image.png |
| **Max. Dateigröße** | < 1 MB (empfohlen < 500 KB) |

---

## Design-Vorgaben

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│     ┌─────────────────────────────────────────────────────┐    │
│     │                                                     │    │
│     │   Labrechner                                        │    │
│     │   ═══════════                                       │    │
│     │                                                     │    │
│     │   BEL-Preise in Sekunden finden.                    │    │
│     │                                                     │    │
│     │   Aktuelle Höchstpreise für alle 17 KZV-Regionen.   │    │
│     │                                                     │    │
│     │                           labrechner.de             │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Farben (aus Brand Guidelines)

| Element | Farbe | Hex |
|---------|-------|-----|
| Hintergrund | Hellgrau / Weiß | #F8F9FA oder Gradient |
| Logo "L" Akzent | Violett | #8B5CF6 |
| Headline | Warmgrau (dunkel) | #2D3436 |
| Subline | Warmgrau (mittel) | #636E72 |
| URL | Violett | #8B5CF6 |

### Typografie

| Element | Font | Größe | Gewicht |
|---------|------|-------|---------|
| Logo | Inter | 72px | Bold |
| Headline | Inter | 56px | Bold |
| Subline | Inter | 28px | Regular |
| URL | Inter | 24px | Medium |

---

## Alternative: Dynamisches OG-Image

Next.js 13+ unterstützt dynamische OG-Images mit `@vercel/og`.

### Datei: `/app/opengraph-image.tsx`

```typescript
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Labrechner - BEL-Preise in Sekunden finden'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <span style={{ color: '#8B5CF6', fontSize: 72, fontWeight: 700 }}>L</span>
          <span style={{ color: '#2D3436', fontSize: 72, fontWeight: 700 }}>abrechner</span>
        </div>

        {/* Headline */}
        <div style={{ color: '#2D3436', fontSize: 56, fontWeight: 700, marginBottom: 20 }}>
          BEL-Preise in Sekunden finden.
        </div>

        {/* Subline */}
        <div style={{ color: '#636E72', fontSize: 28, marginBottom: 40 }}>
          Aktuelle Höchstpreise für alle 17 KZV-Regionen.
        </div>

        {/* URL */}
        <div style={{ color: '#8B5CF6', fontSize: 24, fontWeight: 500 }}>
          labrechner.de
        </div>
      </div>
    ),
    { ...size }
  )
}
```

---

## Meta-Tag Integration

### In `/app/layout.tsx` ergänzen:

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    // ... existing openGraph
    images: [
      {
        url: '/og-image.png',  // oder automatisch bei opengraph-image.tsx
        width: 1200,
        height: 630,
        alt: 'Labrechner - BEL-Preise in Sekunden finden',
      },
    ],
  },
  twitter: {
    // ... existing twitter
    images: ['/og-image.png'],
  },
}
```

---

## Test & Validierung

Nach Implementation testen:

1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
4. **OpenGraph.xyz:** https://www.opengraph.xyz/

---

## Wo wird das OG-Image angezeigt?

- Facebook/Meta Posts
- LinkedIn Shares
- Twitter/X Cards
- WhatsApp Vorschau
- Slack Link-Unfurls
- Discord Embeds
- iMessage Link-Vorschau

---

## TODO für Frontend-Team

- [ ] OG-Image erstellen (statisch oder dynamisch)
- [ ] Meta-Tags in layout.tsx ergänzen
- [ ] Mit Facebook Debugger testen
- [ ] Mit LinkedIn Post Inspector testen
