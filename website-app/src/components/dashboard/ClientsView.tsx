'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Recipient } from '@/types/erp';
import { DEFAULT_RECIPIENT } from '@/types/erp';

interface ClientsViewProps {
  clients: Recipient[];
  onUpdateClients: (clients: Recipient[]) => Promise<void> | void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onUpdateClients,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Recipient>>(DEFAULT_RECIPIENT);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleOpenModal = (client?: Recipient) => {
    if (client) {
      setEditingClientId(client.id);
      setFormData(client);
    } else {
      setEditingClientId(null);
      setFormData(DEFAULT_RECIPIENT);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClientId(null);
    setFormData(DEFAULT_RECIPIENT);
    setSaveStatus('idle');
    setSaveError(null);
  };

  const handleSaveClient = async () => {
    const requiredFields: Array<{ label: string; value: string | undefined }> = [
      { label: 'Kundennummer', value: formData.customerNumber },
      { label: 'Nachname', value: formData.lastName },
      { label: 'Praxisname', value: formData.practiceName },
      { label: 'E-Mail Adresse', value: formData.email },
      { label: 'Straße', value: formData.street },
      { label: 'PLZ', value: formData.zip },
      { label: 'Ort', value: formData.city },
    ];

    const missing = requiredFields
      .filter((f) => !f.value || f.value.trim() === '')
      .map((f) => f.label);

    if (missing.length > 0) {
      setSaveStatus('error');
      setSaveError(`Bitte füllen Sie die Pflichtfelder aus: ${missing.join(', ')}`);
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSaveStatus('error');
      setSaveError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    // Validierung: Entweder Nachname ODER Praxisname muss ausgefüllt sein
    if (!formData.lastName && !formData.practiceName) {
      setSaveStatus('error');
      setSaveError('Bitte geben Sie einen Nachnamen oder Praxisnamen an.');
      return;
    }

    // Email-Validierung (optional, aber wenn ausgefüllt, muss sie valide sein)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSaveStatus('error');
      setSaveError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    const newClient: Recipient = {
      id: editingClientId || Date.now().toString(),
      customerNumber: formData.customerNumber || '',
      salutation: formData.salutation || 'Herr',
      title: formData.title || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      practiceName: formData.practiceName || '',
      street: formData.street || '',
      zip: formData.zip || '',
      city: formData.city || '',
      email: formData.email || '',
    };

    setSaveStatus('saving');
    setSaveError(null);
    try {
      if (editingClientId) {
        await Promise.resolve(
          onUpdateClients(
            clients.map((c) => (c.id === editingClientId ? newClient : c))
          )
        );
      } else {
        await Promise.resolve(onUpdateClients([...clients, newClient]));
      }
      setSaveStatus('success');
      setTimeout(() => {
        handleCloseModal();
      }, 900);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.');
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Kunden wirklich löschen?')) {
      onUpdateClients(clients.filter((c) => c.id !== id));
    }
  };

  const updateFormField = (field: keyof Recipient, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Kundenverwaltung
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Verwalten Sie Ihre Zahnärzte und Praxen.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Neuer Kunde
        </Button>
      </div>

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="mb-4">Noch keine Kunden angelegt.</p>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" /> Ersten Kunden anlegen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => handleOpenModal(client)}
              onDelete={() => handleDeleteClient(client.id)}
            />
          ))}
        </div>
      )}

      {/* Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                {editingClientId ? 'Kunde bearbeiten' : 'Neuer Kunde'}
              </h3>
              <button onClick={handleCloseModal}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                {/* Customer Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Kundennummer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. 10050"
                    value={formData.customerNumber || ''}
                    onChange={(e) =>
                      updateFormField('customerNumber', e.target.value)
                    }
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                {/* Salutation & Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Anrede
                    </label>
                    <select
                      value={formData.salutation || 'Herr'}
                      onChange={(e) =>
                        updateFormField('salutation', e.target.value)
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Herr">Herr</option>
                      <option value="Frau">Frau</option>
                      <option value="">Keine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Titel (opt)
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => updateFormField('title', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      placeholder="Dr. / Dr. med."
                    />
                  </div>
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Vorname
                    </label>
                    <input
                      type="text"
                      placeholder="Vorname"
                      value={formData.firstName || ''}
                      onChange={(e) =>
                        updateFormField('firstName', e.target.value)
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Nachname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nachname"
                    value={formData.lastName || ''}
                    onChange={(e) =>
                      updateFormField('lastName', e.target.value)
                    }
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                  </div>
                </div>

                {/* Practice Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Praxisname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Praxis Dr. Beispiel"
                    value={formData.practiceName || ''}
                    onChange={(e) =>
                      updateFormField('practiceName', e.target.value)
                    }
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    * Pflichtfeld
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    E-Mail Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="zahnarzt@praxis.de"
                    value={formData.email || ''}
                    onChange={(e) =>
                      updateFormField('email', e.target.value)
                    }
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Straße & Nr. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Straße & Nr."
                    value={formData.street || ''}
                    onChange={(e) => updateFormField('street', e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* ZIP & City */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      PLZ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="PLZ"
                      value={formData.zip || ''}
                      onChange={(e) => updateFormField('zip', e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Ort <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ort"
                      value={formData.city || ''}
                      onChange={(e) => updateFormField('city', e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Abbrechen
              </Button>
              <Button
                onClick={handleSaveClient}
                disabled={saveStatus === 'saving'}
                className={
                  saveStatus === 'saving' || saveStatus === 'success'
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
                    : ''
                }
              >
                {saveStatus === 'saving'
                  ? 'Speichert...'
                  : saveStatus === 'success'
                    ? 'Gespeichert'
                    : 'Speichern'}
              </Button>
            </div>
            {saveError && (
              <div className="px-6 pb-6 text-sm text-red-500">
                {saveError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Client Card Component
interface ClientCardProps {
  client: Recipient;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex justify-between items-start group">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {client.practiceName ||
              `${client.firstName} ${client.lastName}`}
          </h3>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">
            #{client.customerNumber}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {client.salutation} {client.title} {client.firstName}{' '}
          {client.lastName}
        </p>
        {client.email && (
          <p className="text-xs text-brand-500 dark:text-brand-400 mt-1 font-medium">
            {client.email}
          </p>
        )}
        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {client.street}, {client.zip} {client.city}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
