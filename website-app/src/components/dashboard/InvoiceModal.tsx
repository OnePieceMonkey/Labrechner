'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Client, Invoice } from '@/types/database';
import { User, Calendar, FileText, FileCode } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    client_id: string;
    invoice_date: string;
    patient_name: string;
    generate_xml: boolean;
  }) => Promise<void>;
  clients: Client[];
  initialData?: Invoice | null;
  xmlExportDefault?: boolean;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  initialData,
  xmlExportDefault = false,
}) => {
  const [clientId, setClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [patientName, setPatientName] = useState('');
  const [generateXml, setGenerateXml] = useState(xmlExportDefault);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.client_id || '');
      setInvoiceDate(initialData.invoice_date.split('T')[0]);
      setPatientName(initialData.patient_name || '');
      setGenerateXml(initialData.generate_xml || false);
    } else {
      setClientId('');
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setPatientName('');
      setGenerateXml(xmlExportDefault);
    }
  }, [initialData, isOpen, xmlExportDefault]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSave({
        client_id: clientId,
        invoice_date: invoiceDate,
        patient_name: patientName,
        generate_xml: generateXml,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save invoice', error);
      setSubmitError('Rechnung konnte nicht erstellt werden. Bitte erneut versuchen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Rechnung bearbeiten' : 'Neue Rechnung erstellen'}
      description="Geben Sie die Basisdaten für die Rechnung ein. Positionen können Sie im nächsten Schritt hinzufügen."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kunde */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" /> Kunde / Praxis
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          >
            <option value="">Bitte wählen...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.practice_name || `${client.first_name} ${client.last_name}`}
                {client.customer_number ? ` (${client.customer_number})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Datum */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Rechnungsdatum
          </label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
        </div>

        {/* Patient (NEU) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Patientenname (optional)
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="z.B. Max Mustermann"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Dieser Name erscheint auf dem Rechnungs-PDF unter den Falldetails.
          </p>
        </div>

        {/* DTVZ-XML Export */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FileCode className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-white">
                  DTVZ-XML generieren
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  XML-Datei fuer Import in Praxissoftware
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={generateXml}
                onChange={(e) => setGenerateXml(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !clientId}>
            {isSubmitting ? 'Wird gespeichert...' : initialData ? 'Änderungen speichern' : 'Rechnung erstellen'}
          </Button>
        </div>
        {submitError && (
          <p className="text-xs text-red-500 text-center">{submitError}</p>
        )}
      </form>
    </Modal>
  );
};
