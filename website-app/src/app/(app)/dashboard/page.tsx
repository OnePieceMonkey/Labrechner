'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  DashboardLayout,
  SearchView,
  TemplatesView,
  ClientsView,
  SettingsView,
  InvoicesView,
  InvoiceModal,
  TemplateCreationModal,
  OnboardingTour,
} from '@/components/dashboard';
import { useSearch } from '@/hooks/useSearch';
import { useInvoices, type InvoiceWithItems } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useAllPositions } from '@/hooks/useAllPositions';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { useFavorites } from '@/hooks/useFavorites';
import { useTemplates } from '@/hooks/useTemplates';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import type {
  TabType,
  LabType,
  Template,
  Recipient,
  UserSettings as ERPUserSettings,
  CustomPosition,
  BELPosition,
  TemplateItem,
} from '@/types/erp';
import { DEFAULT_USER_SETTINGS } from '@/types/erp';

// KZV Regionen & Mapping
const REGIONS = [
  'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Niedersachsen', 'Nordrhein',
  'Mecklenburg-Vorpommern', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt',
  'Schleswig-Holstein', 'Thüringen', 'Westfalen-Lippe',
];

const REGION_TO_KZV: Record<string, string> = {
  Bayern: 'KZVB', Berlin: 'KZV_Berlin', Brandenburg: 'KZV_Brandenburg', Bremen: 'KZV_Bremen',
  Hamburg: 'KZV_Hamburg', Hessen: 'KZV_Hessen', Niedersachsen: 'KZV_Niedersachsen', Nordrhein: 'KZV_Nordrhein',
  'Mecklenburg-Vorpommern': 'KZV_MV', 'Rheinland-Pfalz': 'KZV_RLP', Saarland: 'KZV_Saarland',
  Sachsen: 'KZV_Sachsen', 'Sachsen-Anhalt': 'KZV_Sachsen_Anhalt', 'Schleswig-Holstein': 'KZV_SH',
  Thüringen: 'KZV_Thueringen', 'Westfalen-Lippe': 'KZV_WL',
};

