'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Client, Invoice } from '@/types/database';
import { User, Calendar, FileText } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    client_id: string;
    invoice_date: string;
    patient_name: string;
  }) => Promise<void>;
  clients: Client[];
  initialData?: Invoice | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  initialData,
}) => {
  const [clientId, setClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [patientName, setPatientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.client_id || '');
      setInvoiceDate(initialData.invoice_date.split('T')[0]);
      setPatientName(initialData.patient_name || '');
    } else {
      setClientId('');
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setPatientName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setIsSubmitting(true);
    try {
      await onSave({
        client_id: clientId,
        invoice_date: invoiceDate,
        patient_name: patientName,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save invoice', error);
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

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !clientId}>
            {isSubmitting ? 'Wird gespeichert...' : initialData ? 'Änderungen speichern' : 'Rechnung erstellen'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
