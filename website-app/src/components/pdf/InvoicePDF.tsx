'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Invoice, InvoiceItem } from '@/types/database';
import { formatPositionCode } from '@/lib/formatPositionCode';

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 150,
  },
  labInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: '#666666',
  },
  labName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  // Empfänger
  recipientSection: {
    marginBottom: 30,
  },
  recipientLabel: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 2,
  },
  recipientName: {
    fontSize: 11,
    fontWeight: 600,
  },
  recipientAddress: {
    fontSize: 10,
    marginTop: 2,
  },
  // Rechnungsinfo
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#8B5CF6', // Brand Purple
  },
  invoiceDetails: {
    textAlign: 'right',
  },
  invoiceDetailRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  invoiceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 2,
  },
  invoiceDetailLabel: {
    color: '#666666',
    marginRight: 8,
  },
  invoiceDetailValue: {
    fontWeight: 600,
    minWidth: 80,
    textAlign: 'right',
  },
  // Tabelle
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontWeight: 600,
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 9,
  },
  // Spaltenbreiten
  colPos: { width: '10%' },
  colDesc: { width: '30%' },
  colLot: { width: '12%' },
  colQty: { width: '10%', textAlign: 'right' },
  colFactor: { width: '10%', textAlign: 'right' },
  colPrice: { width: '14%', textAlign: 'right' },
  colTotal: { width: '14%', textAlign: 'right' },
  // Summen
  totalsSection: {
    marginLeft: 'auto',
    width: 200,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    color: '#666666',
  },
  totalValue: {
    textAlign: 'right',
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginVertical: 4,
  },
  grandTotal: {
    fontWeight: 700,
    fontSize: 12,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#8B5CF6',
  },
  grandTotalLabel: {
    color: '#1a1a1a',
  },
  grandTotalValue: {
    color: '#8B5CF6',
    textAlign: 'right',
  },
  // Zahlungsinfo
  paymentSection: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 4,
    marginBottom: 30,
  },
  paymentTitle: {
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 8,
    color: '#8B5CF6',
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  paymentLabel: {
    width: 80,
    color: '#666666',
    fontSize: 9,
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 600,
  },
  // Notizen
  notesSection: {
    marginBottom: 30,
  },
  notesTitle: {
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 6,
    color: '#666666',
  },
  notesText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerCol: {
    fontSize: 8,
    color: '#999999',
    flexShrink: 1,
  },
  footerLogo: {
    width: 40,
    height: 40,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLabel: {
    fontWeight: 600,
    marginBottom: 2,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: '#999999',
  },
});

// Interfaces für Snapshots
interface ClientSnapshot {
  id?: string;
  customer_number?: string | null;
  salutation?: string | null;
  title?: string | null;
  first_name?: string | null;
  last_name: string;
  practice_name?: string | null;
  street?: string | null;
  house_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
}

interface LabSnapshot {
  lab_name?: string | null;
  lab_street?: string | null;
  lab_house_number?: string | null;
  lab_postal_code?: string | null;
  lab_city?: string | null;
  tax_id?: string | null;
  vat_id?: string | null;
  jurisdiction?: string | null;
  bank_name?: string | null;
  iban?: string | null;
  bic?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
}

interface InvoicePDFProps {
  invoice: Invoice;
  items: InvoiceItem[];
}

// Hilfsfunktionen
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatFactor = (factor: number): string => {
  const safe = Number.isFinite(factor) ? factor : 1;
  return `x${safe.toFixed(2)}`;
};

