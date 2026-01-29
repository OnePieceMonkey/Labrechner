'use client';

import { useState, useCallback } from 'react';
import type { Invoice, InvoiceItem } from '@/types/database';

export function usePDFGenerator() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate PDF as Blob
  const generatePDFBlob = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[]
  ): Promise<Blob> => {
    setGenerating(true);
    setError(null);

    try {
      // Dynamic import to avoid SSR issues
      const [{ pdf }, { InvoicePDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/InvoicePDF'),
      ]);

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

  // Download PDF
  const downloadPDF = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[],
    filename?: string
  ): Promise<void> => {
    try {
      const blob = await generatePDFBlob(invoice, items);
      const name = filename || `Rechnung_${invoice.invoice_number.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      throw err;
    }
  }, [generatePDFBlob]);

  // Generate PDF as Base64 (for iOS fallback or storage)
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

  // Open PDF in a new tab
  const openPDFInNewTab = useCallback(async (
    invoice: Invoice,
    items: InvoiceItem[]
  ): Promise<void> => {
    try {
      const isIOS = typeof navigator !== 'undefined'
        && /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        const base64 = await generatePDFBase64(invoice, items);
        const dataUrl = `data:application/pdf;base64,${base64}`;
        window.open(dataUrl, '_blank');
        return;
      }

      const blob = await generatePDFBlob(invoice, items);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      throw err;
    }
  }, [generatePDFBlob, generatePDFBase64]);

  return {
    generating,
    error,
    generatePDFBlob,
    downloadPDF,
    openPDFInNewTab,
    generatePDFBase64,
  };
}
