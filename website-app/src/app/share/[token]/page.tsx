'use client';

import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import type { Invoice, InvoiceItem } from '@/types/database';

export default function ShareInvoicePage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/share/${params.token}`);
        if (!res.ok) {
          const { error: msg } = await res.json();
          throw new Error(msg || 'Fehler beim Laden');
        }
        const data = await res.json() as { invoice: Invoice; items: InvoiceItem[] };
        const blob = await pdf(<InvoicePDF invoice={data.invoice} items={data.items} />).toBlob();
        const url = URL.createObjectURL(blob);
        if (active) setPdfUrl(url);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [params.token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Lade Rechnung...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!pdfUrl) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Keine Vorschau verfügbar.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <iframe title="Rechnung" src={pdfUrl} className="w-full h-screen" />
    </div>
  );
}