// Helper: Hex-Farbe aufhellen für Hintergrund (simuliert Transparenz auf Weiß)
function lightenHex(hex: string, amount: number): string {
  // Entferne # falls vorhanden
  const cleanHex = hex.replace('#', '');
  // Parse RGB Werte
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Aufhellen (Richtung Weiß)
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);
  // Zurück zu Hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function InvoicePDF({ invoice, items }: InvoicePDFProps) {
  const clientSnapshot = invoice.client_snapshot as ClientSnapshot | null;
  const labSnapshot = invoice.lab_snapshot as LabSnapshot | null;

  // Brand color - use custom color if set, otherwise default purple
  const brandColor = labSnapshot?.brand_color || '#8B5CF6';
  // 60% Transparenz auf Weiß = 40% Aufhellung
  const brandColorLight = lightenHex(brandColor, 0.85);

  // Vollständiger Name des Empfängers
  const recipientFullName = clientSnapshot
    ? [
        clientSnapshot.salutation,
        clientSnapshot.title,
        clientSnapshot.first_name,
        clientSnapshot.last_name,
      ]
        .filter(Boolean)
        .join(' ')
    : 'Unbekannter Empfänger';

  // Adresse des Empfängers
  const recipientStreet = clientSnapshot
    ? `${clientSnapshot.street || ''} ${clientSnapshot.house_number || ''}`.trim()
    : '';
  const recipientCity = clientSnapshot
    ? `${clientSnapshot.postal_code || ''} ${clientSnapshot.city || ''}`.trim()
    : '';
  const recipientAddress = clientSnapshot
    ? [
        clientSnapshot.practice_name,
        recipientStreet && recipientCity ? `${recipientStreet}, ${recipientCity}` : recipientStreet || recipientCity,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  // Labor Adresse
  const labStreet = labSnapshot
    ? `${labSnapshot.lab_street || ''} ${labSnapshot.lab_house_number || ''}`.trim()
    : '';
  const labCity = labSnapshot
    ? `${labSnapshot.lab_postal_code || ''} ${labSnapshot.lab_city || ''}`.trim()
    : '';
  const labAddress = labStreet && labCity
    ? `${labStreet}, ${labCity}`
    : labStreet || labCity;


  const computed = (() => {
    let net7 = 0;
    let net19 = 0;
    for (const item of items) {
      const lineTotal = Number(item.line_total || 0);
      const vatRate = Number(item.vat_rate) || (item.position_id ? 7 : 19);
      if (vatRate == 19) {
        net19 += lineTotal;
      } else {
        net7 += lineTotal;
      }
    }
    const vat7 = Number((net7 * 0.07).toFixed(2));
    const vat19 = Number((net19 * 0.19).toFixed(2));
    const subtotal = Number((net7 + net19).toFixed(2));
    const total = Number((subtotal + vat7 + vat19).toFixed(2));
    return { net7, net19, vat7, vat19, subtotal, total };
  })();

  const subtotalValue = Number(invoice.subtotal) > 0 ? Number(invoice.subtotal) : computed.subtotal;
  const totalNet7 = Number(invoice.total_net_7) > 0 ? Number(invoice.total_net_7) : computed.net7;
  const totalNet19 = Number(invoice.total_net_19) > 0 ? Number(invoice.total_net_19) : computed.net19;
  const totalVat7 = Number(invoice.total_vat_7) > 0 ? Number(invoice.total_vat_7) : computed.vat7;
  const totalVat19 = Number(invoice.total_vat_19) > 0 ? Number(invoice.total_vat_19) : computed.vat19;
  const taxAmountValue = Number(invoice.tax_amount) > 0
    ? Number(invoice.tax_amount)
    : Number((computed.vat7 + computed.vat19).toFixed(2));
  const totalValue = Number(invoice.total) > 0 ? Number(invoice.total) : computed.total;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Logo jetzt im Footer */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.labName}>{labSnapshot?.lab_name || 'Dentallabor'}</Text>
          </View>
          <View style={styles.labInfo}>
            {labAddress && <Text>{labAddress}</Text>}
            {labSnapshot?.tax_id && <Text>USt-IdNr.: {labSnapshot.tax_id}</Text>}
            {labSnapshot?.vat_id && <Text>USt-ID: {labSnapshot.vat_id}</Text>}
          </View>
        </View>

        {/* Empfänger */}
        <View style={styles.recipientSection}>
          <Text style={styles.recipientLabel}>Rechnung an:</Text>
          <Text style={styles.recipientName}>{recipientFullName}</Text>
          {recipientAddress.split('\n').map((line, idx) => (
            <Text key={idx} style={styles.recipientAddress}>
              {line}
            </Text>
          ))}
        </View>

        {/* Rechnungsinfo */}
        <View style={styles.invoiceInfo}>
          <View>
            <Text style={[styles.invoiceTitle, { color: brandColor }]}>Rechnung</Text>
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Rechnungsnr.:</Text>
              <Text style={styles.invoiceDetailValue}>{invoice.invoice_number}</Text>
            </View>
            {invoice.patient_name && (
              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Patient:</Text>
                <Text style={styles.invoiceDetailValue}>{invoice.patient_name}</Text>
              </View>
            )}
            {clientSnapshot?.customer_number && (
              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Kundennr.:</Text>
                <Text style={styles.invoiceDetailValue}>{clientSnapshot.customer_number}</Text>
              </View>
            )}
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Datum:</Text>
              <Text style={styles.invoiceDetailValue}>{formatDate(invoice.invoice_date)}</Text>
            </View>
            {invoice.due_date && (
              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Zahlbar bis:</Text>
                <Text style={styles.invoiceDetailValue}>{formatDate(invoice.due_date)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Positionen-Tabelle */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colPos]}>Pos.</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Beschreibung</Text>
            <Text style={[styles.tableHeaderCell, styles.colLot]}>LOT/Charge</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Menge</Text>
            <Text style={[styles.tableHeaderCell, styles.colFactor]}>Faktor</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Einzelpreis</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Gesamt</Text>
          </View>

          {/* Rows */}
          {items.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}
            >
              <Text style={[styles.tableCell, styles.colPos]}>{formatPositionCode(item.position_code)}</Text>
              <View style={styles.colDesc}>
                <Text style={styles.tableCell}>{item.position_name}</Text>
                {item.notes && (
                  <Text style={[styles.tableCell, { color: '#999999', fontSize: 8, marginTop: 2 }]}>
                    {item.notes}
                  </Text>
                )}
              </View>
              <Text style={[styles.tableCell, styles.colLot]}>
                {(item as any).charge_number || '-'}
              </Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colFactor]}>{formatFactor(item.factor)}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatCurrency(item.line_total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summen */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Zwischensumme:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotalValue)}</Text>
          </View>
          
          {Number(totalNet7) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>MwSt. 7% auf {formatCurrency(Number(totalNet7))}:</Text>
              <Text style={styles.totalValue}>{formatCurrency(Number(totalVat7))}</Text>
            </View>
          )}

          {Number(totalNet19) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>MwSt. 19% auf {formatCurrency(Number(totalNet19))}:</Text>
              <Text style={styles.totalValue}>{formatCurrency(Number(totalVat19))}</Text>
            </View>
          )}

          {/* Fallback falls alte Rechnung ohne Split-Daten */}
          {Number(totalNet7) === 0 && Number(totalNet19) === 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>MwSt. ({invoice.tax_rate}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(Number(taxAmountValue))}</Text>
            </View>
          )}

          <View style={[styles.totalRow, styles.grandTotal, { borderTopColor: brandColor }]}>
            <Text style={styles.grandTotalLabel}>Gesamtbetrag:</Text>
            <Text style={[styles.grandTotalValue, { color: brandColor }]}>{formatCurrency(Number(totalValue))}</Text>
          </View>
        </View>

        {/* Zahlungsinformationen */}
        {labSnapshot?.bank_name && labSnapshot?.iban && (
          <View style={[styles.paymentSection, { backgroundColor: brandColorLight }]}>
            <Text style={[styles.paymentTitle, { color: brandColor }]}>Bankverbindung</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Bank:</Text>
              <Text style={styles.paymentValue}>{labSnapshot.bank_name}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>IBAN:</Text>
              <Text style={styles.paymentValue}>{labSnapshot.iban}</Text>
            </View>
            {labSnapshot.bic && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>BIC:</Text>
                <Text style={styles.paymentValue}>{labSnapshot.bic}</Text>
              </View>
            )}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Verwendung:</Text>
              <Text style={styles.paymentValue}>{invoice.invoice_number}</Text>
            </View>
          </View>
        )}

        {/* Notizen */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Hinweise</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Logo links im Footer */}
          {labSnapshot?.logo_url && (
            <View style={styles.footerLogo}>
              <Image
                src={labSnapshot.logo_url}
                style={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </View>
          )}
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>{labSnapshot?.lab_name || 'Dentallabor'}</Text>
            <Text>{labAddress.replace('\n', ' • ')}</Text>
            {labSnapshot?.jurisdiction && (
              <>
                <Text style={styles.footerLabel}>Gerichtsstand</Text>
                <Text>{labSnapshot.jurisdiction}</Text>
              </>
            )}
          </View>
        </View>

        {/* Seitennummer */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export default InvoicePDF;
