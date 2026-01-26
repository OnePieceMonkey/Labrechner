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
import { useCustomPositions } from '@/hooks/useCustomPositions';
import { useTemplates } from '@/hooks/useTemplates';
import { useUser } from '@/hooks/useUser';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import type {
  TabType,
  LabType,
  Template,
  UserSettings as ERPUserSettings,
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

const extractNumericKey = (code?: string) => {
  if (!code) return Number.NaN;
  const digits = code.match(/\d+/g)?.join('') ?? '';
  return digits ? parseInt(digits, 10) : Number.NaN;
};

const comparePositionCodes = (a?: string, b?: string) => {
  const aNum = extractNumericKey(a);
  const bNum = extractNumericKey(b);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }
  if (!Number.isNaN(aNum) && Number.isNaN(bNum)) return -1;
  if (Number.isNaN(aNum) && !Number.isNaN(bNum)) return 1;
  return (a || '').localeCompare(b || '', undefined, { numeric: true });
};

export default function NewDashboardPage() {
  const { settings: dbSettings, isLoading: settingsLoading, updateSettings } = useUser();
  const { theme, setTheme } = useTheme();
  const isProfileInitialized = useRef(false);
  const isKzvInitialized = useRef(false);
  
  // === UI STATES ===
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [preferredTheme, setPreferredTheme] = useState<'light' | 'dark'>('light');
  const [tempTheme, setTempTheme] = useState<'light' | 'dark' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalPriceFactor, setGlobalPriceFactor] = useState(1.0);

  // === FILTER STATES ===
  const [selectedRegion, setSelectedRegion] = useState('Bayern');
  const [labType, setLabType] = useState<LabType>('gewerbe');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // Array für Multi-Select Vorbereitung

  // === DATA STATES ===
  const [localUserSettings, setLocalUserSettings] = useState<ERPUserSettings>(DEFAULT_USER_SETTINGS);
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);
  const [highlightInvoiceId, setHighlightInvoiceId] = useState<string | null>(null);
  const highlightTimer = useRef<number | null>(null);

  // === HOOKS ===
  const { invoices, createInvoice, updateInvoice, deleteInvoice, addInvoiceItem, setInvoiceStatus, loading: invoicesLoading } = useInvoices();
  const { clients: dbClients, loading: clientsLoading, addClient: createClientHook, updateClient: updateClientHook, deleteClient: deleteClientHook } = useClients();
  const { favoriteIds, toggleFavorite: supabaseToggleFavorite, loading: favoritesLoading, refresh: refreshFavorites } = useFavorites();
  const {
    positions: customPositions,
    createPosition: createCustomPosition,
    updatePosition: updateCustomPosition,
    deletePosition: deleteCustomPosition,
  } = useCustomPositions();
  const {
    templates: dbTemplates,
    loading: templatesLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addTemplateItem,
    updateTemplateItem,
    deleteTemplateItem,
    refresh: refreshTemplates,
  } = useTemplates();

  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  const { positions: allBelPositions } = useAllPositions(kzvId, labType);
  const { downloadPDF, openPDFInNewTab } = usePDFGenerator();

  const activeGroup = selectedGroups[0] || 'all';
  const activeGroupId = activeGroup !== 'all' && activeGroup !== 'custom' ? parseInt(activeGroup, 10) : null;
  const effectiveTheme = tempTheme ?? preferredTheme;
  const isDarkEffective = effectiveTheme === 'dark';
  const isDarkPersistent = preferredTheme === 'dark';

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

  useEffect(() => {
    if (dbSettings?.theme_preference) {
      setPreferredTheme(dbSettings.theme_preference);
    }
  }, [dbSettings?.theme_preference]);

  useEffect(() => {
    if (effectiveTheme && theme !== effectiveTheme) {
      setTheme(effectiveTheme);
    }
  }, [effectiveTheme, theme, setTheme]);

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

  const customCodeToIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    customPositions.forEach(p => { if (p.db_id) map[p.id] = p.db_id; });
    return map;
  }, [customPositions]);

  const customIdToCodeMap = useMemo(() => {
    const map: Record<string, string> = {};
    customPositions.forEach(p => { if (p.db_id) map[p.db_id] = p.id; });
    return map;
  }, [customPositions]);

  const customPositionCodes = useMemo(() => new Set(customPositions.map(p => p.id)), [customPositions]);

  // === INITIAL SYNC FROM DATABASE ===
  useEffect(() => {
    if (dbSettings && !isProfileInitialized.current) {
      setLabType(dbSettings.labor_type as LabType || 'gewerbe');
      setGlobalPriceFactor(dbSettings.global_factor || 1.0);
      setLocalUserSettings({
        name: dbSettings.lab_contact_name || '',
        labName: dbSettings.lab_name || '',
        labEmail: dbSettings.lab_email || '',
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
    if (!settingsLoading && dbSettings) syncKzv();
  }, [dbSettings, settingsLoading, selectedRegion]);

  // === HANDLERS ===
  const handleToggleTempTheme = () => {
    const current = tempTheme ?? preferredTheme;
    const next = current === 'dark' ? 'light' : 'dark';
    setTempTheme(next === preferredTheme ? null : next);
  };

  const handleTogglePersistentTheme = async () => {
    const next = preferredTheme === 'dark' ? 'light' : 'dark';
    setPreferredTheme(next);
    setTempTheme(null);
    try {
      await updateSettings({ theme_preference: next });
    } catch (err) {
      console.error('Fehler beim Speichern des Themes:', err);
    }
  };

  const handleToggleFavorite = async (posCode: string) => {
    console.log('Toggle Favorite for:', posCode);
    let numericId = codeToIdMap[posCode];

    if (!numericId) {
      const supabase = createClient();
      const { data, error }: { data: { id: number } | null; error: { code?: string } | null } = await supabase
        .from('bel_positions')
        .select('id')
        .eq('position_code', posCode)
        .single();
      if (error) {
        console.warn('Fehler beim Mapping der Favoriten-ID:', error);
      }
      if (data?.id) numericId = data.id;
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

  const toTemplateItemInsert = (item: { id: string; quantity: number; factor?: number }) => {
    const isCustom = customPositionCodes.has(item.id) || isNaN(parseInt(item.id, 10));
    const posId = isCustom ? null : codeToIdMap[item.id];
    const customId = isCustom ? customCodeToIdMap[item.id] : null;
    if (isCustom && !customId) {
      console.warn('Custom-Position nicht gefunden:', item.id);
      return null;
    }
    if (!isCustom && !posId) {
      console.warn('BEL-Position nicht gefunden:', item.id);
      return null;
    }
    return {
      position_id: posId || null,
      custom_position_id: customId || null,
      quantity: item.quantity,
      factor: item.factor ?? 1.0,
    };
  };

  const handleUpdateTemplates = async (updatedTemplates: Template[]) => {
    try {
      const previousTemplates = formattedTemplates;
      const prevByDbId = new Map(previousTemplates.filter(t => t.db_id).map(t => [t.db_id as string, t]));
      const nextByDbId = new Map(updatedTemplates.filter(t => t.db_id).map(t => [t.db_id as string, t]));

      for (const [dbId] of prevByDbId) {
        if (!nextByDbId.has(dbId)) {
          await deleteTemplate(dbId);
        }
      }

      const newTemplates = updatedTemplates.filter(t => !t.db_id);
      for (const newTemplate of newTemplates) {
        const created = await createTemplate({ name: newTemplate.name, icon: 'Layout', color: 'brand' });
        if (!created) continue;
        for (const item of newTemplate.items) {
          const insert = toTemplateItemInsert(item);
          if (insert) await addTemplateItem(created.id, insert);
        }
      }

      for (const [dbId, updatedTemplate] of nextByDbId) {
        const prev = prevByDbId.get(dbId);
        if (!prev) continue;

        if (prev.name !== updatedTemplate.name) {
          await updateTemplate(dbId, { name: updatedTemplate.name });
        }

        const prevItemsByDbId = new Map(
          prev.items
            .filter((i): i is TemplateItem => !!i && !!i.db_id)
            .map(i => [i.db_id as string, i])
        );
        const nextItemsByDbId = new Map(
          updatedTemplate.items
            .filter((i): i is TemplateItem => !!i && !!i.db_id)
            .map(i => [i.db_id as string, i])
        );

        for (const [itemDbId] of prevItemsByDbId) {
          if (!nextItemsByDbId.has(itemDbId)) {
            await deleteTemplateItem(itemDbId);
          }
        }

        for (const [itemDbId, nextItem] of nextItemsByDbId) {
          const prevItem = prevItemsByDbId.get(itemDbId);
          if (!prevItem) continue;
          const prevFactor = prevItem.factor ?? 1.0;
          const nextFactor = nextItem.factor ?? 1.0;
          if (prevItem.quantity !== nextItem.quantity || prevFactor !== nextFactor) {
            await updateTemplateItem(itemDbId, { quantity: nextItem.quantity, factor: nextFactor });
          }
        }

        const addedItems = updatedTemplate.items.filter(i => !i.db_id);
        for (const item of addedItems) {
          const insert = toTemplateItemInsert(item);
          if (insert) await addTemplateItem(dbId, insert);
        }
      }

      await refreshTemplates();
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Vorlagen:', err);
    }
  };

  const handleCreateTemplate = async (name: string, items: { id: string; quantity: number; factor: number }[]) => {
    const newTemp = await createTemplate({ name, icon: 'Layout', color: 'brand' });
    if (newTemp) {
      for (const item of items) {
        const insert = toTemplateItemInsert(item);
        if (insert) await addTemplateItem(newTemp.id, insert);
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

  const positionsForDisplay = useMemo(() => {
    if (activeTab === 'favorites') {
      // Im Favoriten-Tab nutzen wir alle Positionen als Basis für Vollständigkeit
      return allBelPositions.filter(p => uiFavorites.includes(p.id));
    }
    
    // Suchergebnisse (Backend gefiltert)
    const filteredResults = activeGroupId ? results.filter(r => r.group_id === activeGroupId) : results;
    const isCustomOnly = selectedGroups.includes('custom');
    const mapped = isCustomOnly
      ? []
      : filteredResults.map(r => ({
          id: r.position_code,
          db_id: r.id,
          position_code: r.position_code,
          name: r.name,
          price: r.price || 0,
          group: r.group_name || 'all'
        }));

    // Custom Positions (lokal gefiltert)
    const cust = customPositions
      .filter(p => {
        const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
        const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes('custom') || selectedGroups.includes('all');
        return matchesSearch && matchesGroup;
      })
      .map(p => ({ ...p, group: 'Eigenposition' }));

    // Merge and sort
    const merged = [...mapped, ...cust];
    return merged.sort((a, b) => {
      const codeA = 'position_code' in a ? a.position_code : a.id;
      const codeB = 'position_code' in b ? b.position_code : b.id;
      return comparePositionCodes(codeA, codeB);
    });
  }, [activeTab, results, allBelPositions, customPositions, searchQuery, uiFavorites, selectedGroups, activeGroupId]);

  const formattedTemplates = useMemo(() => dbTemplates.map(t => {
    const defaultFactor = t.items[0]?.factor ?? 1.0;
    return {
      id: t.id,
      db_id: t.id,
      name: t.name,
      factor: defaultFactor,
      items: t.items.map(i => {
        const code = i.position_id
          ? idToCodeMap[i.position_id]
          : (i.custom_position_id ? (customIdToCodeMap[i.custom_position_id] || i.custom_position_id) : undefined);
        if (!code) return null;
        return {
          id: code,
          db_id: i.id,
          isAi: false,
          quantity: i.quantity,
          factor: i.factor ?? defaultFactor,
        };
      }).filter((i): i is TemplateItem => !!i),
    };
  }), [dbTemplates, idToCodeMap, customIdToCodeMap]);

  // === MODAL & ONBOARDING ===
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTemplateCreationModalOpen, setIsTemplateCreationModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);
  const [pendingItems, setPendingItems] = useState<{ id: string; quantity: number; factor?: number }[] | null>(null);
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
      isDark={isDarkEffective} toggleTheme={handleToggleTempTheme}
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
            setPendingItems(temp.items.map((item: TemplateItem) => ({ id: item.id, quantity: item.quantity, factor: item.factor }))); 
            setIsInvoiceModalOpen(true); 
          }} 
          positions={[...allBelPositions, ...customPositions] as any}
          customPositionCodes={customPositionCodes}
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
          highlightInvoiceId={highlightInvoiceId}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          userSettings={localUserSettings} onUpdateSettings={setLocalUserSettings}
          customPositions={customPositions}
          onCreateCustomPosition={createCustomPosition}
          onUpdateCustomPosition={updateCustomPosition}
          onDeleteCustomPosition={deleteCustomPosition}
          selectedRegion={selectedRegion} onRegionChange={handleRegionChange} regions={REGIONS}
          globalPriceFactor={globalPriceFactor} 
          onGlobalPriceFactorChange={async (f) => { setGlobalPriceFactor(f); await updateSettings({ global_factor: f }); }}
          isDark={isDarkPersistent} toggleTheme={handleTogglePersistentTheme} 
          onRestartOnboarding={() => setShowOnboarding(true)}
          onSaveProfile={async () => {
            try {
              await updateSettings({
                lab_name: localUserSettings.labName,
                lab_contact_name: localUserSettings.name,
                lab_email: localUserSettings.labEmail || null,
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
              } as any);
              // Show visual feedback
              const toast = document.createElement('div');
              toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-fade-in-up';
              toast.innerText = '✓ Einstellungen erfolgreich gespeichert';
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 3000);
            } catch (err) {
              alert('Fehler beim Speichern');
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
                const isCustom = customPositionCodes.has(item.id) || isNaN(parseInt(item.id, 10));
                const vat = isCustom ? (pos as any).vat_rate || 19 : 7;
                const customPosId = isCustom ? (pos as any).db_id || customCodeToIdMap[item.id] : null;
                const belPosId = isCustom ? null : (pos as any).db_id;
                await addInvoiceItem(newInv.id, {
                  position_id: belPosId,
                  custom_position_id: customPosId,
                  position_code: (pos as any).position_code || item.id,
                  position_name: pos.name,
                  quantity: item.quantity,
                  factor: item.factor ?? 1.0,
                  unit_price: pos.price,
                  line_total: pos.price * item.quantity * (item.factor ?? 1.0),
                  vat_rate: vat
                });
              }
            }
            setPendingItems(null);
            setActiveTab('invoices');
          }
          if (newInv) {
            setHighlightInvoiceId(newInv.id);
            if (highlightTimer.current) {
              window.clearTimeout(highlightTimer.current);
            }
            highlightTimer.current = window.setTimeout(() => setHighlightInvoiceId(null), 8000);
          }
        }} 
        clients={dbClients as any} initialData={editingInvoice} 
      />
      <TemplateCreationModal 
        isOpen={isTemplateCreationModalOpen} onClose={() => setIsTemplateCreationModalOpen(false)} 
        selectedPositions={positionsForDisplay.filter(p => selectedForTemplate.includes(p.id))} 
        onSave={handleCreateTemplate} 
      />
      <OnboardingTour isOpen={showOnboarding} onComplete={() => { setShowOnboarding(false); localStorage.setItem('labrechner-onboarding-done', 'true'); }} onStepChange={step => { if (['search', 'favorites', 'templates', 'clients', 'settings'].includes(step)) setActiveTab(step as TabType); }} />
    </DashboardLayout>
  );
}
