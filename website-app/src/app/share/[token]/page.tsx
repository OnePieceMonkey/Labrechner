'use client';

import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import type { Invoice, InvoiceItem } from '@/types/database';

export default function ShareInvoicePage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const isMobile = typeof navigator !== 'undefined'
    && /iPad|iPhone|iPod|Android|Mobi/i.test(navigator.userAgent);

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
        if (active) {
          setPdfUrl(url);
          const isIOS = typeof navigator !== 'undefined'
            && /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (isIOS) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              setFallbackUrl(result);
            };
            reader.readAsDataURL(blob);
          }
        }
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

  const handleOpenPdf = () => {
    if (fallbackUrl) {
      window.location.href = fallbackUrl;
      return;
    }
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

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
      {!isMobile && (
        <iframe title="Rechnung" src={pdfUrl} className="w-full h-screen" />
      )}
      {isMobile && (
        <div className="min-h-screen flex items-center justify-center p-6 text-center text-slate-600">
          <div className="space-y-4">
            <p>Mobile Vorschau ist eingeschraenkt.</p>
            <button
              onClick={handleOpenPdf}
              className="px-4 py-2 rounded-full bg-white shadow border border-gray-200 text-sm font-medium text-brand-600"
            >
              PDF oeffnen
            </button>
          </div>
        </div>
      )}
      {fallbackUrl && !isMobile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200">
          <a href={fallbackUrl} className="text-sm font-medium text-brand-600">
            Falls keine Vorschau: PDF öffnen
          </a>
        </div>
      )}
    </div>
  );
}
