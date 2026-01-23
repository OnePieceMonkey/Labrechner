# Bug-Report-Template

**Version:** 1.0
**Stand:** Januar 2026

---

## Vorlage (zum Kopieren)

```markdown
## Bug: [Kurze Beschreibung]

**ID:** BUG-[Nummer]
**Schweregrad:** 🔴 Kritisch / 🟠 Hoch / 🟡 Mittel / 🟢 Niedrig
**Status:** Offen / In Bearbeitung / Behoben / Verifiziert / Geschlossen

**Gefunden am:** [Datum]
**Gefunden von:** [Name/Rolle]
**Zugewiesen an:** [Name/Rolle]
**Behoben in:** [Version/Commit]

---

### Beschreibung
[Was ist das Problem? Klare, präzise Beschreibung.]

### Schritte zur Reproduktion
1. Gehe zu [URL/Seite]
2. [Aktion]
3. [Aktion]
4. Beobachte [Fehler]

### Erwartetes Verhalten
[Was sollte passieren?]

### Tatsächliches Verhalten
[Was passiert stattdessen?]

### Screenshots / Videos
[Falls vorhanden, hier einfügen oder verlinken]

### Logs / Fehlermeldungen
```
[Fehlermeldung aus Console/Netzwerk]
```

### Umgebung
- **Browser:** [z.B. Chrome 120, Firefox 121]
- **Betriebssystem:** [z.B. Windows 11, macOS Sonoma]
- **Device:** [Desktop / Mobile]
- **Bildschirmgröße:** [z.B. 1920x1080]
- **KZV-Region:** [Falls relevant]
- **Labor-Typ:** [Falls relevant]

### Zusätzliche Informationen
[Weitere relevante Details, Workarounds, verwandte Bugs]
```

---

## Schweregrad-Definitionen

| Schweregrad | Symbol | Definition | Reaktionszeit |
|-------------|--------|------------|---------------|
| **Kritisch** | 🔴 | App nicht nutzbar, Datenverlust, Sicherheitsproblem | Sofort |
| **Hoch** | 🟠 | Kernfunktion betroffen, kein Workaround möglich | 24h |
| **Mittel** | 🟡 | Funktion eingeschränkt, Workaround vorhanden | 1 Woche |
| **Niedrig** | 🟢 | Kosmetisch, geringe Auswirkung auf Nutzung | Backlog |

---

## Beispiel-Bug-Reports

### Beispiel 1: Kritischer Bug

```markdown
## Bug: Suche gibt 500-Fehler bei Sonderzeichen

**ID:** BUG-001
**Schweregrad:** 🔴 Kritisch
**Status:** Offen

**Gefunden am:** 18.01.2026
**Gefunden von:** QA-Analyst
**Zugewiesen an:** Backend-Team

---

### Beschreibung
Die BEL-Suche wirft einen 500-Fehler, wenn Sonderzeichen wie
`&` oder `<` im Suchbegriff enthalten sind.

### Schritte zur Reproduktion
1. Gehe zu /app
2. Gib "Krone & Brücke" in die Suche ein
3. Drücke Enter
4. Beobachte den 500-Fehler

### Erwartetes Verhalten
Die Suche sollte entweder keine Ergebnisse oder eine
freundliche Fehlermeldung anzeigen.

### Tatsächliches Verhalten
500 Internal Server Error, weiße Seite.

### Logs / Fehlermeldungen
```
Error: Unescaped special characters in search query
    at searchBEL (/api/search.ts:45)
```

### Umgebung
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
```

---

### Beispiel 2: Mittlerer Bug

```markdown
## Bug: Praxislabor-Filter zeigt falschen Abzug

**ID:** BUG-002
**Schweregrad:** 🟡 Mittel
**Status:** Offen

**Gefunden am:** 18.01.2026
**Gefunden von:** QA-Analyst
**Zugewiesen an:** Frontend-Team

---

### Beschreibung
Bei Auswahl von "Praxislabor" wird der Preis um 5% reduziert,
aber die Anzeige zeigt "95%" statt den tatsächlichen Preis.

### Schritte zur Reproduktion
1. Gehe zu /app
2. Suche nach "102 1"
3. Wähle Filter: Praxislabor
4. Beobachte den angezeigten Preis

### Erwartetes Verhalten
Der Preis sollte als konkreter Wert angezeigt werden (z.B. "112,35 €")

### Tatsächliches Verhalten
Angezeigt wird "95% von 118,26 €" statt dem berechneten Wert.

### Screenshots
[Screenshot hier]

### Umgebung
- Browser: Firefox 121
- OS: macOS Sonoma
- Device: Desktop
```

---

## Bug-Tracking Workflow

```
┌─────────┐     ┌─────────────┐     ┌─────────┐     ┌───────────┐     ┌───────────┐
│  Offen  │ ──> │ In Arbeit   │ ──> │ Behoben │ ──> │ Verifiz.  │ ──> │ Geschloss.│
└─────────┘     └─────────────┘     └─────────┘     └───────────┘     └───────────┘
                      │                                   │
                      │                                   │
                      └──────── Reopened ─────────────────┘
```

1. **Offen:** Bug wurde gemeldet
2. **In Arbeit:** Entwickler arbeitet am Fix
3. **Behoben:** Fix wurde committed
4. **Verifiziert:** QA hat den Fix getestet
5. **Geschlossen:** Bug ist final behoben

---

## Bug-Liste (Tracking)

| ID | Titel | Schwere | Status | Zugewiesen |
|----|-------|---------|--------|------------|
| BUG-001 | [Beispiel] | 🔴 | Offen | - |
| ... | ... | ... | ... | ... |

---

## TODO

- [ ] Bug-Tracking-System einrichten (GitHub Issues, Linear, etc.)
- [ ] Template in Issue-Vorlage übernehmen
- [ ] QA-Team über Format informieren
