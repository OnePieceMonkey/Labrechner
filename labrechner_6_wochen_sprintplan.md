# Labrechner – 6-Wochen MVP Sprintplan

**Projektziel:** Funktionsfähiger BEL-II-Abrechnungsassistent für deutsche Dentallabore  
**Zeitbudget:** 25 Stunden/Woche (150h gesamt)  
**Zieldatum MVP:** 6 Wochen ab Start  
**Beta-Tester:** 2-3 Dentallabore

---

## Übersicht: Meilensteine

| Woche | Fokus | Deliverables | Stunden |
|-------|-------|--------------|---------|
| 1 | Foundation & Brand | Name, Domain, Brand Guidelines, Tech Setup | 25h |
| 2 | Daten & Backend | BEL-Datenbank, Supabase Schema, erste APIs | 25h |
| 3 | Core Features | BEL-Suche, Filterlogik, N8N Workflows | 25h |
| 4 | Frontend & KI-Chat | UI Implementation, Chat-Integration | 25h |
| 5 | Landing Page & Polish | Marketing-Site, Warteliste, Testing | 25h |
| 6 | Beta & Iteration | Beta-Launch, Feedback, Fixes | 25h |

---

## Woche 1: Foundation & Brand Identity

**Ziel:** Solides Fundament für alle weiteren Arbeiten

### Tag 1-2: Strategische Entscheidungen (8h)
- [ ] Finaler Produktname entscheiden (Labrechner oder Alternative)
- [ ] Domain sichern (.de bevorzugt)
- [ ] Wettbewerber-Domains prüfen (Verwechslungsgefahr)
- [ ] Zielgruppen-Personas finalisieren (Laborinhaber vs. Abrechnungspersonal)

### Tag 3-4: Brand Development (10h)
- [ ] **Farbpalette definieren:**
  - Primärfarbe (Vertrauen, Professionalität)
  - Sekundärfarbe (Akzent, CTAs)
  - Neutrale Töne (Text, Hintergründe)
- [ ] **Typografie wählen:**
  - Headline-Font (markant, lesbar)
  - Body-Font (professionell, deutsch-freundlich)
- [ ] **Logo-Konzept entwickeln:**
  - Wortmarke oder Bild-Wort-Marke
  - Favicon-Variante
- [ ] **Brand Voice Guidelines:**
  - Tonalität (professionell, hilfsbereit, nicht zu locker)
  - Sprachbeispiele für UI-Texte
  - Do's und Don'ts

### Tag 5: Tech Infrastructure (7h)
- [ ] **Supabase Projekt erstellen:**
  - EU-Region (Frankfurt) wählen
  - Projekt "labrechner-prod" anlegen
- [ ] **Repository Setup:**
  - GitHub Repo erstellen
  - Next.js Projekt initialisieren
  - Tailwind CSS konfigurieren
- [ ] **Vercel Deployment:**
  - Projekt verbinden
  - Custom Domain konfigurieren (sobald verfügbar)
- [ ] **N8N Workspace:**
  - Ordnerstruktur für Workflows
  - Erste Test-Connection zu Supabase

### Woche 1 Deliverables:
- ✅ Finaler Name + gesicherte Domain
- ✅ Brand Guidelines Dokument (Farben, Fonts, Voice)
- ✅ Logo (mindestens Wortmarke)
- ✅ Funktionierendes Dev-Setup (Supabase + Next.js + Vercel)
- ✅ Projektstruktur in lokalem Ordner

---

## Woche 2: Datenbank & Backend-Architektur

**Ziel:** BEL-II-Daten strukturiert und abrufbar

### Tag 1-2: BEL-Datenrecherche (8h)
- [ ] **KZV-Preislisten beschaffen:**
  - 3-5 Regionen priorisieren (z.B. Bayern, NRW, Baden-Württemberg)
  - CSV-Dateien von Stadermann oder direkt KZV herunterladen
  - VDDS-Standard-Format analysieren
