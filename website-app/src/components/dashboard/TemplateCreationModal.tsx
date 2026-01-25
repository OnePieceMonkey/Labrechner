'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, Calculator } from 'lucide-react';
import type { BELPosition, CustomPosition, TemplateItem } from '@/types/erp';

interface TemplateCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPositions: (BELPosition | CustomPosition)[];
  onSave: (name: string, items: { id: string; quantity: number; factor: number }[]) => void;
}

export const TemplateCreationModal: React.FC<TemplateCreationModalProps> = ({
  isOpen,
  onClose,
  selectedPositions,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [items, setItems] = useState<{ id: string; quantity: number; factor: number; price: number; name: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(
        selectedPositions.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: 1,
          factor: 1.0,
        }))
      );
      setName(`Neue Vorlage (${new Date().toLocaleDateString('de-DE')})`);
    }
  }, [isOpen, selectedPositions]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const updateFactor = (id: string, factor: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, factor } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity * item.factor, 0);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, items.map(({ id, quantity, factor }) => ({ id, quantity, factor })));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Neue Vorlage erstellen"
      description="Konfigurieren Sie Ihre Auswahl für die neue Vorlage."
      className="max-w-3xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold">Gesamtpreis</span>
            <span className="text-2xl font-bold text-brand-600">{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
            <Button onClick={handleSave}>Vorlage speichern</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Vorlagenname
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name der Vorlage..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Markierte Positionen
          </label>
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3 text-center">Menge</th>
                  <th className="px-4 py-3 text-center">Faktor</th>
                  <th className="px-4 py-3 text-right">Einzelpreis</th>
                  <th className="px-4 py-3 text-right">Gesamt</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{item.id}</span>
                        <span className="text-xs text-slate-500 line-clamp-1">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          step="0.01"
                          value={item.factor}
                          onChange={(e) => updateFactor(item.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {item.price.toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {(item.price * item.quantity * item.factor).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="p-8 text-center text-slate-400 italic">
                Keine Positionen ausgewählt.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
