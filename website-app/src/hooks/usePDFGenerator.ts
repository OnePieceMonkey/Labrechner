'use client';

import { useState, useCallback } from 'react';
import type { Invoice, InvoiceItem } from '@/types/database';

export function usePDFGenerator() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PDF als Blob generieren
  const generatePDFBlob = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[]
  ): Promise<Blob> => {
    setGenerating(true);
    setError(null);

    try {
      // Dynamisch importieren um SSR-Probleme zu vermeiden
      const [{ pdf }, { InvoicePDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/InvoicePDF'),
      ]);

      // React Element erstellen
      const { createElement } = await import('react');
      const doc = createElement(InvoicePDF, { invoice, items });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(doc as any).toBlob();
      return blob;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Generieren des PDFs';
      setError(message);
      throw new Error(message);
    } finally {
      setGenerating(false);
    }
  }, []);

  // PDF herunterladen
  const downloadPDF = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[],
    filename?: string
  ): Promise<void> => {
    try {
      const blob = await generatePDFBlob(invoice, items);

      // Dateiname generieren
      const name = filename || `Rechnung_${invoice.invoice_number.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;

      // Download triggern
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Error wurde bereits in generatePDFBlob gesetzt
      throw err;
    }
  }, [generatePDFBlob]);

  // PDF in neuem Tab öffnen
  const openPDFInNewTab = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[]
  ): Promise<void> => {
    try {
      const blob = await generatePDFBlob(invoice, items);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      // URL nach kurzer Zeit freigeben
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      throw err;
    }
  }, [generatePDFBlob]);

  // PDF als Base64 (für Email-Anhang oder Supabase Storage)
  const generatePDFBase64 = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[]
  ): Promise<string> => {
    try {
      const blob = await generatePDFBlob(invoice, items);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Data URL Format: data:application/pdf;base64,XXX
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Fehler beim Lesen des PDFs'));
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      throw err;
    }
  }, [generatePDFBlob]);

  return {
    generating,
    error,
    generatePDFBlob,
    downloadPDF,
    openPDFInNewTab,
    generatePDFBase64,
  };
}
