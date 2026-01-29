/**
 * DTVZ-XML Generator fuer Labrechner
 * Generiert XML gemaess VDZI/KZBV-Schema Version 4.5
 *
 * Referenz: https://www.vdds.de/schnittstellen/labor/
 */

import type { Invoice, InvoiceItem, UserSettings, Json } from "@/types/database";

// Client Snapshot Interface (aus invoices.client_snapshot)
interface ClientSnapshot {
  id?: string;
  salutation?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  practice_name?: string;
  street?: string;
  house_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
}

// Lab Snapshot Interface (aus invoices.lab_snapshot)
interface LabSnapshot {
  lab_name?: string;
  contact_name?: string;
  lab_email?: string;
  lab_street?: string;
  lab_house_number?: string;
  lab_postal_code?: string;
  lab_city?: string;
  tax_id?: string;
  bank_name?: string;
  iban?: string;
  bic?: string;
}

export interface DTVZGeneratorInput {
  invoice: Invoice;
  items: InvoiceItem[];
  labSettings: UserSettings;
}

export interface DTVZOutput {
  xml: string;
  auftragsnummer: string;
  filename: string;
}

/**
 * Generiert eine DTVZ-konforme XML-Datei fuer eine Rechnung
 */
export function generateDTVZXml(input: DTVZGeneratorInput): DTVZOutput {
  const { invoice, items, labSettings } = input;

  // Snapshots parsen
  const clientSnapshot = parseClientSnapshot(invoice.client_snapshot);
  const labSnapshot = parseLabSnapshot(invoice.lab_snapshot);

  // Auftragsnummer generieren
  const auftragsnummer = generateAuftragsnummer(invoice, labSettings);

  // Herstellungsort ermitteln (Fallback auf Labor-Adresse)
  const herstellungsort = {
    strasse:
      labSettings.herstellungsort_strasse ||
      labSnapshot?.lab_street ||
      labSettings.lab_street ||
      "",
    plz:
      labSettings.herstellungsort_plz ||
      labSnapshot?.lab_postal_code ||
      labSettings.lab_postal_code ||
      "",
    ort:
      labSettings.herstellungsort_ort ||
      labSnapshot?.lab_city ||
      labSettings.lab_city ||
      "",
    land: labSettings.herstellungsort_land || "Deutschland",
  };

  // XML-Struktur aufbauen
  const xml = buildXmlDocument({
    auftragsnummer,
    invoice,
    items,
    labSettings,
    labSnapshot,
    clientSnapshot,
    herstellungsort,
  });

  // Dateiname generieren
  const filename = `${auftragsnummer}.xml`;

  return {
    xml,
    auftragsnummer,
    filename,
  };
}

/**
 * Baut das XML-Dokument zusammen
 */
