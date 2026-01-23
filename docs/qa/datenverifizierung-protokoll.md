# Datenverifizierungs-Protokoll

**Version:** 1.0
**Stand:** Januar 2026

---

## Zweck

Dieses Protokoll dient zur systematischen Überprüfung der importierten BEL-Preisdaten gegen die offiziellen KZV-Quellen.

---

## Prozess

1. **Aktuelle KZV-Preisliste** von der offiziellen Website herunterladen
2. **Stichproben** mit den Datenbank-Werten vergleichen
3. **Abweichungen** dokumentieren
4. **Korrekturen** veranlassen
5. **Verifizierung** nach Korrektur wiederholen

---

## KZV-Quellen

| KZV | Region | URL | Dateiformat |
|-----|--------|-----|-------------|
| KZVB | Bayern | https://www.kzvb.de/abrechnung/bel-preise | PDF |
| KZVBW | Baden-Württemberg | https://www.kzvbw.de/ | PDF/CSV |
| KZVNR | Nordrhein | https://www.kzvnr.de/ | PDF |
| KZV Berlin | Berlin | https://www.kzv-berlin.de/ | PDF |
| ... | ... | ... | ... |

---

## Stichproben-Positionen

Diese Positionen werden für jede KZV geprüft:

| Position | Bezeichnung | BEL-Gruppe | Prüfgrund |
|----------|-------------|------------|-----------|
| 001 0 | Arbeitsmodell | 0 - Modelle | Basis-Position |
| 102 1 | Vollkrone/Metall | 1 - Kronen/Brücken | Häufig verwendet |
| 120 0 | Teleskopkrone | 1 - Kronen/Brücken | Komplexe Position |
| 301 0 | Aufstellung | 3 - Prothesen | Prothesen-Bereich |
| 501 0 | Kieferorthop. Gerät | 5 - KFO | Spezieller Bereich |
| 801 0 | Instandsetzung | 8 - Reparaturen | Reparatur-Bereich |

---

## Verifizierung: KZV Bayern (KZVB)

**Prüfdatum:** [Datum eintragen]
**Geprüft von:** [Name]
**Datenquelle:** https://www.kzvb.de/abrechnung/bel-preise
**Gültig ab:** 01.01.2026
**Lokale Datei:** `BEL 2026/Bayern 11la0126.csv`

### Gewerbelabor (100%)

| Position | Bezeichnung | KZV-PDF | Datenbank | Status |
|----------|-------------|---------|-----------|--------|
| 001 0 | Arbeitsmodell | € | € | ⬜ |
| 102 1 | Vollkrone/Metall | € | € | ⬜ |
| 120 0 | Teleskopkrone | € | € | ⬜ |
| 301 0 | Aufstellung | € | € | ⬜ |
| 801 0 | Instandsetzung | € | € | ⬜ |

### Praxislabor (95%)

| Position | Erwartet (×0.95) | Datenbank | Status |
|----------|------------------|-----------|--------|
| 001 0 | € | € | ⬜ |
| 102 1 | € | € | ⬜ |
| 120 0 | € | € | ⬜ |
| 301 0 | € | € | ⬜ |
| 801 0 | € | € | ⬜ |

### Fazit Bayern

- [ ] Alle Stichproben korrekt
- [ ] Korrekturen erforderlich (siehe Anmerkungen)

**Anmerkungen:**
```
[Hier Abweichungen notieren]
```

---

## Verifizierung: KZV Baden-Württemberg (KZVBW)

**Prüfdatum:** [Datum eintragen]
**Geprüft von:** [Name]
**Datenquelle:** https://www.kzvbw.de/
**Gültig ab:** 01.01.2026
**Lokale Datei:** `BEL 2026/BW praxislabor_ab-2026-01-01.csv`

### Gewerbelabor (100%)

| Position | Bezeichnung | KZV-PDF | Datenbank | Status |
|----------|-------------|---------|-----------|--------|
| 001 0 | Arbeitsmodell | € | € | ⬜ |
| 102 1 | Vollkrone/Metall | € | € | ⬜ |
| 120 0 | Teleskopkrone | € | € | ⬜ |
| 301 0 | Aufstellung | € | € | ⬜ |
| 801 0 | Instandsetzung | € | € | ⬜ |

