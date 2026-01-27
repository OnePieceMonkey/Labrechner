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
import { useTheme } from 'next-themes';
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

// KZV Konfiguration
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
  const { settings: dbSettings, isLoading: settingsLoading, updateSettings, user } = useUser();
  const { theme, setTheme } = useTheme();
  const isProfileInitialized = useRef(false);
  const isKzvInitialized = useRef(false);
  
  // === UI STATES ===
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalPriceFactor, setGlobalPriceFactor] = useState(1.0);

  // === FILTER STATES ===
  const [selectedRegion, setSelectedRegion] = useState('Bayern');
  const [labType, setLabType] = useState<LabType>('gewerbe');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // Array für Multi-Select Vorbereitung
  const activeGroup = selectedGroups[0] || 'all';
  const parsedGroupId = Number.parseInt(activeGroup, 10);
  const activeGroupId = Number.isFinite(parsedGroupId) ? parsedGroupId : null;
  const showCustomOnly = activeGroup === 'custom';
  const showAllGroups = activeGroup === 'all' || selectedGroups.length === 0;

  // === DATA STATES ===
  const [localUserSettings, setLocalUserSettings] = useState<ERPUserSettings>(DEFAULT_USER_SETTINGS);
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);
  const [customPositions, setCustomPositions] = useState<CustomPosition[]>([]);
  const [customPositionsLoaded, setCustomPositionsLoaded] = useState(false);

  // === HOOKS ===
  const { invoices, createInvoice, updateInvoice, deleteInvoice, addInvoiceItem, setInvoiceStatus, loading: invoicesLoading } = useInvoices();
  const { clients: dbClients, loading: clientsLoading, addClient: createClientHook, updateClient: updateClientHook, deleteClient: deleteClientHook } = useClients();
  const { favoriteIds, toggleFavorite: supabaseToggleFavorite, loading: favoritesLoading, refresh: refreshFavorites } = useFavorites();
  const { templates: dbTemplates, loading: templatesLoading, createTemplate, refresh: refreshTemplates, addTemplateItem } = useTemplates();

  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  const { positions: allBelPositions } = useAllPositions(kzvId, labType);
  const { downloadPDF, openPDFInNewTab } = usePDFGenerator();

  // === SEARCH LOGIC ===
  const { results, isLoading: searchLoading, hasMore, search, loadMore } = useSearch({
    kzvId,
    laborType: labType,
    groupId: activeGroupId,
    limit: 20,
  });

  useEffect(() => { 
    search(searchQuery); 
  }, [searchQuery, search]);

  // === ID MAPPING (Crucial for Favorites & Templates) ===
  const codeToIdMap = useMemo(() => {
    const map: Record<string, number> = {};
    // 1. Aus allen Positionen (wenn geladen)
    allBelPositions.forEach(p => { if (p.db_id) map[p.id] = p.db_id; });
    // 2. Aus Suchergebnissen (als Fallback/Ergänzung)
    results.forEach(r => { if (r.position_code && r.id) map[r.position_code] = r.id; });
    return map;
  }, [allBelPositions, results]);

  const idToCodeMap = useMemo(() => {
    const map: Record<number, string> = {};
    allBelPositions.forEach(p => { if (p.db_id) map[p.db_id] = p.id; });
    results.forEach(r => { if (r.position_code && r.id) map[r.id] = r.position_code; });
    return map;
  }, [allBelPositions, results]);

  // === INITIAL SYNC FROM DATABASE ===
  useEffect(() => {
    if (dbSettings && !isProfileInitialized.current) {
      setLabType(dbSettings.labor_type as LabType || 'gewerbe');
      setGlobalPriceFactor(dbSettings.global_factor || 1.0);
      setLocalUserSettings({
        name: dbSettings.user_id || '',
        labName: dbSettings.lab_name || '',
        labEmail: (dbSettings as any).lab_email || '',
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

  // KZV Sync
  useEffect(() => {
    async function syncKzv() {
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
    if (!settingsLoading) syncKzv();
  }, [dbSettings, settingsLoading, selectedRegion]);

  useEffect(() => {
    setCustomPositions([]);
    setCustomPositionsLoaded(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user || customPositionsLoaded) return;
    const loadCustomPositions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('custom_positions')
        .select('position_code, name, default_price, vat_rate')
        .order('position_code') as {
          data: Array<{
            position_code: string;
            name: string;
            default_price: number | null;
            vat_rate: number | null;
          }> | null;
          error: unknown;
        };

      if (!error && data) {
        setCustomPositions(data.map(p => ({
          id: p.position_code,
          name: p.name,
          price: Number(p.default_price ?? 0),
          vat_rate: Number(p.vat_rate ?? 19),
        })));
      }

      setCustomPositionsLoaded(true);
    };

    loadCustomPositions();
  }, [user, customPositionsLoaded]);

  const saveCustomPositions = async () => {
    if (!user) return;
    const supabase = createClient();

    const { data: existing, error: existingError } = await supabase
      .from('custom_positions')
      .select('id, position_code') as {
        data: Array<{ id: string; position_code: string }> | null;
        error: unknown;
      };

    if (existingError) throw existingError;

    const currentCodes = new Set(customPositions.map(p => p.id));
    const toDelete = (existing || [])
      .filter(p => !currentCodes.has(p.position_code))
      .map(p => p.id);

    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('custom_positions')
        .delete()
        .in('id', toDelete);
      if (deleteError) throw deleteError;
    }

    const upsertRows = customPositions
      .map(p => ({
        user_id: user.id,
        position_code: p.id.trim(),
        name: p.name.trim(),
        default_price: p.price,
        vat_rate: p.vat_rate ?? 19,
      }))
      .filter(p => p.position_code && p.name);

    if (upsertRows.length > 0) {
      const { error: upsertError } = await supabase
        .from('custom_positions')
        .upsert(upsertRows, { onConflict: 'user_id,position_code' });
      if (upsertError) throw upsertError;
    }
  };

  // === HANDLERS ===
  const handleToggleFavorite = async (posCode: string) => {
    console.log('Toggle Favorite for:', posCode);
    // Zuerst in allBelPositions suchen (vollständige Liste)
    let numericId = allBelPositions.find(p => p.position_code === posCode)?.db_id;
    
    // Falls nicht gefunden, in results suchen
    if (!numericId) {
      numericId = (results.find(r => r.position_code === posCode) as any)?.id;
    }

    if (numericId) {
      try {
        await supabaseToggleFavorite(numericId);
        await refreshFavorites();
        console.log('Favorite toggled successfully');
      } catch (err) {
        console.error('Error toggling favorite:', err);
      }
    } else {
      console.warn('Favorit-ID konnte nicht gemappt werden für:', posCode);
      // Fallback: Wenn es eine Custom Position ist, wird sie aktuell nicht als Favorit unterstützt
      // oder wir müssen die Logik dafür noch implementieren.
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

  const handleToggleSelection = (id: string) => {
    setSelectedForTemplate(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleUpdateTemplates = async (updatedTemplates: any[]) => {
    // Diese Funktion wird von TemplatesView aufgerufen
    // Wir müssen entscheiden, ob wir ein Template erstellen, löschen oder aktualisieren
    
    // Einfachheitshalber: Wenn die Anzahl der Templates gleich bleibt, vergleichen wir IDs
    if (updatedTemplates.length === dbTemplates.length) {
      for (const ut of updatedTemplates) {
        const dbT = dbTemplates.find(t => t.id === ut.db_id);
        if (dbT && (dbT.name !== ut.name || dbT.items.length !== ut.items.length)) {
          // Hier müsste detaillierte Update-Logik hin (updateTemplate)
          // Für den Moment fokussieren wir uns auf die Konsistenz
        }
      }
    }
    
    await refreshTemplates();
  };

  const handleCreateTemplate = async (name: string, items: { id: string; quantity: number; factor: number }[]) => {
    const newTemp = await createTemplate({ name, icon: 'Layout', color: 'brand' });
    if (newTemp) {
      for (const item of items) {
        const posId = codeToIdMap[item.id];
        await addTemplateItem(newTemp.id, {
          position_id: isNaN(parseInt(item.id)) ? null : posId || null,
          custom_position_id: isNaN(parseInt(item.id)) ? item.id : null,
          quantity: item.quantity,
          factor: item.factor
        });
      }
      await refreshTemplates();
      setSelectedForTemplate([]);
      setActiveTab('templates');
    }
  };

  // === DISPLAY FILTERING ===
  const uiFavorites = useMemo(() => 
    Array.from(favoriteIds).map(id => idToCodeMap[id]).filter((code): code is string => !!code),
  [favoriteIds, idToCodeMap]);

  const mappedResults = useMemo(() => results.map(r => ({
    id: r.position_code,
    position_code: r.position_code,
    name: r.name,
    price: r.price || 0,
    group: r.group_name || 'all',
    groupId: r.group_id ?? null,
  })), [results]);

  const positionsForDisplay = useMemo(() => {
    if (activeTab === 'favorites') {
      // Im Favoriten-Tab nutzen wir alle Positionen als Basis f??r Vollst??ndigkeit
      return allBelPositions.filter(p => uiFavorites.includes(p.id));
    }

    // Suchergebnisse (Backend gefiltert + UI Fallback)
    const filteredResults = showCustomOnly
      ? []
      : activeGroupId
        ? mappedResults.filter(r => r.groupId === activeGroupId)
        : mappedResults;

    // Custom Positions (lokal gefiltert)
    const cust = customPositions
      .filter(p => {
        const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
        const matchesGroup = showCustomOnly || showAllGroups;
        return matchesSearch && matchesGroup;
      })
      .map(p => ({ ...p, group: 'Eigenposition' }));

    // Merge and sort
    const merged = [...filteredResults, ...cust];
    return merged.sort((a, b) => {
      const codeA = 'position_code' in a ? a.position_code : a.id;
      const codeB = 'position_code' in b ? b.position_code : b.id;
      return (codeA || '').localeCompare(codeB || '', undefined, { numeric: true });
    });
  }, [activeTab, allBelPositions, customPositions, searchQuery, uiFavorites, mappedResults, activeGroupId, showCustomOnly, showAllGroups]);

  const selectedPositionsForTemplate = useMemo(() => {
    const lookup = new Map<string, BELPosition | CustomPosition>();
    allBelPositions.forEach(p => lookup.set(p.id, p));
    customPositions.forEach(p => lookup.set(p.id, p));
    mappedResults.forEach(p => lookup.set(p.id, p));
    return selectedForTemplate.map(id => lookup.get(id)).filter((p): p is BELPosition | CustomPosition => Boolean(p));
  }, [allBelPositions, customPositions, mappedResults, selectedForTemplate]);

  const formattedTemplates = useMemo(() => dbTemplates.map(t => ({
    id: parseInt(t.id) || Date.now(), db_id: t.id, name: t.name, factor: t.items[0]?.factor || 1.0,
    items: t.items.map(i => ({ id: i.position_id ? idToCodeMap[i.position_id] : i.custom_position_id, quantity: i.quantity })).filter(i => i.id)
  })), [dbTemplates, idToCodeMap]);

  // === MODAL & ONBOARDING ===
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
      selectedGroup={activeGroup} onGroupChange={g => setSelectedGroups(g === 'all' ? [] : [g])}
      isDark={theme === 'dark'} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      regions={REGIONS} userName={localUserSettings.labName || 'Benutzer'}
    >
      {(activeTab === 'search' || activeTab === 'favorites') && (
        <SearchView
          positions={positionsForDisplay} favorites={uiFavorites}
          onToggleFavorite={handleToggleFavorite} selectedForTemplate={selectedForTemplate}
          onToggleSelection={handleToggleSelection}
          onClearSelection={() => setSelectedForTemplate([])} onCreateTemplate={() => setIsTemplateCreationModalOpen(true)}
          searchQuery={searchQuery} onSearchChange={setSearchQuery} globalPriceFactor={globalPriceFactor} labType={labType}
          isFavoritesView={activeTab === 'favorites'} isLoading={searchLoading || (activeTab === 'favorites' && favoritesLoading)} 
          hasMore={activeTab === 'search' && hasMore} onLoadMore={loadMore}
          is2026Data={!['Berlin', 'Brandenburg', 'Bremen', 'Hessen', 'Saarland'].includes(selectedRegion)}
        />
      )}

      {activeTab === 'templates' && (
        <TemplatesView
          templates={formattedTemplates as any} 
          onUpdateTemplates={handleUpdateTemplates}
          onCreateInvoice={(temp: any) => { 
            setPendingItems(temp.items); 
            setIsInvoiceModalOpen(true); 
          }} 
          positions={allBelPositions as any}
          getPositionPrice={id => {
            const pos = [...allBelPositions, ...customPositions].find(p => p.id === id);
            return pos?.price || 0;
          }}
          getPositionName={id => {
            const pos = [...allBelPositions, ...customPositions].find(p => p.id === id);
            return pos?.name || id;
          }}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView 
          clients={dbClients.map(c => ({ id: c.id, customerNumber: c.customer_number || '', salutation: c.salutation || '', title: c.title || '', firstName: c.first_name || '', lastName: c.last_name, practiceName: c.practice_name || '', street: c.street || '', zip: c.postal_code || '', city: c.city || '', email: c.email || '' }))}
          onUpdateClients={async (newClients) => {
            if (newClients.length > dbClients.length) {
              const added = newClients.find(nc => !dbClients.some(dc => dc.id === nc.id));
              if (added) await createClientHook({ customer_number: added.customerNumber, salutation: added.salutation, title: added.title, first_name: added.firstName, last_name: added.lastName, practice_name: added.practiceName, street: added.street, postal_code: added.zip, city: added.city, country: 'Deutschland', email: added.email });
            } else if (newClients.length < dbClients.length) {
              const delId = dbClients.find(dc => !newClients.some(nc => nc.id === dc.id))?.id;
              if (delId) await deleteClientHook(delId);
            } else {
              // Update logic
              const updated = newClients.find(nc => {
                const dc = dbClients.find(d => d.id === nc.id);
                return dc && (dc.email !== nc.email || dc.last_name !== nc.lastName); // simple check
              });
              if (updated) await updateClientHook(updated.id, { customer_number: updated.customerNumber, salutation: updated.salutation, title: updated.title, first_name: updated.firstName, last_name: updated.lastName, practice_name: updated.practiceName, street: updated.street, postal_code: updated.zip, city: updated.city, email: updated.email });
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
          isDark={theme === 'dark'} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
          onRestartOnboarding={() => setShowOnboarding(true)}
          onSaveProfile={async () => {
            try {
              await updateSettings({
                lab_name: localUserSettings.labName, 
                lab_street: localUserSettings.street, 
                lab_postal_code: localUserSettings.zip,
                lab_city: localUserSettings.city, 
                tax_id: localUserSettings.taxId, 
                jurisdiction: localUserSettings.jurisdiction,
                bank_name: localUserSettings.bankName, 
                iban: localUserSettings.iban, 
                bic: localUserSettings.bic,
                logo_url: localUserSettings.logoUrl, 
                next_invoice_number: parseInt(localUserSettings.nextInvoiceNumber.split('-')[1]) || 1001,
                // lab_email: localUserSettings.labEmail // if it existed
              } as any);
              await saveCustomPositions();
              // Show visual feedback
              const toast = document.createElement('div');
              toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-fade-in-up';
              toast.innerText = '✓ Einstellungen erfolgreich gespeichert';
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 3000);
            } catch (err) {
              alert('Fehler beim Speichern');
              throw err;
            }
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
        selectedPositions={selectedPositionsForTemplate} 
        onSave={handleCreateTemplate} 
      />
      <OnboardingTour isOpen={showOnboarding} onComplete={() => { setShowOnboarding(false); localStorage.setItem('labrechner-onboarding-done', 'true'); }} onStepChange={step => { if (['search', 'favorites', 'templates', 'clients', 'settings'].includes(step)) setActiveTab(step as TabType); }} />
    </DashboardLayout>
  );
}