function buildXmlDocument(params: {
  auftragsnummer: string;
  invoice: Invoice;
  items: InvoiceItem[];
  labSettings: UserSettings;
  labSnapshot: LabSnapshot | null;
  clientSnapshot: ClientSnapshot | null;
  herstellungsort: {
    strasse: string;
    plz: string;
    ort: string;
    land: string;
  };
}): string {
  const {
    auftragsnummer,
    invoice,
    items,
    labSettings,
    labSnapshot,
    clientSnapshot,
    herstellungsort,
  } = params;

  // Rechnungsdatum formatieren
  const rechnungsdatum = formatDate(invoice.invoice_date);

  // Faelligkeitsdatum formatieren (falls vorhanden)
  const faelligkeitsdatum = invoice.due_date
    ? formatDate(invoice.due_date)
    : "";

  // Labor-Name ermitteln
  const laborName =
    labSnapshot?.lab_name || labSettings.lab_name || "Unbekanntes Labor";

  // Labor-Adresse ermitteln
  const laborStrasse = [
    labSnapshot?.lab_street || labSettings.lab_street || "",
    labSnapshot?.lab_house_number || labSettings.lab_house_number || "",
  ]
    .filter(Boolean)
    .join(" ");

  // Empfaenger-Name ermitteln
  const empfaengerName = clientSnapshot?.practice_name
    ? clientSnapshot.practice_name
    : [clientSnapshot?.title, clientSnapshot?.first_name, clientSnapshot?.last_name]
        .filter(Boolean)
        .join(" ") || "Unbekannt";

  // Empfaenger-Adresse ermitteln
  const empfaengerStrasse = [
    clientSnapshot?.street || "",
    clientSnapshot?.house_number || "",
  ]
    .filter(Boolean)
    .join(" ");

  // Positionen als XML
  const positionenXml = items
    .map((item, index) => buildPositionXml(item, index + 1))
    .join("\n    ");

  // Summen berechnen
  const gesamtbetrag =
    (invoice.total_net_7 || 0) +
    (invoice.total_vat_7 || 0) +
    (invoice.total_net_19 || 0) +
    (invoice.total_vat_19 || 0);

  // XML-Dokument zusammenbauen
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Laborabrechnung xmlns="http://www.kzbv.de/Laborabrechnung"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 Version="4.5">
  <Kopfdaten>
    <Auftragsnummer>${escapeXml(auftragsnummer)}</Auftragsnummer>
    <Labornummer>${escapeXml(labSettings.ik_nummer || "")}</Labornummer>
    <Abrechnungsart>ZE</Abrechnungsart>
    <Rechnungsnummer>${escapeXml(invoice.invoice_number)}</Rechnungsnummer>
    <Rechnungsdatum>${rechnungsdatum}</Rechnungsdatum>${faelligkeitsdatum ? `
    <Faelligkeitsdatum>${faelligkeitsdatum}</Faelligkeitsdatum>` : ""}${(invoice as any).hkp_nummer ? `
    <Planidentifikation>${escapeXml((invoice as any).hkp_nummer)}</Planidentifikation>` : ""}
  </Kopfdaten>

  <Labor>
    <Name>${escapeXml(laborName)}</Name>
    <Strasse>${escapeXml(laborStrasse)}</Strasse>
    <PLZ>${escapeXml(labSnapshot?.lab_postal_code || labSettings.lab_postal_code || "")}</PLZ>
    <Ort>${escapeXml(labSnapshot?.lab_city || labSettings.lab_city || "")}</Ort>
    <Herstellungsort>
      <Strasse>${escapeXml(herstellungsort.strasse)}</Strasse>
      <PLZ>${escapeXml(herstellungsort.plz)}</PLZ>
      <Ort>${escapeXml(herstellungsort.ort)}</Ort>
      <Land>${escapeXml(herstellungsort.land)}</Land>
    </Herstellungsort>
  </Labor>

  <Empfaenger>
    <Name>${escapeXml(empfaengerName)}</Name>
    <Strasse>${escapeXml(empfaengerStrasse)}</Strasse>
    <PLZ>${escapeXml(clientSnapshot?.postal_code || "")}</PLZ>
    <Ort>${escapeXml(clientSnapshot?.city || "")}</Ort>
  </Empfaenger>
${invoice.patient_name ? `
  <Patient>
    <Name>${escapeXml(invoice.patient_name)}</Name>
  </Patient>
` : ""}
  <Positionen>
    ${positionenXml}
  </Positionen>

  <Summen>
    <Netto7>${formatDecimal(invoice.total_net_7 || 0)}</Netto7>
    <MwSt7>${formatDecimal(invoice.total_vat_7 || 0)}</MwSt7>
    <Netto19>${formatDecimal(invoice.total_net_19 || 0)}</Netto19>
    <MwSt19>${formatDecimal(invoice.total_vat_19 || 0)}</MwSt19>
    <Gesamtbetrag>${formatDecimal(gesamtbetrag)}</Gesamtbetrag>
  </Summen>
</Laborabrechnung>`;

  return xml;
}

/**
 * Baut eine einzelne Position als XML
 */
function buildPositionXml(item: InvoiceItem, posNr: number): string {
  const belNummer = formatBELNummer(item.position_code);
  const mwstGruppe = getMwStGruppe(item.vat_rate);

  // Chargennummer nur hinzufuegen wenn vorhanden
  const chargenXml = item.charge_number
    ? `
      <Chargennummer>${escapeXml(item.charge_number)}</Chargennummer>`
    : "";

  // Notizen nur hinzufuegen wenn vorhanden
  const notizenXml = item.notes
    ? `
      <Bemerkung>${escapeXml(item.notes)}</Bemerkung>`
    : "";

  return `<Position>
      <PosNr>${posNr}</PosNr>
      <BELNummer>${escapeXml(belNummer)}</BELNummer>
      <Bezeichnung>${escapeXml(item.position_name)}</Bezeichnung>
      <Menge>${formatDecimal(item.quantity)}</Menge>
      <Faktor>${formatDecimal(item.factor)}</Faktor>
      <Einzelpreis>${formatDecimal(item.unit_price)}</Einzelpreis>
      <Gesamtpreis>${formatDecimal(item.line_total)}</Gesamtpreis>
      <MwStGruppe>${mwstGruppe}</MwStGruppe>${chargenXml}${notizenXml}
    </Position>`;
}

/**
 * Generiert eine eindeutige Auftragsnummer
 * Format: {Hersteller}-{Kennung}-{Art}-{Praxis}-{LfdNr}-{Pruefziffer}
 */
export function generateAuftragsnummer(
  invoice: Invoice,
  labSettings: UserSettings
): string {
  // Hersteller-Kennung (6-stellig) - Platzhalter bis offizielle Kennung vorliegt
  const hersteller = "000000";

  // Kennung aus Rechnungsnummer extrahieren (5-stellig)
  const invoiceDigits = invoice.invoice_number.replace(/[^0-9]/g, "");
  const kennung = invoiceDigits.slice(-5).padStart(5, "0");

  // Abrechnungsart
  const art = "ZE"; // Zahnersatz

  // Praxis-Kennung (Platzhalter, 4-stellig)
  const praxis = "0000";

  // Laufende Nummer (3-stellig, aus UUID)
  const lfdNr = invoice.id
    .replace(/[^0-9a-f]/gi, "")
    .slice(-3)
    .toUpperCase()
    .padStart(3, "0");

  // Ohne Pruefziffer zusammenbauen
  const ohneP = `${hersteller}-${kennung}-${art}-${praxis}-${lfdNr}`;

  // Pruefziffer berechnen
  const pruefziffer = calculateCheckDigit(ohneP);

  return `${ohneP}-${pruefziffer}`;
}

/**
 * Berechnet die Pruefziffer nach Modulo-10-Verfahren
 */
export function calculateCheckDigit(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    // Gewichtung: ungerade Position * 1, gerade Position * 2
    const weighted = i % 2 === 0 ? digit : digit * 2;
    // Bei zweistelligem Ergebnis Quersumme bilden
    sum += weighted > 9 ? weighted - 9 : weighted;
  }

  // Pruefziffer = (10 - (Summe mod 10)) mod 10
  return String((10 - (sum % 10)) % 10);
}

/**
 * Formatiert eine BEL-Nummer auf 4 Stellen mit fuehrenden Nullen
 */
export function formatBELNummer(positionCode: string): string {
  // Bei Custom-Positionen (z.B. "E-100") unveraendert zurueckgeben
  if (!/^\d+$/.test(positionCode.replace(/^0+/, ""))) {
    return positionCode;
  }

  // Numerische BEL-Nummern auf 4 Stellen auffuellen
  const numeric = positionCode.replace(/[^0-9]/g, "");
  return numeric.padStart(4, "0");
}

/**
 * Mappt den MwSt-Satz auf die MwSt-Gruppe
 * Gruppe 1 = 7% (Laborleistungen)
 * Gruppe 2 = 19% (Material/Sonstiges)
 */
export function getMwStGruppe(vatRate: number): string {
  if (vatRate === 7) return "1";
  if (vatRate === 19) return "2";
  // Fallback: 19% = Gruppe 2
  return "2";
}

/**
 * Formatiert ein Datum im ISO-Format (YYYY-MM-DD)
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr; // Fallback: Original zurueckgeben
  }
  return date.toISOString().split("T")[0];
}

/**
 * Formatiert eine Dezimalzahl mit 2 Nachkommastellen
 */
function formatDecimal(value: number): string {
  return value.toFixed(2);
}

/**
 * Escaped Sonderzeichen fuer XML
 */
function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Parst das client_snapshot JSON-Feld
 */
function parseClientSnapshot(snapshot: Json | null): ClientSnapshot | null {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return null;
  }
  return snapshot as unknown as ClientSnapshot;
}

/**
 * Parst das lab_snapshot JSON-Feld
 */
function parseLabSnapshot(snapshot: Json | null): LabSnapshot | null {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return null;
  }
  return snapshot as unknown as LabSnapshot;
}
