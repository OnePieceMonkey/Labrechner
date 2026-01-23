# Ideas Labrechner V2 - Geparkte Vorschlaege fuer spaeter

**Projekt:** Labrechner - BEL-Abrechnungsassistent fuer deutsche Dentallabore
**Erstellt:** 17. Januar 2026
**Status:** Geparkt fuer Post-MVP / V2
**Bewertet durch:** CPO-Perspektive

---

## Uebersicht

Diese Datei dokumentiert Feature-Ideen und Vorschlaege, die fuer V2 oder spaeter relevant sein koennten. Sie wurden bewusst aus dem MVP-Scope herausgehalten, um den 6-Wochen-Zeitplan einzuhalten.

Nach dem erfolgreichen MVP-Launch und erstem Beta-Feedback werden diese Ideen neu bewertet.

---

## 1. UI-REDESIGN: "Labor-Cockpit" (3-Spalten-Layout)

### Beschreibung

Komplettes UI-Redesign mit drei Spalten:

**Linke Spalte ("Aktenschrank"):**
- Smart Folders: Alle aktiven Arbeiten, Bereit zur Abrechnung, Archiv
- Zahnarzt-Listen als Custom Folders mit Drag & Drop
- Schnell-Filter mit Flags (Eilig, Rueckfrage, Warten)

**Mittlere Spalte ("Feed"):**
- Karten-Design mit: Patientenkuerzel, Status-Badge, Live-BEL/BEB-Wert, Zeitstempel

**Rechte Spalte (expandierbar):**
- Split-Screen mit Chat/Voice + Abrechnungstabelle
- Kontextbezogener Header

### Warum geparkt

- Setzt ein Auftrags-Management-System voraus (nicht MVP-Scope)
- Geschaetzter Aufwand: 40-60 Stunden
- Auf Mobile schwer umzusetzen
- Zuerst validieren ob Nutzer das wirklich brauchen

### Voraussetzungen fuer Umsetzung

- MVP erfolgreich gelauncht
- Beta-Feedback zeigt Nachfrage nach Auftrags-Tracking
- Datenmodell fuer Auftraege definiert

---

## 2. STATUS-LOGIK & WORKFLOW

### Beschreibung

Komplette Auftragsverwaltung mit Status-Flow:

```
Draft -> Active -> Review -> Billed
```

Features:
- KI-Audit beim Wechsel zu "Review" (Vollstaendigkeitspruefung)
- Automatische Erkennung vergessener Positionen
- Echtzeit-Umsatzanzeige pro Auftrag

### Warum geparkt

- Ist ein komplett anderes Produkt (Labor-Management statt BEL-Suche)
- Geschaetzter Aufwand: 60-80 Stunden
- Konkurriert mit etablierten Systemen (DentaWorld, etc.)
- Validierung der Kernidee (BEL-Suche) muss zuerst erfolgen

### Voraussetzungen fuer Umsetzung

- MVP zeigt Product-Market-Fit
- Nutzer fragen aktiv nach Auftrags-Tracking
- Entscheidung: Wird Labrechner zum Labor-Management-Tool?

---

## 3. TECH-STACK: "AI MADE IN EUROPE" (Mistral/Pixtral)

### Beschreibung

**LLM & Vision:** Mistral (Pixtral Large) statt US-Modelle
- DSGVO-freundlich (EU-Hosting)
- Multimodal fuer direkte Bild-Analyse (keine separate OCR)

### Warum geparkt

- BEL-Preise sind oeffentliche Daten (kein Datenschutz-Problem)
- Mistral-API weniger erprobt als OpenAI
- Kann spaeter einfach getauscht werden (Abstraktionsschicht)
- Pixtral/OCR ist Nice-to-Have, nicht MVP-kritisch

### Voraussetzungen fuer Umsetzung

- MVP mit OpenAI/Anthropic validiert
- Nutzer aeussern DSGVO-Bedenken
- Mistral-API ausgereift und stabil

---

## 4. N8N WORKFLOWS

### Flow A: "Pixtral-Ingestor"

**Beschreibung:**
- Foto-Upload von Arbeitszettel/Auftrag
- Auto-Parsing der BEL-Positionen via Pixtral Vision
- Automatisches Eintragen in Abrechnungstabelle

**Warum geparkt:**
- Setzt Auftrags-System voraus
- Aufwand: 20-30 Stunden