- [ ] **Datenstruktur dokumentieren:**
  - Alle Felder erfassen (Position, Bezeichnung, Preis, Gruppe, etc.)
  - Unterschiede zwischen Regionen notieren
  - Praxislabor-Preise vs. Gewerblich identifizieren

### Tag 3-4: Supabase Schema Design (10h)
- [ ] **Tabellen erstellen:**
```sql
-- Haupttabellen
bel_positionen (id, position_nr, bezeichnung, gruppe, beschreibung)
bel_preise (id, position_id, kzv_region, preis_gewerblich, preis_praxislabor, gueltig_ab, gueltig_bis)
kzv_regionen (id, name, kuerzel, bundesland)
benutzer (id, email, labor_name, kzv_region, created_at)
warteliste (id, email, labor_name, interesse_features, created_at)
```
- [ ] **Row Level Security (RLS) einrichten:**
  - Preisdaten: Public Read
  - Benutzerdaten: Nur eigene Daten
- [ ] **Indizes für Performance:**
  - position_nr für Suche
  - kzv_region für Filterung

### Tag 5: Datenimport & API (7h)
- [ ] **CSV-Parser bauen:**
  - N8N Workflow oder Node.js Script
  - Validierung der importierten Daten
- [ ] **Erste Daten importieren:**
  - Mindestens 2 KZV-Regionen vollständig
  - Stichproben-Verifizierung gegen PDF-Quellen
- [ ] **Supabase API testen:**
  - Basis-Queries für Suche
  - Filter nach Region und Gruppe

### Woche 2 Deliverables:
- ✅ Vollständiges Datenbankschema in Supabase
- ✅ BEL-II-Daten für 3+ KZV-Regionen importiert
- ✅ Funktionierende API-Endpoints für Suche
- ✅ Dokumentation der Datenstruktur

---

## Woche 3: Core Features – Suche & Filter

**Ziel:** Funktionierende BEL-Suche mit allen Filtern

### Tag 1-2: Such-Logik Backend (8h)
- [ ] **Supabase Functions erstellen:**
  - Volltextsuche über Bezeichnung + Beschreibung
  - Positionsnummer-Suche (exakt und partial)
  - Kombination mehrerer Filter
- [ ] **N8N Workflows:**
  - Workflow: "BEL Suche" (Input → Query → Response)
  - Workflow: "Regionspreise abrufen"
  - Error Handling und Logging

### Tag 3-4: Filter-System (10h)
- [ ] **Filter implementieren:**
  - KZV-Region (Dropdown)
  - Leistungsgruppe (8 BEL-Gruppen)
  - Labortyp (Gewerblich / Praxislabor)
  - Preisbereich (Min/Max)
- [ ] **Sortierung:**
  - Nach Positionsnummer
  - Nach Preis (auf-/absteigend)
  - Nach Relevanz (bei Textsuche)
- [ ] **Pagination:**
  - 20 Ergebnisse pro Seite
  - Infinite Scroll oder klassische Pagination

### Tag 5: API-Dokumentation & Testing (7h)
- [ ] **Endpoints dokumentieren:**
  - GET /api/bel/search?q=...&region=...
  - GET /api/bel/position/{nr}
  - GET /api/regionen
- [ ] **Edge Cases testen:**
  - Leere Suche
  - Ungültige Region
  - Sonderzeichen in Suchbegriff
- [ ] **Performance-Check:**
  - Query-Zeiten messen (<200ms Ziel)
  - Bei Bedarf Indizes optimieren

### Woche 3 Deliverables:
- ✅ Vollständige Such-API mit allen Filtern
- ✅ N8N Workflows für Core-Funktionen
- ✅ API-Dokumentation
- ✅ Performance unter 200ms pro Query

---

## Woche 4: Frontend UI & KI-Chat

**Ziel:** Nutzbares Interface mit Chat-Funktion

