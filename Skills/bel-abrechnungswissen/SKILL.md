# BEL-Abrechnungswissen

> Diesen Skill verwenden bei: BEL-Positionen, Abrechnung, KZV, Zahntechnik, Preisberechnung, KI-Chat-Antworten

---

## Übersicht BEL II

Das **Bundeseinheitliche Leistungsverzeichnis (BEL II)** enthält alle zahntechnischen Leistungen, die im Rahmen der vertragszahnärztlichen Versorgung bei gesetzlich Krankenversicherten erbracht werden können.

| Aspekt | Detail |
|--------|--------|
| **Rechtsgrundlage** | § 88 Abs. 1 SGB V |
| **Vertragspartner** | GKV-Spitzenverband & VDZI |
| **Gültigkeit** | Ab 01.01.2026 |
| **Anzahl Positionen** | ~155 Leistungspositionen |
| **Anzahl Gruppen** | 8 Hauptgruppen |

---

## BEL-II Leistungsgruppen

### Gruppenübersicht

| Gruppe | Positionen | Name | Beschreibung |
|--------|------------|------|--------------|
| **0** | 001-032 | Modelle & Hilfsmittel | Arbeitsmodelle, Artikulator, Löffel, Provisorien |
| **1** | 101-165 | Kronen & Brücken | Festsitzender Zahnersatz, Verblendungen, Teleskope |
| **2** | 201-212 | Metallbasis / Modellguss | Gegossene Prothesenbasis, Klammern, Geschiebe |
| **3** | 301-384 | Prothesen | Herausnehmbarer Zahnersatz, Aufstellung, Fertigstellung |
| **4** | 401-404 | Schienen & Aufbissbehelfe | Aufbissschienen, semipermanente Schienen |
| **5** | 501-521 | UKPS | Unterkiefer-Protrusionsschienen (Schlafapnoe) |
| **7** | 701-751 | KFO | Kieferorthopädische Geräte |
| **8** | 801-870 | Instandsetzung & Erweiterung | Reparaturen, Unterfütterungen, Erweiterungen |

> **Hinweis:** Gruppe 6 existiert nicht im BEL II.

### Sonstige Positionen

| Position | Bezeichnung |
|----------|-------------|
| 933 0 | Versandkosten |
| 933 5 | Versandkosten UKPS |
| 933 8 | Versandkosten bei Implantatversorgung |
| 970 0 | Verarbeitungsaufwand NEM-Legierung |

---

## Positionsformat

BEL-Positionen folgen dem Format: **XXX Y**

```
Beispiel: 102 1

XXX = Leistungsnummer (102)
Y   = Variante (1)

102 1 = Vollkrone/Metall
102 2 = Teilkrone/Metall
102 6 = Vollkrone Metall bei Implantatversorgung
```

### Positions-Suffixe

| Suffix | Bedeutung |
|--------|-----------|
| **0** | Standardleistung |
| **5** | UKPS-Variante |
| **8** | Implantatversorgung |

---

## KZV-Regionen (17)

### Vollständige Liste

| Nr. | KZV | Abkürzung | Bundesland |
|-----|-----|-----------|------------|
| 1 | KZV Baden-Württemberg | KZV BW | Baden-Württemberg |
| 2 | KZV Bayern | KZVB | Bayern |
| 3 | KZV Berlin | KZV Berlin | Berlin |
| 4 | KZV Land Brandenburg | KZVLB | Brandenburg |
| 5 | KZV Bremen | KZV Bremen | Bremen |
| 6 | KZV Hamburg | KZV HH | Hamburg |
| 7 | KZV Hessen | KZVH | Hessen |
| 8 | KZV Mecklenburg-Vorpommern | KZV MV | Mecklenburg-Vorpommern |
| 9 | KZV Niedersachsen | KZVN | Niedersachsen |
| 10 | KZV Nordrhein | KZVNR | Nordrhein-Westfalen (Nord) |
| 11 | KZV Rheinland-Pfalz | KZV RLP | Rheinland-Pfalz |
| 12 | KZV Saarland | KZV Saar | Saarland |
| 13 | KZV Sachsen | KZVS | Sachsen |
| 14 | KZV Sachsen-Anhalt | KZVSA | Sachsen-Anhalt |
| 15 | KZV Schleswig-Holstein | KZV SH | Schleswig-Holstein |
| 16 | KZV Thüringen | KZVT | Thüringen |
| 17 | KZV Westfalen-Lippe | KZVWL | Nordrhein-Westfalen (Süd) |

> **Hinweis:** NRW hat zwei KZVen: Nordrhein und Westfalen-Lippe.

---

## Preisberechnung

### Grundprinzip

1. **Jede KZV verhandelt eigene Höchstpreise** mit den Landesverbänden der Krankenkassen
2. **Preise werden jährlich** (meist zum 01.01.) angepasst
3. **Höchstpreise** = Maximalbetrag, der abgerechnet werden darf

### Labor-Typen

| Typ | Beschreibung | Preis |
|-----|--------------|-------|
| **Gewerbelabor** | Eigenständiges zahntechnisches Labor | 100% (Höchstpreis) |
| **Praxislabor** | Labor innerhalb einer Zahnarztpraxis | 95% (5% Abzug) |

> **Grund für Abzug:** Praxislabore sind nicht gewerbesteuerpflichtig.