export default function NewDashboardPage() {
  const { settings: dbSettings, isLoading: settingsLoading, updateSettings } = useUser();
  const isProfileInitialized = useRef(false);
  const isKzvInitialized = useRef(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalPriceFactor, setGlobalPriceFactor] = useState(1.0);

  // Filter State
  const [selectedRegion, setSelectedRegion] = useState('Bayern');
  const [labType, setLabType] = useState<LabType>('gewerbe');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Data State
  const [localUserSettings, setLocalUserSettings] = useState<ERPUserSettings>(DEFAULT_USER_SETTINGS);
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);
  const [customPositions, setCustomPositions] = useState<CustomPosition[]>([]);

  // Hooks
  const { invoices, createInvoice, updateInvoice, deleteInvoice, addInvoiceItem, setInvoiceStatus, loading: invoicesLoading } = useInvoices();
  const { clients: dbClients, loading: clientsLoading, addClient: createClientHook, updateClient: updateClientHook, deleteClient: deleteClientHook } = useClients();
  const { favoriteIds, toggleFavorite: supabaseToggleFavorite, loading: favoritesLoading, refresh: refreshFavorites } = useFavorites();
  const { templates: dbTemplates, loading: templatesLoading, createTemplate, refresh: refreshTemplates, addTemplateItem } = useTemplates();

  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  const { positions: allBelPositions } = useAllPositions(kzvId, labType);
  const { downloadPDF, openPDFInNewTab } = usePDFGenerator();

  // Mappings für Favoriten (position_code <-> db_id)
  const codeToIdMap = useMemo(() => {
    const map: Record<string, number> = {};
    // Prio 1: Aus allBelPositions (Vollständig)
    allBelPositions.forEach(p => { if (p.db_id) map[p.id] = p.db_id; });
    return map;
  }, [allBelPositions]);

  const idToCodeMap = useMemo(() => {
    const map: Record<number, string> = {};
    allBelPositions.forEach(p => { if (p.db_id) map[p.db_id] = p.id; });
    return map;
  }, [allBelPositions]);

  // 1. Initial Profile Sync (Nur einmalig beim Laden)
  useEffect(() => {
    if (dbSettings && !isProfileInitialized.current) {
      setLabType(dbSettings.labor_type as LabType || 'gewerbe');
      setGlobalPriceFactor(dbSettings.global_factor || 1.0);
      setLocalUserSettings({
        name: dbSettings.user_id || '',
        labName: dbSettings.lab_name || '',
        street: dbSettings.lab_street || '',
        zip: dbSettings.lab_postal_code || '',
        city: dbSettings.lab_city || '',
        taxId: dbSettings.tax_id || '',
        nextInvoiceNumber: `INV-${dbSettings.next_invoice_number || 1001}`,
        bankName: dbSettings.bank_name || '',
        iban: dbSettings.iban || '',
        bic: dbSettings.bic || '',
        logoUrl: dbSettings.logo_url || null,
        jurisdiction: dbSettings.jurisdiction || ''
      });
      isProfileInitialized.current = true;
    }
  }, [dbSettings]);

  // 2. Initial Region Sync
  useEffect(() => {
    async function initKzv() {
      const supabase = createClient();
      const { data } = await supabase.from('kzv_regions').select('id, code, name') as { data: { id: number; code: string; name: string }[] | null };
      if (data) {
        const idToName = Object.fromEntries(data.map(k => [k.id, k.name]));
        const nameToId = Object.fromEntries(data.map(k => [k.name, k.id]));

        if (dbSettings?.kzv_id && idToName[dbSettings.kzv_id] && !isKzvInitialized.current) {
          setSelectedRegion(idToName[dbSettings.kzv_id]);
          setKzvId(dbSettings.kzv_id);
          isKzvInitialized.current = true;
        } else if (!isKzvInitialized.current) {
          const cid = nameToId[selectedRegion];
          if (cid) setKzvId(cid);
        }
      }
    }
    if (!settingsLoading && dbSettings) initKzv();
  }, [dbSettings, settingsLoading]);

  // Search Hook
  const { results, isLoading: searchLoading, hasMore, search, loadMore } = useSearch({
    kzvId,
    laborType: labType,
    groupId: selectedGroups.length > 0 ? parseInt(selectedGroups[0]) : null,
    limit: 20,
  });

  useEffect(() => { search(searchQuery); }, [searchQuery, search]);

  // UI Handlers
  const handleToggleFavorite = async (posCode: string) => {
    // Versuche ID aus Map zu holen
    let numericId = codeToIdMap[posCode];
    
    // Fallback: Suche in aktuellen Suchergebnissen
    if (!numericId) {
      const found = results.find(r => r.position_code === posCode);
      if (found) numericId = found.id;
    }

    if (numericId) {
      await supabaseToggleFavorite(numericId);
      refreshFavorites();
    } else {
      console.warn('ID Mapping nicht gefunden für Favorit:', posCode);
    }
  };

  const handleRegionChange = async (name: string) => {
    setSelectedRegion(name);
    const code = REGION_TO_KZV[name];
    if (code) {
      const supabase = createClient();
      const { data } = await supabase.from('kzv_regions').select('id').eq('code', code).single() as { data: { id: number } | null };
      if (data?.id) {
        setKzvId(data.id);
        await updateSettings({ kzv_id: data.id });
      }
    }
  };

  const uiFavorites = useMemo(() => 
    Array.from(favoriteIds).map(id => idToCodeMap[id]).filter((code): code is string => !!code),
  [favoriteIds, idToCodeMap]);

  const positionsForDisplay = useMemo(() => {
    if (activeTab === 'favorites') {
      return allBelPositions.filter(p => uiFavorites.includes(p.id));
    }
    const mapped = results.map(r => ({ id: r.position_code, position_code: r.position_code, name: r.name, price: r.price || 0, group: r.group_name || 'all' }));
    const cust = customPositions.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ ...p, group: 'Eigenpositionen' }));
    return [...mapped, ...cust];
  }, [activeTab, results, allBelPositions, customPositions, searchQuery, uiFavorites]);

  const formattedTemplates = useMemo(() => dbTemplates.map(t => ({
    id: parseInt(t.id) || Date.now(), db_id: t.id, name: t.name, factor: t.items[0]?.factor || 1.0,
    items: t.items.map(i => ({ id: i.position_id ? idToCodeMap[i.position_id] : i.custom_position_id, quantity: i.quantity })).filter(i => i.id)
  })), [dbTemplates, idToCodeMap]);

  // Invoice Handlers
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTemplateCreationModalOpen, setIsTemplateCreationModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);
  const [pendingItems, setPendingItems] = useState<{ id: string; quantity: number }[] | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('labrechner-onboarding-done')) setShowOnboarding(true);
  }, []);

  if (settingsLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="w-10 h-10 animate-spin text-brand-500" /></div>;
  }

  return (
    <DashboardLayout
      activeTab={activeTab} onTabChange={setActiveTab}
      selectedRegion={selectedRegion} onRegionChange={handleRegionChange}
      labType={labType} onLabTypeChange={async (t) => { setLabType(t); await updateSettings({ labor_type: t }); }}
      selectedGroup={selectedGroups[0] || 'all'} onGroupChange={g => setSelectedGroups(g === 'all' ? [] : [g])}
      isDark={isDark} toggleTheme={() => { const val = !isDark; setIsDark(val); localStorage.setItem('labrechner-dark', String(val)); document.documentElement.classList.toggle('dark'); }}
      regions={REGIONS} userName={localUserSettings.labName || 'Benutzer'}
    >
      {(activeTab === 'search' || activeTab === 'favorites') && (
        <SearchView
          positions={positionsForDisplay} favorites={uiFavorites}
          onToggleFavorite={handleToggleFavorite} selectedForTemplate={selectedForTemplate}
          onToggleSelection={id => setSelectedForTemplate(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          onClearSelection={() => setSelectedForTemplate([])} onCreateTemplate={() => setIsTemplateCreationModalOpen(true)}
          searchQuery={searchQuery} onSearchChange={setSearchQuery} globalPriceFactor={globalPriceFactor} labType={labType}
          isFavoritesView={activeTab === 'favorites'} isLoading={searchLoading || (activeTab === 'favorites' && favoritesLoading)} 
          hasMore={activeTab === 'search' && hasMore} onLoadMore={loadMore}
          is2026Data={!['Berlin', 'Brandenburg', 'Bremen', 'Hessen', 'Saarland'].includes(selectedRegion)}
        />
      )}

      {activeTab === 'templates' && (
        <TemplatesView
          templates={formattedTemplates as any} onUpdateTemplates={refreshTemplates}
          onCreateInvoice={(temp: any) => { setPendingItems(temp.items); setIsInvoiceModalOpen(true); }} 
          positions={allBelPositions as any}
          getPositionPrice={id => [...allBelPositions, ...customPositions].find(p => p.id === id)?.price || 0}
          getPositionName={id => [...allBelPositions, ...customPositions].find(p => p.id === id)?.name || id}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView 
          clients={dbClients.map(c => ({ id: c.id, customerNumber: c.customer_number || '', salutation: c.salutation || '', title: c.title || '', firstName: c.first_name || '', lastName: c.last_name, practiceName: c.practice_name || '', street: c.street || '', zip: c.postal_code || '', city: c.city || '' }))}
          onUpdateClients={async (newClients) => {
            if (newClients.length > dbClients.length) {
              const added = newClients.find(nc => !dbClients.some(dc => dc.id === nc.id));
              if (added) await createClientHook({ customer_number: added.customerNumber, salutation: added.salutation, title: added.title, first_name: added.firstName, last_name: added.lastName, practice_name: added.practiceName, street: added.street, postal_code: added.zip, city: added.city, country: 'Deutschland' });
            } else if (newClients.length < dbClients.length) {
              const delId = dbClients.find(dc => !newClients.some(nc => nc.id === dc.id))?.id;
              if (delId) await deleteClientHook(delId);
            }
          }}
        />
      )}

      {activeTab === 'invoices' && (
        <InvoicesView
          invoices={invoices} clients={dbClients as any} loading={invoicesLoading}
          onCreateInvoice={() => { setPendingItems(null); setEditingInvoice(null); setIsInvoiceModalOpen(true); }}
          onEditInvoice={inv => { setEditingInvoice(inv); setIsInvoiceModalOpen(true); }}
          onDeleteInvoice={deleteInvoice} onDownloadPDF={downloadPDF} onPreviewPDF={openPDFInNewTab} onStatusChange={setInvoiceStatus}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          userSettings={localUserSettings} onUpdateSettings={setLocalUserSettings}
          customPositions={customPositions} onUpdateCustomPositions={setCustomPositions}
          selectedRegion={selectedRegion} onRegionChange={handleRegionChange} regions={REGIONS}
          globalPriceFactor={globalPriceFactor} 
          onGlobalPriceFactorChange={async (f) => { setGlobalPriceFactor(f); await updateSettings({ global_factor: f }); }}
          isDark={isDark} toggleTheme={() => {}} 
          onRestartOnboarding={() => setShowOnboarding(true)}
          onSaveProfile={async () => {
            await updateSettings({
              lab_name: localUserSettings.labName, lab_street: localUserSettings.street, lab_postal_code: localUserSettings.zip,
              lab_city: localUserSettings.city, tax_id: localUserSettings.taxId, jurisdiction: localUserSettings.jurisdiction,
              bank_name: localUserSettings.bankName, iban: localUserSettings.iban, bic: localUserSettings.bic,
              logo_url: localUserSettings.logoUrl, next_invoice_number: parseInt(localUserSettings.nextInvoiceNumber.split('-')[1]) || 1001
            });
            alert('Profil erfolgreich gespeichert!');
          }}
        />
      )}

      <InvoiceModal 
        isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} 
        onSave={async (data) => {
          const client = dbClients.find(c => c.id === data.client_id);
          const newInv = await createInvoice({ ...data, status: 'draft', subtotal: 0, tax_rate: 19, tax_amount: 0, total: 0 }, client, dbSettings);
          if (newInv && pendingItems) {
            for (const item of pendingItems) {
              const pos = [...allBelPositions, ...customPositions].find(p => p.id === item.id);
              if (pos) {
                const vat = isNaN(parseInt(item.id)) ? (pos as any).vat_rate || 19 : 7;
                await addInvoiceItem(newInv.id, {
                  position_id: isNaN(parseInt(item.id)) ? null : (pos as any).db_id,
                  custom_position_id: isNaN(parseInt(item.id)) ? item.id : null,
                  position_code: (pos as any).position_code || item.id,
                  position_name: pos.name, quantity: item.quantity, factor: 1.0, unit_price: pos.price, line_total: pos.price * item.quantity, vat_rate: vat
                });
              }
            }
            setPendingItems(null);
            setActiveTab('invoices');
          }
        }} 
        clients={dbClients as any} initialData={editingInvoice} 
      />
      <TemplateCreationModal 
        isOpen={isTemplateCreationModalOpen} onClose={() => setIsTemplateCreationModalOpen(false)} 
        selectedPositions={positionsForDisplay.filter(p => selectedForTemplate.includes(p.id))} 
        onSave={async (name, items) => {
          const newTemp = await createTemplate({ name, icon: 'Layout', color: 'brand' });
          if (newTemp) {
            for (const item of items) {
              const posId = codeToIdMap[item.id];
              await addTemplateItem(newTemp.id, {
                position_id: isNaN(parseInt(item.id)) ? null : posId || null,
                custom_position_id: isNaN(parseInt(item.id)) ? item.id : null,
                quantity: item.quantity, factor: item.factor
              });
            }
            refreshTemplates();
            setSelectedForTemplate([]);
            setActiveTab('templates');
          }
        }} 
      />
      <OnboardingTour isOpen={showOnboarding} onComplete={() => { setShowOnboarding(false); localStorage.setItem('labrechner-onboarding-done', 'true'); }} onStepChange={step => { if (['search', 'favorites', 'templates', 'clients', 'settings'].includes(step)) setActiveTab(step as TabType); }} />
    </DashboardLayout>
  );
}