### Tag 1-2: UI Components (10h)
- [ ] **Design System aufbauen:**
  - Button-Varianten (Primary, Secondary, Ghost)
  - Input-Felder (Text, Select, Checkbox)
  - Cards für Suchergebnisse
  - Loading States
- [ ] **Layout erstellen:**
  - Header mit Logo + Navigation
  - Suchbereich (prominent)
  - Ergebnisliste
  - Filter-Sidebar (Desktop) / Sheet (Mobile)

### Tag 3-4: Suche & Ergebnisse (8h)
- [ ] **Suchseite implementieren:**
  - Suchfeld mit Autocomplete-Feeling
  - Filter-Komponenten
  - Ergebnis-Cards mit:
    - Positionsnummer (prominent)
    - Bezeichnung
    - Preis (je nach Region)
    - Gruppe-Badge
- [ ] **Detail-Ansicht:**
  - Vollständige Positionsinfo
  - Preisvergleich über Regionen
  - Verwandte Positionen (nice-to-have)

### Tag 5: KI-Chat Integration (7h)
- [ ] **Chat-UI bauen:**
  - Floating Button oder dedizierter Bereich
  - Nachrichten-Bubbles (User / Assistant)
  - Typing Indicator
- [ ] **Backend-Integration:**
  - OpenAI oder Claude API anbinden
  - System Prompt mit BEL-Kontext
  - RAG-Ansatz: Relevante Positionen als Kontext mitgeben
- [ ] **Beispiel-Prompts:**
  - "Welche Position für Vollgusskrone?"
  - "Unterschied zwischen BEL 001 und 002?"
  - "Was kostet eine Modellgussprothese in Bayern?"

### Woche 4 Deliverables:
- ✅ Funktionierendes Such-Interface
- ✅ Responsive Design (Desktop + Mobile)
- ✅ KI-Chat mit BEL-Kontext
- ✅ Alle Filter nutzbar

---

## Woche 5: Landing Page & Marketing

**Ziel:** Professioneller Auftritt mit Warteliste

### Tag 1-2: Landing Page Design (8h)
- [ ] **Hero Section:**
  - Klare Headline (Problem → Lösung)
  - Subheadline mit Nutzenversprechen
  - CTA: "Kostenlos testen" / "Auf Warteliste"
  - Hero-Image oder Produkt-Screenshot
- [ ] **Problem-Section:**
  - 3 Pain Points der Zielgruppe
  - Kurz und prägnant
- [ ] **Lösung/Features:**
  - BEL-Suche in Sekunden
  - Alle 17 KZV-Regionen
  - KI-gestützte Fragen
- [ ] **Social Proof (wenn möglich):**
  - Beta-Tester-Zitate vorbereiten
  - "Entwickelt von Zahntechnik-Experten"

### Tag 3-4: Warteliste & Lead Capture (10h)
- [ ] **Wartelisten-Formular:**
  - E-Mail (required)
  - Laborname (optional)
  - KZV-Region (optional, für Priorisierung)
- [ ] **E-Mail-Integration:**
  - Bestätigungs-Mail (Double Opt-in für DSGVO)
  - Willkommens-Sequenz vorbereiten
- [ ] **Datenspeicherung:**
  - In Supabase `warteliste` Tabelle
  - DSGVO-konforme Einwilligung

### Tag 5: Legal & Polish (7h)
- [ ] **Rechtliche Seiten:**
  - Impressum (Pflichtangaben)
  - Datenschutzerklärung
  - AGB (Entwurf für später)
- [ ] **SEO Basics:**
  - Meta-Tags
  - Open Graph für Social Sharing
  - robots.txt, sitemap.xml
- [ ] **Performance:**
  - Lighthouse Score >90
  - Core Web Vitals optimieren

### Woche 5 Deliverables:
- ✅ Professionelle Landing Page live
- ✅ Funktionierende Warteliste mit E-Mail-Bestätigung
- ✅ Impressum + Datenschutzerklärung
- ✅ SEO-optimiert