### Mehrwertsteuer

| Leistung | MwSt.-Satz |
|----------|------------|
| Zahntechnische Arbeiten | **7%** (ermäßigt) |
| Material (Edelmetall, etc.) | **19%** (regulär) |

### Zusätzlich abrechenbare Materialkosten

Gemäß § 2 Abs. 4 der BEL-Vereinbarung können folgende Materialien separat berechnet werden:

- Sonderkunststoffe
- Weichkunststoffe
- Konfektionsfertigteile (Geschiebe, Anker)
- Implantate und Implantataufbauten
- Künstliche Zähne
- Edelmetallhaltige Dentallegierungen

### Preisformel (vereinfacht)

```
Endpreis = BEL-Preis × Labor-Faktor × (1 + MwSt.)

Beispiel Gewerbelabor:
Endpreis = 99,32 € × 1,0 × 1,07 = 106,27 €

Beispiel Praxislabor:
Endpreis = 99,32 € × 0,95 × 1,07 = 100,96 €
```

---

## Privatleistungen (BEB)

### Unterschied BEL vs. BEB

| Aspekt | BEL II | BEB |
|--------|--------|-----|
| **Geltung** | GKV (Kassenpatienten) | Privatpatienten, Zusatzleistungen |
| **Preise** | Höchstpreise (gedeckelt) | Frei kalkulierbar |
| **Faktor** | 1,0 (Standard) | Individueller Faktor (z.B. 2,3) |

### Faktor-Anwendung

Bei Privatleistungen kann ein Faktor angewendet werden:

```
Privatpreis = BEL-Preis × Faktor

Beispiel mit Faktor 2,3:
Privatpreis = 99,32 € × 2,3 = 228,44 €
```

---

## Labrechner – Benutzereingaben

### Erforderliche Auswahl

| Feld | Beschreibung | Beispiel |
|------|--------------|----------|
| **Bundesland** | Bestimmt KZV-Region | Bayern → KZVB |
| **Labor-Typ** | Gewerbe oder Praxis | Gewerbelabor |

### Optionale Felder

| Feld | Beschreibung | Standard |
|------|--------------|----------|
| **Privatleistungs-Faktor** | Faktor für BEB-Berechnung | 1,0 |
| **Materialkosten** | Freitext für Zusatzmaterial | – |
| **Lohnkosten** | Freitext für Sonderleistungen | – |

---

## Häufige Abrechnungsfehler

### 1. Falsche Position gewählt

| Fehler | Korrekt |
|--------|---------|
| 102 1 bei Implantat | 102 6 (Implantatversorgung) |
| 001 0 bei UKPS | 001 5 (UKPS-Variante) |

**Tipp:** Auf Suffix achten (5 = UKPS, 8 = Implantat)

### 2. Falsche KZV-Region

- Preise variieren zwischen KZVen um bis zu 15%
- NRW: Nordrhein ≠ Westfalen-Lippe

### 3. Praxis-/Gewerbelabor verwechselt

- Praxislabor = 5% weniger
- Falscher Typ führt zu Über-/Unterkalkulation

### 4. Veraltete Preise verwendet

- Preise ändern sich jährlich (01.01.)
- Immer aktuelle Preisliste der KZV verwenden

### 5. Materialkosten vergessen

- Edelmetall, Konfektionsteile, Implantate separat berechnen
- MwSt. beachten: Material oft 19%

---

## Fachbegriffe (Glossar)

| Begriff | Erklärung |
|---------|-----------|
| **BEL II** | Bundeseinheitliches Leistungsverzeichnis (für GKV) |
| **BEB** | Bundeseinheitliche Benennungsliste (für Privat) |
| **GKV** | Gesetzliche Krankenversicherung |
| **KZV** | Kassenzahnärztliche Vereinigung |
| **VDZI** | Verband Deutscher Zahntechniker-Innungen |
| **UKPS** | Unterkiefer-Protrusionsschiene (gegen Schlafapnoe/Schnarchen) |
| **KFO** | Kieferorthopädie |
| **NEM** | Nicht-Edelmetall (Legierung) |
| **Teleskop** | Doppelkrone (Primär- + Sekundärkrone) |
| **Modellguss** | Gegossene Metallbasis für Prothesen |
| **Verblendung** | Keramik-/Kunststoffüberzug auf Metallgerüst |
| **Geschiebe** | Verbindungselement zwischen Krone und Prothese |
| **Implantatversorgung** | Zahnersatz auf künstlicher Zahnwurzel |

---

## Datenquellen

Die BEL-Preise werden von den jeweiligen KZVen veröffentlicht:

- [KZV Nordrhein – BEL-II-Listen](https://www.kzvnr.de/praxis/abrechnung-honorar/bel-ii-listen)
- [KZV Bayern – BEL-Preise](https://www.kzvb.de/abrechnung/bel-preise)
- [KZV Baden-Württemberg – BEL Download](https://www.kzvbw.de/zahnaerzte/abrechnung/punktwerte-formulare-vordrucke/bel-leistungen-download/)
- [GKV-Spitzenverband – Zahntechniker](https://www.gkv-spitzenverband.de/krankenversicherung/zahnaerztliche_versorgung/zahntechniker/zahntechniker.jsp)

---

*Erstellt: Januar 2025*
*Version: 1.0*
*Ersetzt: bel-fachwissen.skill*
