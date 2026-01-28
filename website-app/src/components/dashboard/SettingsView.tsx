'use client';

import React, { useRef } from 'react';
import {
  Building2,
  MapPin,
  CreditCard,
  PenTool,
  FileCheck,
  Moon,
  Sun,
  PlayCircle,
  Sparkles,
  Upload,
  Trash2,
  Plus,
  Edit2,
  Scale,
  Loader2,
  Save,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PricingSection } from '@/components/subscription/PricingSection';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import type { UserSettings, CustomPosition } from '@/types/erp';
import { CustomPositionModal } from '@/components/dashboard/CustomPositionModal';

// Re-import icons from lucide-react (fix accidental typo in mock write)
import {
  Building2 as BuildingIcon,
  MapPin as MapIcon,
  CreditCard as CreditIcon,
  PenTool as PenIcon,
  FileCheck as FileIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  PlayCircle as PlayIcon,
  Sparkles as SparkleIcon,
  Upload as UploadIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  Edit2 as EditIcon,
  Scale as ScaleIcon,
  Image as ImgIcon,
} from 'lucide-react';

interface SettingsViewProps {
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  customPositions: CustomPosition[];
  onUpdateCustomPositions: (positions: CustomPosition[]) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regions: string[];
  globalPriceFactor: number;
  onGlobalPriceFactorChange: (factor: number) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onRestartOnboarding: () => void;
  onSaveProfile: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userSettings,
  onUpdateSettings,
  customPositions,
  onUpdateCustomPositions,
  selectedRegion,
  onRegionChange,
  regions,
  globalPriceFactor,
  onGlobalPriceFactorChange,
  isDark,
  toggleTheme,
  onRestartOnboarding,
  onSaveProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSaveProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : 'Speichern fehlgeschlagen. Bitte erneut versuchen.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };
  const [showCustomPosModal, setShowCustomPosModal] = React.useState(false);
  const [editingCustomPos, setEditingCustomPos] = React.useState<CustomPosition | null>(null);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    onUpdateSettings({ ...userSettings, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Das Bild ist zu groß (Max 3MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSetting('logoUrl', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomPosition = (position: CustomPosition) => {
    if (!position.id || !position.name) return;

    const filtered = customPositions.filter((p) => p.id !== position.id);
    onUpdateCustomPositions([
      ...filtered,
      { ...position, vat_rate: position.vat_rate || 19 },
    ]);

    setShowCustomPosModal(false);
    setEditingCustomPos(null);
  };

  const handleDeleteCustomPosition = (id: string) => {
    if (confirm('Position löschen?')) {
      onUpdateCustomPositions(customPositions.filter((p) => p.id !== id));
    }
  };

  const handleEditCustomPosition = (pos: CustomPosition) => {
    setEditingCustomPos(pos);
    setShowCustomPosModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 md:px-0 animate-fade-in pb-20">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Einstellungen
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Verwalten Sie Ihre Labordaten, Rechnungsdetails und Abonnements.
        </p>
      </div>

      <div className="space-y-12">
        {/* Subscription Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CreditIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Abonnement & Plan</h3>
          </div>
          <div className="space-y-6">
            <SubscriptionStatus />
            <PricingSection />
          </div>
        </section>

        {/* Lab Data Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BuildingIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Labor-Stammdaten</h3>
          </div>
          
          <SettingsCard
            icon={<BuildingIcon className="w-6 h-6" />}
            iconBg="bg-brand-50 dark:bg-brand-900/20"
            iconColor="text-brand-600 dark:text-brand-400"
            title="Adressdaten"
            description="Diese Daten erscheinen auf den generierten Rechnungen (PDF)."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Laborname"
                  value={userSettings.labName}
                  onChange={(v) => updateSetting('labName', v)}
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Ansprechpartner"
                  value={userSettings.name}
                  onChange={(v) => updateSetting('name', v)}
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="E-Mail Adresse (Labor)"
                  value={userSettings.labEmail || ''}
                  onChange={(v) => updateSetting('labEmail', v)}
                  placeholder="info@ihr-labor.de"
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Straße & Nr."
                  value={userSettings.street}
                  onChange={(v) => updateSetting('street', v)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:col-span-2">
                <InputField
                  label="PLZ"
                  value={userSettings.zip}
                  onChange={(v) => updateSetting('zip', v)}
                />
                <InputField
                  label="Stadt"
                  value={userSettings.city}
                  onChange={(v) => updateSetting('city', v)}
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="USt-IdNr."
                  value={userSettings.taxId}
                  onChange={(v) => updateSetting('taxId', v)}
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Gerichtsstand"
                  value={userSettings.jurisdiction}
                  onChange={(v) => updateSetting('jurisdiction', v)}
                  placeholder="z.B. Amtsgericht Musterstadt"
                  icon={<ScaleIcon className="w-4 h-4" />}
                />
              </div>
            </div>
          </SettingsCard>

          {/* Logo Upload */}
          <SettingsCard
            icon={<ImgIcon className="w-6 h-6" />}
            iconBg="bg-amber-50 dark:bg-amber-900/20"
            iconColor="text-amber-600 dark:text-amber-400"
            title="Firmenlogo"
            description="Erscheint auf der Rechnung oben rechts."
            premium
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {userSettings.logoUrl ? (
                  <>
                    <img
                      src={userSettings.logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      onClick={() => updateSetting('logoUrl', null)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 text-center px-2">
                    Kein Logo
                  </span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="secondary"
                  size="sm"
                  className="mb-2"
                >
                  <UploadIcon className="w-4 h-4 mr-2" /> Bild hochladen
                </Button>
                <p className="text-xs text-slate-400">
                  Max. 500x500px, 3 MB. (JPG, PNG)
                </p>
              </div>
            </div>
          </SettingsCard>

          {/* Bank Details */}
          <SettingsCard
            icon={<CreditIcon className="w-6 h-6" />}
            iconBg="bg-emerald-50 dark:bg-emerald-900/20"
            iconColor="text-emerald-600 dark:text-emerald-400"
            title="Bankverbindung"
            description="Wird in der Fußzeile der Rechnung angezeigt."
          >
            <div className="space-y-4">
              <InputField
                label="Bankname"
                value={userSettings.bankName}
                onChange={(v) => updateSetting('bankName', v)}
                placeholder="z.B. Sparkasse Musterstadt"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="IBAN"
                  value={userSettings.iban}
                  onChange={(v) => updateSetting('iban', v)}
                  placeholder="DE00 0000 0000 0000 00"
                  mono
                />
                <InputField
                  label="BIC"
                  value={userSettings.bic}
                  onChange={(v) => updateSetting('bic', v)}
                  placeholder="ABCDEF12"
                  mono
                />
              </div>
            </div>
          </SettingsCard>
        </section>

        {/* Configuration Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <PenIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konfiguration</h3>
          </div>

          {/* Custom Positions */}
          <SettingsCard
            icon={<PenIcon className="w-6 h-6" />}
            iconBg="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
            title="Eigenpositionen verwalten"
            description="Eigene Nummern und Preise anlegen."
            action={
              <div className="flex gap-2">
                <Button
                  onClick={() => alert('CSV Import: Coming Soon!')}
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                >
                  <UploadIcon className="w-3 h-3 mr-1" /> CSV Import
                </Button>
                <Button
                  onClick={() => {
                    setEditingCustomPos(null);
                    setShowCustomPosModal(true);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <PlusIcon className="w-4 h-4 mr-2" /> Neu
                </Button>
              </div>
            }
          >
            <div className="space-y-2">
              {customPositions.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  Keine eigenen Positionen vorhanden.
                </p>
              )}
              {customPositions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 group gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">
                      {pos.id}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                      {pos.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {pos.price.toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        {pos.vat_rate || 19}% MwSt
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditCustomPosition(pos)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomPosition(pos.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Invoice Config */}
          <SettingsCard
            icon={<FileIcon className="w-6 h-6" />}
            iconBg="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
            title="Rechnungs-Setup"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nächste Rechnungsnummer"
                value={userSettings.nextInvoiceNumber}
                onChange={(v) => updateSetting('nextInvoiceNumber', v)}
                mono
              />
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Globaler Faktor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={globalPriceFactor}
                  onChange={(e) =>
                    onGlobalPriceFactorChange(parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </SettingsCard>

          {/* Region */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <MapIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  KZV-Region
                </h3>
                <p className="text-xs text-slate-500">Basis für Höchstpreise</p>
              </div>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <SunIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Erscheinungsbild & Hilfe</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                  {isDark ? (
                    <MoonIcon className="w-6 h-6" />
                  ) : (
                    <SunIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dunkelmodus
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Erscheinungsbild anpassen.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 dark:text-teal-400">
                  <PlayIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Hilfe & Tour
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Onboarding erneut starten.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={onRestartOnboarding} className="w-full sm:w-auto">
                Tour starten
              </Button>
            </div>
          </div>
        </section>

        {/* Global Save Button */}
        <section className="pt-6 border-t border-gray-200 dark:border-slate-800">
          <Button
            onClick={handleSaveProfile}
            className={`w-full py-4 text-lg shadow-xl gap-2 ${
              saveSuccess
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
                : 'shadow-brand-500/20'
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saveSuccess ? 'Gespeichert' : 'Einstellungen Speichern'}
          </Button>
          {saveError && (
            <p className="text-center text-xs text-red-500 mt-2">
              {saveError}
            </p>
          )}
          <p className="text-center text-xs text-slate-400 mt-4">
            Ihre Daten werden sicher in Ihrem Benutzerprofil gespeichert.
          </p>
        </section>
      </div>

      {/* Custom Position Modal */}
      {showCustomPosModal && (
        <CustomPositionModal
          isOpen={showCustomPosModal}
          onClose={() => {
            setShowCustomPosModal(false);
            setEditingCustomPos(null);
          }}
          onSave={handleSaveCustomPosition}
          initial={editingCustomPos}
        />
      )}
    </div>
  );
};

// Helper Components
interface SettingsCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  premium?: boolean;
  action?: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  children,
  premium,
  action,
}) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
    {premium && (
      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-100 to-transparent dark:from-amber-900/30 px-4 py-1 rounded-bl-xl text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
        <SparkleIcon className="w-3 h-3" /> Premium
      </div>
    )}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 ${iconBg} rounded-xl ${iconColor}`}>{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  icon?: React.ReactNode;
  autoFocus?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  mono,
  icon,
  autoFocus,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
          mono ? 'font-mono' : ''
        }`}
      />
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
    </div>
  </div>
);