---

## Woche 6: Beta-Launch & Iteration

**Ziel:** Echtes Feedback von echten Nutzern

### Tag 1-2: Beta-Vorbereitung (8h)
- [ ] **Beta-Zugang einrichten:**
  - Separate URL oder Feature-Flag
  - Einfache Auth (Magic Link via Supabase)
- [ ] **Feedback-Mechanismus:**
  - In-App Feedback-Button
  - Kurze Umfrage nach erster Nutzung
- [ ] **Beta-Tester kontaktieren:**
  - Persönliche E-Mail/Anruf
  - Klare Erwartungen kommunizieren
  - Zeitrahmen für Feedback (1 Woche)

### Tag 3-4: Beta-Launch & Monitoring (10h)
- [ ] **Launch an 2-3 Tester:**
  - Onboarding-Call anbieten (15 min)
  - Bildschirmaufnahme wenn möglich
- [ ] **Monitoring einrichten:**
  - Error Tracking (Sentry Free Tier)
  - Usage Analytics
  - Performance Monitoring
- [ ] **Feedback sammeln:**
  - Was funktioniert gut?
  - Was fehlt?
  - Was ist verwirrend?

### Tag 5: Iteration & Dokumentation (7h)
- [ ] **Quick Wins umsetzen:**
  - Offensichtliche UX-Probleme fixen
  - Fehlende Daten ergänzen
  - Wording verbessern
- [ ] **Backlog erstellen:**
  - Priorisierte Liste für Post-MVP
  - Feature Requests dokumentieren
- [ ] **Projekt-Dokumentation:**
  - README aktualisieren
  - Deployment-Prozess dokumentieren
  - Lessons Learned festhalten

### Woche 6 Deliverables:
- ✅ MVP live mit 2-3 aktiven Beta-Testern
- ✅ Erstes echtes Nutzerfeedback
- ✅ Priorisierter Backlog für nächste Phase
- ✅ Dokumentierter Tech Stack

---

## Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| BEL-Daten nicht verfügbar | Niedrig | Kritisch | Alternative Quellen recherchieren, manuell erfassen |
| Tech-Probleme (Supabase/N8N) | Mittel | Mittel | Backup-Plan mit Alternativen, frühes Testing |
| Zeitüberschreitung | Mittel | Mittel | Scope reduzieren (weniger Regionen), Features priorisieren |
| Beta-Tester nicht erreichbar | Niedrig | Mittel | Früh kontaktieren, Backup-Tester identifizieren |
| KI-Chat halluziniert | Mittel | Hoch | Strenger System Prompt, RAG mit echten Daten, Disclaimer |

---

## Definition of Done (MVP)

Ein Feature gilt als "fertig" wenn:
- [ ] Funktionalität implementiert
- [ ] Responsive (Desktop + Mobile)
- [ ] Error Handling vorhanden
- [ ] Mindestens 1x getestet
- [ ] Dokumentiert (wo nötig)

---

## Nach dem MVP: Nächste Schritte

1. **Woche 7-8:** Feedback einarbeiten, weitere KZV-Regionen
2. **Monat 2-3:** Zahlungssystem integrieren (Stripe/Mollie)
3. **Monat 3-4:** Öffentlicher Launch, erste zahlende Kunden
4. **Monat 5-6:** Marketing skalieren, IDS 2027 Anmeldung prüfen

---

## Kontakt & Ressourcen

**Projektordner:** `C:\Users\Scan\Desktop\KI_Directory\Labrechner`

**Tech Stack:**
- Frontend: Next.js + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Workflows: N8N (Hostinger)
- KI: OpenAI API / Claude API
- Hosting: Vercel
- Domain: [TBD]

**Zeitplan erstellt:** [Datum einfügen]
**Nächste Review:** Ende Woche 1
