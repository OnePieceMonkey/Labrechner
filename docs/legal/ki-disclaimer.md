# KI-Assistent Disclaimer

**Stand:** Januar 2026
**Version:** 1.0

---

## Kurz-Disclaimer (für UI-Einbindung)

> **Hinweis:** Der KI-Assistent dient nur als Orientierungshilfe. Für verbindliche Auskünfte wenden Sie sich an Ihre KZV.

---

## Ausführlicher Disclaimer

### Hinweis zum KI-Assistenten

Der in Labrechner integrierte KI-Assistent dient ausschließlich als **Orientierungshilfe** für allgemeine Fragen zur BEL-Abrechnung.

**Bitte beachten Sie:**

1. **Keine Rechtsberatung**
   Die Antworten des KI-Assistenten stellen keine Rechts- oder Abrechnungsberatung dar und ersetzen nicht die Konsultation eines Fachberaters.

2. **Keine Verbindlichkeit**
   Für verbindliche Auskünfte zu BEL-Positionen, Abrechnungsmodalitäten oder Preisen wenden Sie sich bitte an Ihre zuständige Kassenzahnärztliche Vereinigung (KZV).

3. **Keine Haftung**
   Wir übernehmen keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der KI-Antworten. Die Nutzung erfolgt auf eigene Verantwortung.

4. **Prüfungspflicht**
   Im Zweifelsfall prüfen Sie bitte die offiziellen BEL-Unterlagen oder kontaktieren Sie Ihre KZV direkt.

5. **Maschinelle Antworten**
   Die Antworten werden von einem KI-System generiert und können Fehler oder Ungenauigkeiten enthalten.

---

## Verwendung im UI

### Chat-Fenster Header

```
🤖 KI-Assistent (Beta)
Orientierungshilfe für BEL-Fragen
```

### Vor dem ersten Chat

```
Willkommen beim Labrechner KI-Assistenten!

Ich kann dir bei Fragen zur BEL-Abrechnung helfen, z.B.:
• "Was kostet eine Vollkrone in Bayern?"
• "Was ist der Unterschied zwischen Praxis- und Gewerbelabor?"
• "Welche BEL-Gruppe umfasst Kronen?"

⚠️ Wichtig: Meine Antworten dienen nur als Orientierung.
Für verbindliche Auskünfte wende dich an deine KZV.
```

### Footer unter jeder KI-Antwort

```
ℹ️ Diese Antwort dient nur als Orientierung. Keine Gewähr für Richtigkeit.
```

---

## Verwendung in der Datenschutzerklärung

### Abschnitt: KI-Assistent

Der KI-Assistent verwendet:
- Vom Nutzer eingegebene Fragen (Chat-Eingaben)
- Die in Labrechner hinterlegten BEL-Daten als Kontext

**Datenverarbeitung:**
- Chat-Eingaben werden zur Beantwortung der Frage verarbeitet
- Chat-Verläufe werden [nicht gespeichert / für X Tage gespeichert - TBD]
- Es werden keine personenbezogenen Daten an Dritte übermittelt

**Hinweis:** Die KI-Antworten basieren auf maschinellem Lernen und können Ungenauigkeiten enthalten. Siehe unseren KI-Disclaimer unter [Link].

---

## Implementierungs-Hinweise für Frontend-Team

### 1. Disclaimer-Banner im Chat

Beim Öffnen des Chat-Fensters einmalig anzeigen (kann weggeklickt werden, aber Hinweis bleibt in jedem Chat sichtbar).

### 2. Persistenter Hinweis

Unter dem Chat-Eingabefeld immer sichtbar:
```
🔒 Deine Fragen werden nicht gespeichert | ℹ️ Nur Orientierungshilfe
```

### 3. Tooltip bei "i" Icon

```
Der KI-Assistent verwendet die öffentlichen BEL-Daten und beantwortet
allgemeine Fragen zur Zahntechnik-Abrechnung. Für verbindliche Auskünfte
wende dich bitte an deine KZV.
```

---

*Dieses Dokument wurde mit Unterstützung von KI erstellt.*
