# robots.txt & sitemap.xml Spezifikation

**Stand:** Januar 2026
**Version:** 1.0

---

## robots.txt

### Datei: `/public/robots.txt`

```
# Labrechner robots.txt
# https://labrechner.de/robots.txt

User-agent: *
Allow: /

# Geschützte Bereiche
Disallow: /app/settings
Disallow: /api/

# Sitemap
Sitemap: https://labrechner.de/sitemap.xml
```

### Erklärung

| Regel | Bedeutung |
|-------|-----------|
| `Allow: /` | Alle öffentlichen Seiten dürfen gecrawlt werden |
| `Disallow: /app/settings` | Benutzer-Einstellungen nicht indexieren |
| `Disallow: /api/` | API-Endpunkte nicht indexieren |
| `Sitemap:` | Verweis auf die Sitemap |

---

## sitemap.xml

### Option A: Statische Datei

Datei: `/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Startseite -->
  <url>
    <loc>https://labrechner.de/</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- App -->
  <url>
    <loc>https://labrechner.de/app</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Legal -->
  <url>
    <loc>https://labrechner.de/impressum</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://labrechner.de/datenschutz</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- FAQ (wenn implementiert) -->
  <url>
    <loc>https://labrechner.de/faq</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>
```

### Option B: Dynamische Generierung (empfohlen für Next.js)

Datei: `/app/sitemap.ts`

```typescript
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
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
```

---

## Priority-Werte Erklärung

| Priorität | Verwendung |
|-----------|------------|
| 1.0 | Startseite |
| 0.9 | Haupt-App |
| 0.8 | Blog-Übersicht (später) |
| 0.5 | FAQ, About |
| 0.3 | Legal-Seiten |

---

## Validierung nach Implementation

1. **robots.txt testen:**
   - URL: https://labrechner.de/robots.txt
   - Google Search Console: Robots.txt-Tester

2. **sitemap.xml testen:**
   - URL: https://labrechner.de/sitemap.xml
   - Validieren: https://www.xml-sitemaps.com/validate-xml-sitemap.html

3. **In Search Console einreichen:**
   - Google Search Console → Sitemaps → URL eingeben

---

## TODO für Frontend-Team

- [ ] `/public/robots.txt` erstellen
- [ ] `/app/sitemap.ts` erstellen (Option B empfohlen)
- [ ] Nach Deploy in Google Search Console einreichen
