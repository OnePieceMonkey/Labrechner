# FAQ - Häufig gestellte Fragen

**Stand:** Januar 2026
**Version:** 1.0

---

## Allgemein

### Was ist Labrechner?

Labrechner ist eine Webanwendung für Zahntechniklabore, die aktuelle BEL-II-Höchstpreise für alle 17 KZV-Regionen schnell und einfach durchsuchbar macht. Statt in PDF-Tabellen zu blättern, findest du den richtigen Preis in Sekunden.

### Für wen ist Labrechner gedacht?

Labrechner richtet sich an:
- **Zahntechniker** und Labor-Inhaber
- **Abrechnungsmitarbeiter** in Dentallaboren
- **Zahnarztpraxen** mit eigenem Praxislabor
- Alle, die regelmäßig mit BEL-Preisen arbeiten

### Ist Labrechner kostenlos?

In der aktuellen **Beta-Phase** ist Labrechner kostenlos nutzbar. Nach der Beta-Phase wird es verschiedene Preismodelle geben – ein Basis-Zugang bleibt kostenlos.

### Brauche ich ein Konto?

Für die einfache Suche ist kein Konto nötig. Für personalisierte Funktionen wie gespeicherte Filter oder den KI-Assistenten ist eine kostenlose Registrierung erforderlich.

---

## BEL-Daten

### Woher stammen die Preisdaten?

Die BEL-II-Höchstpreise werden direkt von den offiziellen Preislisten der 17 Kassenzahnärztlichen Vereinigungen (KZVen) bezogen. Wir sammeln und strukturieren die öffentlich verfügbaren Daten.

### Wie aktuell sind die Preise?

Wir aktualisieren die Preise, sobald neue Preislisten von den KZVen veröffentlicht werden. Das ist typischerweise zum 01.01. eines Jahres, manchmal auch unterjährig.

**Aktueller Datenstand:** BEL II 2026

### Sind die Preise verbindlich?

Nein. Die in Labrechner angezeigten Preise dienen als Orientierung. **Verbindlich** sind ausschließlich die offiziellen Veröffentlichungen Ihrer zuständigen KZV.

### Welche KZV-Regionen sind verfügbar?

Aktuell sind alle **17 KZV-Regionen** in Deutschland verfügbar:

| Region | KZV |
|--------|-----|
| Baden-Württemberg | KZVBW |
| Bayern | KZVB |
| Berlin | KZV Berlin |
| Brandenburg | KZVLB |
| Bremen | KZV Bremen |
| Hamburg | KZV Hamburg |
| Hessen | KZVH |
| Mecklenburg-Vorpommern | KZVMV |
| Niedersachsen | KZVN |
| Nordrhein | KZVNR |
| Rheinland-Pfalz | KZV RLP |
| Saarland | KZV Saarland |
| Sachsen | KZVS |
| Sachsen-Anhalt | KZVSA |
| Schleswig-Holstein | KZVSH |
| Thüringen | KZVT |
| Westfalen-Lippe | KZVWL |

---

## Praxislabor vs. Gewerbelabor

### Was ist der Unterschied?

| | Praxislabor | Gewerbelabor |
|--|-------------|--------------|
| **Definition** | Innerhalb einer Zahnarztpraxis | Eigenständiges Labor |
| **Höchstpreis** | 95% des BEL-Preises | 100% des BEL-Preises |
| **Abzug** | 5% Abzug | Kein Abzug |

### Warum gibt es diesen Unterschied?

Der 5%-Abzug für Praxislabore ist in den Abrechnungsbestimmungen der KZVen festgelegt und soll den geringeren organisatorischen Aufwand widerspiegeln.

### Wie wähle ich den richtigen Labor-Typ?

In den Labrechner-Einstellungen kannst du deinen Labor-Typ auswählen. Die Preise werden dann automatisch entsprechend angezeigt.

---

## KI-Assistent

### Was kann der KI-Assistent?

Der KI-Assistent beantwortet allgemeine Fragen zur BEL-Abrechnung, zum Beispiel:
- "Was kostet eine Vollkrone in Bayern?"
- "Was ist der Unterschied zwischen Position 102 1 und 102 5?"
- "Welche Positionen gehören zur BEL-Gruppe 1?"

### Wie zuverlässig sind die KI-Antworten?

Der KI-Assistent dient als **Orientierungshilfe** und basiert auf den offiziellen BEL-Dokumenten. Für verbindliche Auskünfte wenden Sie sich bitte an Ihre KZV.

### Kann der KI-Assistent Abrechnungen erstellen?

Nein, der Assistent beantwortet Fragen zur BEL-Abrechnung, erstellt aber **keine Abrechnungen, Kostenvoranschläge oder Rechnungen**.

### Werden meine Fragen gespeichert?

Nein, Chat-Verläufe werden nicht dauerhaft gespeichert. Details findest du in unserer Datenschutzerklärung.

---

## Datenschutz & Sicherheit

### Werden meine Daten sicher gespeichert?

Ja. Alle Daten werden DSGVO-konform auf EU-Servern gespeichert:
- **Datenbank:** Supabase (Frankfurt, Deutschland)
- **Hosting:** Vercel (EU)

### Werden Tracking-Cookies verwendet?

Nein. Labrechner verwendet **keine Marketing- oder Tracking-Cookies**. Es werden nur technisch notwendige Session-Cookies für den Login verwendet.

### Kann ich mein Konto löschen?

Ja. Du kannst dein Konto jederzeit in den Einstellungen löschen. Alle deine Daten werden dann vollständig entfernt.

---

## Technische Fragen

### Welche Browser werden unterstützt?

Labrechner funktioniert in allen modernen Browsern:
- Chrome (empfohlen)
- Firefox
- Safari
- Edge

### Gibt es eine App?

Aktuell ist Labrechner als Web-App verfügbar, die auf allen Geräten funktioniert. Eine native App ist für die Zukunft geplant.

### Funktioniert Labrechner offline?

Nein, für die Suche und den KI-Assistenten ist eine Internetverbindung erforderlich.

---

## Kontakt & Support

### Wie erreiche ich den Support?

Per E-Mail an: **support@labrechner.de**

### Ich habe einen Fehler in den Preisdaten gefunden. Was tun?

Bitte melde dich unter **support@labrechner.de** mit folgenden Angaben:
- BEL-Position
- KZV-Region
- Gefundener Preis vs. erwarteter Preis
- Quelle (z.B. Link zur KZV-Preisliste)

Wir prüfen und korrigieren das schnellstmöglich.

### Kann ich Feature-Wünsche einreichen?

Ja, gerne! Schreib uns an **feedback@labrechner.de** mit deiner Idee.

---

## TODO für Frontend-Team

Diese FAQ kann als `/faq` Seite oder als ausklappbare Sektion auf der Landing Page implementiert werden.

Empfehlung: Accordion-Style für bessere Übersicht.