### Flow B: "Umsatz-Waechter"

**Beschreibung:**
- Automatisches Audit vor Abschluss eines Auftrags
- Prueft auf vergessene Standard-Positionen
- Warnt bei ungewoehnlich niedrigem Umsatz

**Warum geparkt:**
- Setzt Abrechnungs-Workflow voraus
- Aufwand: 15-20 Stunden

### Flow C: "Schlafer-Wecker"

**Beschreibung:**
- Freitags-Reminder fuer vergessene Auftraege
- Erkennt Auftraege ohne Aktivitaet seit X Tagen
- Push-Notification oder E-Mail

**Warum geparkt:**
- Gute UX-Idee, aber setzt Auftrags-Daten voraus
- Aufwand: 8-10 Stunden

---

## 5. PRICING-MODELL & FEATURE GATING

### Beschreibung

Gestaffelte Preisstruktur mit Feature-Gating:
- Free: Basis-BEL-Suche
- Pro: Erweiterte Features (Chat, Export, etc.)
- Business: Team-Features, Auftrags-Management

### Warum geparkt

- Erst MVP validieren
- Unklar welche Features Premium sein sollen
- Komplexitaet im Frontend (Feature-Flags, Gating-Logik)

### Voraussetzungen fuer Umsetzung

- MVP erfolgreich
- Beta-Feedback zeigt welche Features wertvoll sind
- Zahlungsinfrastruktur (Stripe) bereit

---

## 6. PRIORISIERUNGS-MATRIX FUER V2

| Feature | Prioritaet | Aufwand | Nutzen | Abhaengigkeiten |
|---------|-----------|---------|--------|-----------------|
| Mistral-Option | Mittel | 4-6h | Mittel | Keine |
| Schlafer-Wecker | Mittel | 8-10h | Hoch | Auftrags-Daten |
| Feature-Gating | Hoch | 15-20h | Hoch | Stripe-Integration |
| Pixtral-Ingestor | Niedrig | 20-30h | Mittel | Auftrags-System |
| Labor-Cockpit | Niedrig | 40-60h | Unklar | Auftrags-System |
| Status-Workflow | Niedrig | 60-80h | Unklar | Grundlegende Entscheidung |

---

## 7. VALIDIERUNGS-FRAGEN FUER BETA-TESTER

Diese Fragen sollten den Beta-Testern gestellt werden, um die V2-Features zu priorisieren:

1. "Wuerden Sie Ihre Auftraege in Labrechner verwalten wollen, oder nutzen Sie dafuer bereits ein anderes System?"

2. "Wie wichtig ist Ihnen, dass die Daten in der EU verarbeitet werden?"

3. "Wuerden Sie Fotos von Arbeitszetteln hochladen, um Positionen automatisch zu erkennen?"

4. "Welche Funktion fehlt Ihnen am meisten in der aktuellen BEL-Suche?"

5. "Wuerden Sie fuer erweiterte Features bezahlen? Wenn ja, wieviel pro Monat?"

---

## 8. NOTIZEN & GEDANKEN

### Was diese Vorschlaege gemeinsam haben

Die meisten Vorschlaege gehen in Richtung **Labor-Management-System**. Das ist eine strategische Entscheidung:

- **Option A:** Labrechner bleibt eine fokussierte BEL-Suche + KI-Chat
  - Pro: Klarer Fokus, schnelle Iteration
  - Con: Begrenztes Upselling-Potenzial

- **Option B:** Labrechner wird zum vollstaendigen Labor-Management
  - Pro: Hoeherer Customer Lifetime Value
  - Con: Starke Konkurrenz, langer Entwicklungszyklus

Diese Entscheidung sollte nach dem MVP-Launch basierend auf echtem Feedback getroffen werden.

### Technische Ueberlegungen

Falls V2 in Richtung Auftrags-Management geht, braucht es:
- Neues Datenmodell: `orders`, `order_items`, `order_history`
- Real-time Updates (Supabase Realtime)
- Komplexere RLS-Policies
- Ggf. Team/Organisations-Konzept

---

## 9. REVISIONSHISTORIE

| Datum | Version | Aenderung |
|-------|---------|-----------|
| 17.01.2026 | 1.0 | Initiale Dokumentation der geparkten Ideen |

---

*Diese Datei wird nach dem MVP-Launch und erstem Beta-Feedback aktualisiert.*