### Praxislabor (95%)

| Position | Erwartet (×0.95) | Datenbank | Status |
|----------|------------------|-----------|--------|
| 001 0 | € | € | ⬜ |
| 102 1 | € | € | ⬜ |
| 120 0 | € | € | ⬜ |
| 301 0 | € | € | ⬜ |
| 801 0 | € | € | ⬜ |

### Fazit Baden-Württemberg

- [ ] Alle Stichproben korrekt
- [ ] Korrekturen erforderlich (siehe Anmerkungen)

**Anmerkungen:**
```
[Hier Abweichungen notieren]
```

---

## Verifizierung: KZV Nordrhein (KZVNR)

**Prüfdatum:** [Datum eintragen]
**Geprüft von:** [Name]
**Datenquelle:** https://www.kzvnr.de/
**Gültig ab:** 01.01.2026
**Lokale Datei:** `BEL 2026/NRW BEL_II_ab01.01.2026.csv`

### Gewerbelabor (100%)

| Position | Bezeichnung | KZV-PDF | Datenbank | Status |
|----------|-------------|---------|-----------|--------|
| 001 0 | Arbeitsmodell | € | € | ⬜ |
| 102 1 | Vollkrone/Metall | € | € | ⬜ |
| 120 0 | Teleskopkrone | € | € | ⬜ |
| 301 0 | Aufstellung | € | € | ⬜ |
| 801 0 | Instandsetzung | € | € | ⬜ |

### Praxislabor (95%)

| Position | Erwartet (×0.95) | Datenbank | Status |
|----------|------------------|-----------|--------|
| 001 0 | € | € | ⬜ |
| 102 1 | € | € | ⬜ |
| 120 0 | € | € | ⬜ |
| 301 0 | € | € | ⬜ |
| 801 0 | € | € | ⬜ |

### Fazit Nordrhein

- [ ] Alle Stichproben korrekt
- [ ] Korrekturen erforderlich (siehe Anmerkungen)

**Anmerkungen:**
```
[Hier Abweichungen notieren]
```

---

## Status-Legende

| Symbol | Bedeutung |
|--------|-----------|
| ⬜ | Noch nicht geprüft |
| ✅ | Korrekt |
| ⚠️ | Abweichung (dokumentiert) |
| ❌ | Fehler (Korrektur nötig) |
| 🔄 | Korrigiert (erneute Prüfung) |

---

## Zusammenfassung aller Regionen

| KZV | Geprüft am | Status | Anmerkungen |
|-----|------------|--------|-------------|
| Bayern | | ⬜ | |
| Baden-Württemberg | | ⬜ | |
| Nordrhein | | ⬜ | |
| Berlin | | ⬜ | Noch nicht importiert |
| Brandenburg | | ⬜ | Noch nicht importiert |
| Bremen | | ⬜ | Noch nicht importiert |
| Hamburg | | ⬜ | Noch nicht importiert |
| Hessen | | ⬜ | Noch nicht importiert |
| Mecklenburg-Vorpommern | | ⬜ | Noch nicht importiert |
| Niedersachsen | | ⬜ | Noch nicht importiert |
| Rheinland-Pfalz | | ⬜ | Noch nicht importiert |
| Saarland | | ⬜ | Noch nicht importiert |
| Sachsen | | ⬜ | Noch nicht importiert |
| Sachsen-Anhalt | | ⬜ | Noch nicht importiert |
| Schleswig-Holstein | | ⬜ | Noch nicht importiert |
| Thüringen | | ⬜ | Noch nicht importiert |
| Westfalen-Lippe | | ⬜ | Noch nicht importiert |

---

## TODO

- [ ] Bayern-Daten verifizieren
- [ ] BW-Daten verifizieren
- [ ] NRW-Daten verifizieren
- [ ] Weitere KZVs nach Import verifizieren
- [ ] Automatisierte Vergleichs-Skripte erstellen
