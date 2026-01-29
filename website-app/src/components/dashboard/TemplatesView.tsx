'use client';

import React, { useState } from 'react';
import {
  Layout,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Wand2,
  Loader2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Template, TemplateItem, BELPosition, CustomPosition } from '@/types/erp';
import { formatPositionCode } from '@/lib/formatPositionCode';

interface TemplatesViewProps {
  templates: Template[];
  onUpdateTemplates: (templates: Template[]) => void;
  onCreateInvoice: (template: Template) => void;
  positions: (BELPosition | CustomPosition)[];
  getPositionPrice: (id: string) => number;
  getPositionName: (id: string) => string;
  isCustomPosition: (id: string) => boolean;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onUpdateTemplates,
  onCreateInvoice,
  positions,
  getPositionPrice,
  getPositionName,
  isCustomPosition,
}) => {
  // Modal States
  const [createTemplateModal, setCreateTemplateModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [addItemModal, setAddItemModal] = useState<string | null>(null);
  const [addItemQuery, setAddItemQuery] = useState('');
  const [pendingAddItem, setPendingAddItem] = useState<BELPosition | CustomPosition | null>(null);
  const [pendingAddQuantity, setPendingAddQuantity] = useState(1);

  // Form States
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFactor, setNewTemplateFactor] = useState(1.0);
  const [newTemplateItems, setNewTemplateItems] = useState<TemplateItem[]>([]);

  // AI States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const calculateTemplateTotal = (items: TemplateItem[], factor: number) => {
    const sum = items.reduce(
      (s, item) => s + getPositionPrice(item.id) * item.quantity,
      0
    );
    return sum * factor;
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplateId(template.id);
    setNewTemplateName(template.name);
    setNewTemplateFactor(template.factor);
    setNewTemplateItems(JSON.parse(JSON.stringify(template.items)));
    setCreateTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;

    if (editingTemplateId) {
      onUpdateTemplates(
        templates.map((t) =>
          t.id === editingTemplateId
            ? {
                ...t,
                name: newTemplateName,
                items: newTemplateItems,
                factor: newTemplateFactor,
              }
            : t
        )
      );
    } else {
      const newTemplate: Template = {
        id: `temp-${Date.now()}`,
        name: newTemplateName,
        items: newTemplateItems,
        factor: newTemplateFactor,
      };
      onUpdateTemplates([...templates, newTemplate]);
    }

    closeModal();
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Vorlage wirklich löschen?')) {
      onUpdateTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleRemoveItemFromTemplate = (
    templateId: string,
    itemIndex: number
  ) => {
    onUpdateTemplates(
      templates.map((t) =>
        t.id === templateId
          ? { ...t, items: t.items.filter((_, idx) => idx !== itemIndex) }
          : t
      )
    );
  };

  const handleSelectItemForTemplate = (positionId: string) => {
    if (addItemModal === null) return;
    const selected = positions.find((p) => p.id === positionId) || null;
    setPendingAddItem(selected);
    setPendingAddQuantity(1);
  };

  const confirmAddItemToTemplate = () => {
    if (!pendingAddItem || addItemModal === null) return;
    const safeQuantity = Number.isFinite(pendingAddQuantity) && pendingAddQuantity > 0 ? pendingAddQuantity : 1;

    onUpdateTemplates(
      templates.map((t) => {
        if (t.id !== addItemModal) return t;
        const existingIndex = t.items.findIndex((item) => item.id === pendingAddItem.id);
        if (existingIndex >= 0) {
          const updatedItems = t.items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + safeQuantity }
              : item
          );
          return { ...t, items: updatedItems };
        }
        return { ...t, items: [...t.items, { id: pendingAddItem.id, isAi: false, quantity: safeQuantity, factor: 1.0 }] };
      })
    );

    setPendingAddItem(null);
    setPendingAddQuantity(1);
    setAddItemModal(null);
    setAddItemQuery('');
  };

  const updateNewTemplateItemQuantity = (id: string, qty: number) => {
    setNewTemplateItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const updateNewTemplateItemFactor = (id: string, factor: number) => {
    setNewTemplateItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, factor } : item))
    );
  };

  const updateNewTemplateItemChargeNumber = (id: string, chargeNumber: string) => {
    setNewTemplateItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, chargeNumber: chargeNumber || null } : item))
    );
  };

  const removeItemFromNewTemplate = (id: string) => {
    setNewTemplateItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Simulation - wird später durch echte OpenAI API ersetzt
    setTimeout(() => {
      const suggestions: string[] = [];
      const currentIds = newTemplateItems.map((i) => i.id);

      // Simple logic: suggest related items
      if (currentIds.includes('0010') && !currentIds.includes('0052')) {
        suggestions.push('0052');
      }
      if (currentIds.some((id) => id.startsWith('10')) && !currentIds.includes('3800')) {
        suggestions.push('3800');
      }

      setAiSuggestions(suggestions.filter((s) => !currentIds.includes(s)));
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const acceptAiSuggestion = (id: string) => {
    setNewTemplateItems((prev) => [...prev, { id, isAi: true, quantity: 1 }]);
    setAiSuggestions((prev) => prev.filter((s) => s !== id));
  };

  const closeModal = () => {
    setCreateTemplateModal(false);
    setEditingTemplateId(null);
    setNewTemplateName('');
    setNewTemplateFactor(1.0);
    setNewTemplateItems([]);
    setAiSuggestions([]);
  };

  const filteredAddPositions = positions.filter(
    (pos) =>
      pos.name.toLowerCase().includes(addItemQuery.toLowerCase()) ||
      pos.id.includes(addItemQuery)
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Meine Vorlagen
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Sparen Sie Zeit mit vordefinierten Positionsketten.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => handleEditTemplate(template)}
            onDelete={() => handleDeleteTemplate(template.id)}
            onAddItem={() => {
              setAddItemModal(template.id);
              setPendingAddItem(null);
              setPendingAddQuantity(1);
            }}
            onRemoveItem={(idx) => handleRemoveItemFromTemplate(template.id, idx)}
            onCreateInvoice={() => onCreateInvoice(template)}
            calculateTotal={() =>
              calculateTemplateTotal(template.items, template.factor)
            }
            getPositionName={getPositionName}
            isCustomPosition={isCustomPosition}
          />
        ))}

        {/* Add New Template Card */}
        <button
          onClick={() => setCreateTemplateModal(true)}
          className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500/50 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all gap-3 min-h-[250px]"
        >
          <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Neue Vorlage erstellen</span>
        </button>
      </div>

      {/* Create/Edit Template Modal */}
      {createTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingTemplateId ? 'Vorlage bearbeiten' : 'Vorlage erstellen'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              {/* Name & Factor */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name der Vorlage
                  </label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="z.B. Reparatur UK"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preisfaktor
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={newTemplateFactor}
                      onChange={(e) =>
                        setNewTemplateFactor(parseFloat(e.target.value))
                      }
                      className="w-24 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                    />
                    <span className="text-xs text-slate-500">Standard: 1.0</span>
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-500/20 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-sm mb-3">
                  <Sparkles className="w-4 h-4" /> KI-Assistent
                </div>
                {!isAiAnalyzing && aiSuggestions.length === 0 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mb-3">
                      Basierend auf Ihrer Auswahl können wir fehlende Positionen
                      ergänzen.
                    </p>
                    <Button
                      onClick={handleAiAnalysis}
                      variant="secondary"
                      size="sm"
                      className="bg-white/50 border-purple-200 text-purple-700 hover:bg-white"
                    >
                      <Wand2 className="w-3 h-3 mr-2" /> Vorschläge generieren
                    </Button>
                  </div>
                )}
                {isAiAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-4 text-purple-600 dark:text-purple-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-xs font-medium">Analysiere...</span>
                  </div>
                )}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
                      Vorgeschlagene Positionen:
                    </p>
                    {aiSuggestions.map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg"
                      >
                        <span className="text-sm">
                          {id} - {getPositionName(id)}
                        </span>
                        <Button
                          onClick={() => acceptAiSuggestion(id)}
                          size="sm"
                          variant="ghost"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Positionen & Menge</span>
                  <span>{newTemplateItems.length} Ges.</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  {newTemplateItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded-lg border ${isCustomPosition(item.id) ? 'bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/30' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-500">
                          {formatPositionCode(item.id)}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {getPositionName(item.id)}
                          </span>
                          {item.isAi && (
                            <span className="text-[10px] text-purple-500 flex items-center gap-1">
                              <Sparkles className="w-2 h-2" /> KI-Vorschlag
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Menge</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateNewTemplateItemQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-12 text-center text-sm bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white p-1"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Faktor</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={item.factor || 1.0}
                            onChange={(e) =>
                              updateNewTemplateItemFactor(
                                item.id,
                                parseFloat(e.target.value) || 1.0
                              )
                            }
                            className="w-14 text-center text-sm bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white p-1"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Charge</span>
                          <input
                            type="text"
                            placeholder="LOT"
                            value={item.chargeNumber || ''}
                            onChange={(e) =>
                              updateNewTemplateItemChargeNumber(
                                item.id,
                                e.target.value
                              )
                            }
                            className="w-20 text-center text-sm bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white p-1"
                            title="Chargennummer / LOT-Nummer"
                          />
                        </div>
                        <button
                          onClick={() => removeItemFromNewTemplate(item.id)}
                          className="text-slate-400 hover:text-red-500 ml-1 mt-4"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {newTemplateItems.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      Noch keine Positionen ausgewählt.
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={closeModal}
                  variant="secondary"
                  className="flex-1 justify-center"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="flex-1 justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Speichern
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addItemModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] border border-gray-200 dark:border-slate-800">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Position hinzufügen
              </h3>
              <button
                onClick={() => {
                  setAddItemModal(null);
                  setAddItemQuery('');
                  setPendingAddItem(null);
                  setPendingAddQuantity(1);
                }}
              >
                <X className="w-5 h-5 text-slate-400 dark:text-white" />
              </button>
            </div>
            <div className="p-4">
              <input
                className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Suche..."
                value={addItemQuery}
                onChange={(e) => setAddItemQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto p-2">
              {filteredAddPositions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => handleSelectItemForTemplate(pos.id)}
                  className={`w-full text-left p-2 rounded flex justify-between text-slate-700 dark:text-slate-300 transition-colors ${
                    isCustomPosition(pos.id)
                      ? 'bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 hover:bg-amber-50'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{pos.name}</span>
                    <span className="text-xs text-slate-400">{formatPositionCode(pos.id)}</span>
                  </div>
                  <span className="font-mono">{pos.price.toFixed(2)}€</span>
                </button>
              ))}
              {filteredAddPositions.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm">
                  Keine Treffer.
                </div>
              )}
            </div>
            {pendingAddItem && (
              <div className="border-t border-gray-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold">Auswahl</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatPositionCode(pendingAddItem.id)} — {pendingAddItem.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold">Menge</span>
                      <input
                        type="number"
                        min="1"
                        value={pendingAddQuantity}
                        onChange={(e) => setPendingAddQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 text-center text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-1 text-slate-900 dark:text-white"
                      />
                    </div>
                    <Button size="sm" onClick={confirmAddItemToTemplate}>
                      Hinzufügen
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onCreateInvoice: () => void;
  calculateTotal: () => number;
  getPositionName: (id: string) => string;
  isCustomPosition: (id: string) => boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onAddItem,
  onRemoveItem,
  onCreateInvoice,
  calculateTotal,
  getPositionName,
  isCustomPosition,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {template.name}
            </h3>
            <div className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block text-slate-500 mt-1">
              Faktor {template.factor.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-slate-400 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
        {template.items.map((item, i) => (
          <div
            key={i}
            className={`group/item relative px-2.5 py-1 text-xs font-mono rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
              item.isAi
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
                : isCustomPosition(item.id)
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/40'
                  : 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            onClick={() => onRemoveItem(i)}
          >
            {item.quantity > 1 && (
              <span className="font-bold mr-1 text-slate-900 dark:text-white">
                {item.quantity}x
              </span>
            )}
            {formatPositionCode(item.id)}
            {item.isAi && <Sparkles className="w-2.5 h-2.5 text-purple-500" />}
            <X className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity ml-1" />
          </div>
        ))}
        <button
          onClick={onAddItem}
          className="px-2 py-1 border border-dashed border-gray-300 dark:border-slate-600 text-xs text-slate-400 rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {template.items.length} Positionen
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold text-slate-900 dark:text-white">
            {calculateTotal().toFixed(2)} €
          </div>
          <div className="text-[10px] text-slate-400">inkl. Faktor</div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4">
        <Button
          onClick={onCreateInvoice}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          In Rechnung übernehmen
        </Button>
      </div>
    </div>
  );
};
