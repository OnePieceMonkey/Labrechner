'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CustomPosition } from '@/types/erp';

interface CustomPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: CustomPosition) => void | Promise<void>;
  initial?: CustomPosition | null;
}

const DEFAULT_POSITION: CustomPosition = {
  id: '',
  name: '',
  price: 0,
  vat_rate: 19,
};

export const CustomPositionModal: React.FC<CustomPositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initial,
}) => {
  const [form, setForm] = useState<CustomPosition>(DEFAULT_POSITION);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ...DEFAULT_POSITION,
      ...initial,
      id: initial?.id ?? '',
      name: initial?.name ?? '',
      price: Number.isFinite(initial?.price) ? initial!.price : 0,
      vat_rate: Number.isFinite(initial?.vat_rate) ? initial!.vat_rate : 19,
    });
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmedId = form.id.trim();
    const trimmedName = form.name.trim();
    if (!trimmedId || !trimmedName) return;

    const safePrice = Number.isFinite(form.price) ? form.price : 0;
    const safeVat = Number.isFinite(form.vat_rate) ? form.vat_rate : 19;

    await onSave({
      ...form,
      id: trimmedId,
      name: trimmedName,
      price: safePrice,
      vat_rate: safeVat,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Eigenposition {initial ? 'bearbeiten' : 'anlegen'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Positions-Nr. (z.B. E-100)
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              autoFocus
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bezeichnung
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Preis (EUR)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Number.isFinite(parseFloat(e.target.value))
                    ? parseFloat(e.target.value)
                    : 0,
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mehrwertsteuer
            </label>
            <select
              value={form.vat_rate || 19}
              onChange={(e) =>
                setForm({
                  ...form,
                  vat_rate: Number.isFinite(parseInt(e.target.value))
                    ? parseInt(e.target.value)
                    : 19,
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            >
              <option value={19}>19% (Standard)</option>
              <option value={7}>7% (Ermaessigt)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <Button onClick={onClose} variant="secondary" className="flex-1 justify-center">
            Abbrechen
          </Button>
          <Button onClick={handleSave} className="flex-1 justify-center">
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
};
