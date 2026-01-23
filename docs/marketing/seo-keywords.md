# SEO-Keyword-Strategie Labrechner

**Stand:** Januar 2026
**Version:** 1.0

---

## Zielgruppe (Buyer Persona)

**Name:** Sabine
**Rolle:** Abrechnungsmitarbeiterin in einem Dentallabor
**Alter:** 35-55 Jahre
**Schmerzpunkt:** Muss täglich BEL-Preise nachschlagen, PDFs sind unübersichtlich
**Suchverhalten:** Googelt "BEL Preise [Region]" oder "BEL Position [Nummer]"

---

## Primäre Keywords (Hohe Priorität)

| Keyword | Suchvolumen* | Schwierigkeit | Seite |
|---------|--------------|---------------|-------|
| BEL Preise | Hoch | Mittel | Landing Page |
| BEL II Preisliste | Hoch | Mittel | Landing Page, Blog |
| BEL Preise 2026 | Mittel | Niedrig | Landing Page, Blog |
| Zahntechnik Abrechnung | Mittel | Mittel | Blog |
| KZV Preisliste | Mittel | Hoch | Landing Page |
| BEL Höchstpreise | Niedrig | Niedrig | App, Blog |

*Geschätzt, ohne Tool-Verifizierung

---

## Long-Tail Keywords

### Nach Region (hohe Conversion-Wahrscheinlichkeit)

- "BEL Preise Bayern 2026"
- "BEL Preise NRW 2026"
- "BEL Preise Baden-Württemberg 2026"
- "KZV Bayern BEL Preisliste"
- "KZVB Höchstpreise Zahntechnik"

### Nach Position (sehr spezifisch)

- "BEL Position 102 1 Preis"
- "BEL Vollkrone Preis"
- "BEL Teleskopkrone Kosten"
- "BEL Modell Preis"

### Nach Thema

- "Praxislabor Gewerbelabor Unterschied"
- "BEL Abrechnung erklärt"
- "Zahntechnik Höchstpreise KZV"
- "BEL II Gruppen Übersicht"

---

## Content-Ideen für SEO

### Blog-Artikel (geplant)

| Titel | Ziel-Keywords | Priorität |
|-------|---------------|-----------|
| "BEL-Preise 2026: Die wichtigsten Änderungen" | BEL Preise 2026, BEL II 2026 | Hoch |
| "Praxislabor vs. Gewerbelabor: Der Preis-Unterschied" | Praxislabor Gewerbelabor | Mittel |
| "Die 8 BEL-Gruppen einfach erklärt" | BEL Gruppen, BEL II Leistungen | Mittel |
| "Häufige Abrechnungsfehler in der Zahntechnik" | Zahntechnik Abrechnung Fehler | Niedrig |
| "BEL-Preise nach Bundesland: Der große Vergleich" | BEL Preise Vergleich, KZV Unterschiede | Hoch |

### Glossar-Einträge

- BEL (Bundeseinheitliche Benennungsliste)
- KZV (Kassenzahnärztliche Vereinigung)
- Höchstpreis
- Praxislabor
- Gewerbelabor
- UKPS (Umsatzsteuerlicher Kosten- und Preisspiegel)

---

## On-Page SEO Checkliste

### Title Tags

```
Startseite: Labrechner – BEL-Preise in Sekunden finden | Alle 17 KZV-Regionen
App: BEL-Suche | Labrechner
Blog: [Artikel-Titel] | Labrechner Blog
```

### Meta Descriptions

```
Startseite (max 160 Zeichen):
"Aktuelle BEL-II-Höchstpreise für alle 17 KZV-Regionen.
Schnelle Suche, immer aktuell, kostenlos testen. Labrechner.de"

App:
"Durchsuche alle BEL-Positionen und finde sofort den richtigen Preis
für deine KZV-Region. Praxislabor & Gewerbelabor."
```

### H1-Struktur

```
Startseite: BEL-Preise in Sekunden finden
App: BEL-Suche
Blog: [Artikel-Titel]
FAQ: Häufig gestellte Fragen
```

---

## Technische SEO

### Bereits implementiert ✅

- Meta Title & Description (layout.tsx)
- Open Graph Tags
- Twitter Card Tags
- Canonical URL (metadata.metadataBase)

### Noch zu implementieren ❌

| Element | Datei | Status |
|---------|-------|--------|
| robots.txt | /public/robots.txt | Fehlt |
| sitemap.xml | /app/sitemap.ts | Fehlt |
| og:image | /public/og-image.png | Fehlt |
| Strukturierte Daten (JSON-LD) | layout.tsx | Optional |
| Breadcrumbs | Komponente | Optional |

---

## Lokale SEO (später)

Falls physischer Standort relevant wird:
- Google Business Profil
- Lokale Keywords ("Zahntechnik Software [Stadt]")

---

## Wettbewerber-Keywords

Recherche empfohlen für:
- Direkte Wettbewerber (BEL-Tools, Labor-Software)
- KZV-Websites (die für BEL-Preise ranken)
- Zahntechnik-Portale

---

## Tracking & Messung

Nach Launch:
- Google Search Console einrichten
- Keyword-Rankings tracken (z.B. mit Ahrefs, SEMrush)
- Organic Traffic in Analytics beobachten

---

## TODO für Frontend-Team

1. robots.txt in /public erstellen (siehe robots-sitemap-spec.md)
2. sitemap.xml generieren lassen
3. og:image erstellen (siehe og-image-spec.md)
4. Bei Blog-Launch: Artikel mit obigen Keywords erstellen
