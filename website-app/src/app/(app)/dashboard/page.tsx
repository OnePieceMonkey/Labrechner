'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DashboardLayout,
  SearchView,
  TemplatesView,
  ClientsView,
  SettingsView,
  InvoicesView,
  InvoiceModal,
  TemplateCreationModal,
} from '@/components/dashboard';
import { useSearch } from '@/hooks/useSearch';
import { useInvoices, type InvoiceWithItems } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useAllPositions } from '@/hooks/useAllPositions';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { useFavorites } from '@/hooks/useFavorites';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import type {
  TabType,
  LabType,
  Template,
  Recipient,
  UserSettings,
  CustomPosition,
  BELPosition,
  TemplateItem,
} from '@/types/erp';
import { DEFAULT_USER_SETTINGS } from '@/types/erp';

// KZV Regionen
const REGIONS = [
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Niedersachsen',
  'Nordrhein',
  'Mecklenburg-Vorpommern',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
  'Westfalen-Lippe',
];

// KZV Code Mapping
const REGION_TO_KZV: Record<string, string> = {
  Bayern: 'KZVB',
  Berlin: 'KZV_Berlin',
  Brandenburg: 'KZV_Brandenburg',
  Bremen: 'KZV_Bremen',
  Hamburg: 'KZV_Hamburg',
  Hessen: 'KZV_Hessen',
  Niedersachsen: 'KZV_Niedersachsen',
  Nordrhein: 'KZV_Nordrhein',
  'Mecklenburg-Vorpommern': 'KZV_MV',
  'Rheinland-Pfalz': 'KZV_RLP',
  Saarland: 'KZV_Saarland',
  Sachsen: 'KZV_Sachsen',
  'Sachsen-Anhalt': 'KZV_Sachsen_Anhalt',
  'Schleswig-Holstein': 'KZV_SH',
  Thüringen: 'KZV_Thueringen',
  'Westfalen-Lippe': 'KZV_WL',
};

export default function NewDashboardPage() {
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalPriceFactor, setGlobalPriceFactor] = useState(1.0);

  // Filter State
  const [selectedRegion, setSelectedRegion] = useState('Bayern');
  const [labType, setLabType] = useState<LabType>('gewerbe');
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Data State
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [customPositions, setCustomPositions] = useState<CustomPosition[]>([]);

  // Hooks
  const { 
    invoices, 
    createInvoice, 
    updateInvoice, 
    deleteInvoice, 
    addInvoiceItem,
    setInvoiceStatus, 
    loading: invoicesLoading 
  } = useInvoices();
  
  const { 
    clients: dbClients, 
    loading: clientsLoading,
    addClient: createClientHook,
    updateClient: updateClientHook,
    deleteClient: deleteClientHook
  } = useClients();

  const {
    favoriteIds,
    toggleFavorite: supabaseToggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();

  // KZV ID für Supabase
  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  
  const { positions: allBelPositions, loading: allPosLoading } = useAllPositions(kzvId, labType);

  const { downloadPDF, openPDFInNewTab } = usePDFGenerator();
  const { settings: dbSettings, isLoading: settingsLoading } = useUser();

  // Sync settings with state
  useEffect(() => {
    if (dbSettings) {
      // Find region name from kzv_id if possible, or use default
      // Note: We need a mapping from ID back to Name or wait for loadKzvIds to finish
      // For now, let's at least set the labType and globalPriceFactor
      setLabType(dbSettings.labor_type as LabType);
      setGlobalPriceFactor(dbSettings.global_factor || 1.0);
      
      if (dbSettings.kzv_id) {
        setKzvId(dbSettings.kzv_id);
        // We will update selectedRegion name once we have the mapping
      }
    }
  }, [dbSettings]);

  // Supabase Search with Infinite Scroll
  const { results, isLoading, hasMore, search, loadMore } = useSearch({
    kzvId,
    laborType: labType,
    groupId: selectedGroup !== 'all' ? parseInt(selectedGroup.split('-')[0]) : null,
    limit: 20,
  });

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTemplateCreationModalOpen, setIsTemplateCreationModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);
  const [pendingItems, setPendingItems] = useState<{ id: string; quantity: number }[] | null>(null);

  // Map database clients to Recipient format
  const formattedClients: Recipient[] = dbClients.map(c => ({
    id: c.id,
    customerNumber: c.customer_number || '',
    salutation: c.salutation || '',
    title: c.title || '',
    firstName: c.first_name || '',
    lastName: c.last_name,
    practiceName: c.practice_name || '',
    street: c.street || '',
    zip: c.postal_code || '',
    city: c.city || ''
  }));

  const handleSaveInvoice = async (data: {
    client_id: string;
    invoice_date: string;
    patient_name: string;
  }) => {
    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, data);
    } else {
      const client = dbClients.find(c => c.id === data.client_id);
      const newInvoice = await createInvoice(
        {
          client_id: data.client_id,
          invoice_date: data.invoice_date,
          patient_name: data.patient_name,
          status: 'draft',
          subtotal: 0,
          tax_rate: 19, // Default
          tax_amount: 0,
          total: 0,
        },
        client,
        dbSettings
      );

      // Add pending items if any
      if (newInvoice && pendingItems) {
        for (const item of pendingItems) {
          const pos = [...allBelPositions, ...customPositions].find(p => p.id === item.id);
          if (pos) {
            const isCustom = isNaN(parseInt(pos.id));
            const vatRate = isCustom 
              ? (pos as CustomPosition).vat_rate || 19 
              : 7; // BEL is usually 7%

            await addInvoiceItem(newInvoice.id, {
              position_id: isCustom ? null : parseInt(pos.id),
              custom_position_id: isCustom ? pos.id : null,
              position_code: 'position_code' in pos ? pos.position_code! : pos.id,
              position_name: pos.name,
              quantity: item.quantity,
              factor: 1.0, // Default factor
              unit_price: pos.price,
              line_total: pos.price * item.quantity,
              vat_rate: vatRate,
            });
          }
        }
        setPendingItems(null);
        setActiveTab('invoices');
      }
    }
  };

  const handleCreateTemplateFromSelection = () => {
    if (selectedForTemplate.length === 0) return;
    setIsTemplateCreationModalOpen(true);
  };

  const handleSaveTemplateFromModal = (name: string, items: { id: string; quantity: number; factor: number }[]) => {
    const newTemplate: Template = {
      id: Date.now(),
      name: name,
      items: items.map(item => ({
        id: item.id,
        isAi: false,
        quantity: item.quantity
      })),
      factor: items[0]?.factor || 1.0
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setSelectedForTemplate([]);
    setActiveTab('templates');
  };

  const handleCreateInvoiceFromTemplate = (template: Template) => {
    setPendingItems(template.items.map(i => ({ id: i.id, quantity: i.quantity })));
    setEditingInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const favoritesArray = Array.from(favoriteIds).map(fid => {
    // Find position_code for this numeric ID
    const pos = allBelPositions.find(p => {
      // allBelPositions IDs are position_codes currently based on hook read
      // We need to be careful here. Let's look at allBelPositions again.
      // Actually, allBelPositions from useAllPositions has id as position_code.
      return false; // Wait, I need a better way to map numeric ID to code
    });
    return fid.toString(); 
  });

  // Re-evaluating: The hook useFavorites returns numeric IDs.
  // The search results 'results' have both numeric 'id' and 'position_code'.
  // We should probably keep using numeric IDs for favorites in BEL but ensure UI consistency.

  // Let's create a mapping of position_code -> numeric_id from results
  const [codeToIdMap, setCodeToIdMap] = useState<Record<string, number>>({});
  const [idToCodeMap, setIdToCodeMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (results.length > 0) {
      const newCodeToId = { ...codeToIdMap };
      const newIdToCode = { ...idToCodeMap };
      results.forEach(r => {
        newCodeToId[r.position_code] = r.id;
        newIdToCode[r.id] = r.position_code;
      });
      setCodeToIdMap(newCodeToId);
      setIdToCodeMap(newIdToCode);
    }
  }, [results]);

  const uiFavorites = Array.from(favoriteIds).map(id => idToCodeMap[id] || id.toString());

  const toggleFavorite = (id: string) => {
    // id here is position_code for BEL
    const numericId = codeToIdMap[id] || parseInt(id);
    if (!isNaN(numericId)) {
      supabaseToggleFavorite(numericId);
    } else {
      console.warn('Favoriten für Eigenpositionen werden aktuell noch nicht unterstützt.');
    }
  };

  // Load KZV IDs and sync with settings
  useEffect(() => {
    async function loadKzvIds() {
      const supabase = createClient();
      const { data } = await supabase
        .from('kzv_regions')
        .select('id, code, name') as { data: { id: number; code: string; name: string }[] | null };

      if (data) {
        const mapping: Record<string, number> = {};
        const idToName: Record<number, string> = {};
        
        data.forEach((kzv) => {
          mapping[kzv.code] = kzv.id;
          idToName[kzv.id] = kzv.name;
        });

        // If we have settings, use the kzv_id from settings to set the region name
        if (dbSettings?.kzv_id && idToName[dbSettings.kzv_id]) {
          setSelectedRegion(idToName[dbSettings.kzv_id]);
          setKzvId(dbSettings.kzv_id);
        } else {
          // Fallback to currently selected region name
          const kzvCode = REGION_TO_KZV[selectedRegion];
          if (kzvCode && mapping[kzvCode]) {
            setKzvId(mapping[kzvCode]);
          }
        }
      }
    }
    loadKzvIds();
  }, [selectedRegion, dbSettings?.kzv_id]);

  // Trigger search
  useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  // Load persisted data
  useEffect(() => {
    const savedSettings = localStorage.getItem('labrechner-settings');
    if (savedSettings) {
      try {
        setUserSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }

    const savedCustomPos = localStorage.getItem('labrechner-custom-pos');
    if (savedCustomPos) {
      try {
        setCustomPositions(JSON.parse(savedCustomPos));
      } catch (e) {}
    }

    const savedDark = localStorage.getItem('labrechner-dark');
    if (savedDark === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('labrechner-settings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem('labrechner-custom-pos', JSON.stringify(customPositions));
  }, [customPositions]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem('labrechner-dark', newValue.toString());
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  // Convert search results to BELPosition format
  const positions: BELPosition[] = results.map((r) => ({
    id: r.position_code, // Use position_code as unique ID for consistency
    position_code: r.position_code,
    name: r.name,
    price: r.price || 0,
    group: r.group_name || 'all',
  }));

  // Add custom positions - filtered by search query
  const filteredCustomPositions = customPositions.filter(cp => 
    !searchQuery || 
    cp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cp.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).map((c) => ({ ...c, group: 'Eigenpositionen' }));

  const allPositionsForSearch = [
    ...positions,
    ...filteredCustomPositions,
  ];

  // Combined positions for template editing
  const templateEditPositions = [
    ...allBelPositions.map(p => ({ ...p, id: p.id.toString() })),
    ...customPositions.map(c => ({ ...c, id: c.id, position_code: c.id, group: 'Eigenpositionen' }))
  ];

  // Helper functions
  const getPositionPrice = (id: string) => {
    const pos = [...allBelPositions, ...customPositions].find((p) => p.id === id);
    return pos?.price || 0;
  };

  const getPositionName = (id: string) => {
    const pos = [...allBelPositions, ...customPositions].find((p) => p.id === id);
    return pos?.name || id;
  };

  const toggleSelection = (id: string) => {
    setSelectedForTemplate((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedForTemplate([]);
  };

  const handleCreateInvoice = (template: Template) => {
    console.log('Create invoice from template:', template);
    alert('Rechnungserstellung kommt in Phase 3!');
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('labrechner-onboarding-done');
    alert('Onboarding-Tour wird in einer späteren Phase implementiert.');
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      selectedRegion={selectedRegion}
      onRegionChange={setSelectedRegion}
      labType={labType}
      onLabTypeChange={setLabType}
      selectedGroup={selectedGroup}
      onGroupChange={setSelectedGroup}
      isDark={isDark}
      toggleTheme={toggleTheme}
      regions={REGIONS}
      userName={userSettings.name}
    >
      {(activeTab === 'search' || activeTab === 'favorites') && (
        <SearchView
          positions={allPositionsForSearch}
          favorites={uiFavorites}
          onToggleFavorite={toggleFavorite}
          selectedForTemplate={selectedForTemplate}
          onToggleSelection={toggleSelection}
          onClearSelection={clearSelection}
          onCreateTemplate={handleCreateTemplateFromSelection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          globalPriceFactor={globalPriceFactor}
          labType={labType}
          isFavoritesView={activeTab === 'favorites'}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}

      {activeTab === 'templates' && (
        <TemplatesView
          templates={templates}
          onUpdateTemplates={setTemplates}
          onCreateInvoice={handleCreateInvoiceFromTemplate}
          positions={templateEditPositions}
          getPositionPrice={getPositionPrice}
          getPositionName={getPositionName}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView 
          clients={formattedClients} 
          onUpdateClients={async (newClients) => {
            // Note: This onUpdateClients is a bit simplistic for a hook-based approach.
            // Let's implement a better handler that distinguishes between add and update.
            // But for now, since ClientsView is designed this way, we'll try to find the diff.
            if (newClients.length > dbClients.length) {
              const added = newClients.find(nc => !dbClients.some(dc => dc.id === nc.id));
              if (added) {
                await createClientHook({
                  customer_number: added.customerNumber,
                  salutation: added.salutation,
                  title: added.title,
                  first_name: added.firstName,
                  last_name: added.lastName,
                  practice_name: added.practiceName,
                  street: added.street,
                  postal_code: added.zip,
                  city: added.city,
                  country: 'Deutschland'
                });
              }
            } else if (newClients.length < dbClients.length) {
              const deletedId = dbClients.find(dc => !newClients.some(nc => nc.id === dc.id))?.id;
              if (deletedId) await deleteClientHook(deletedId);
            } else {
              // Potential update
              newClients.forEach(async nc => {
                const existing = dbClients.find(dc => dc.id === nc.id);
                if (existing && (
                  existing.last_name !== nc.lastName || 
                  existing.practice_name !== nc.practiceName ||
                  existing.customer_number !== nc.customerNumber ||
                  existing.street !== nc.street ||
                  existing.postal_code !== nc.zip ||
                  existing.city !== nc.city
                )) {
                  await updateClientHook(nc.id, {
                    customer_number: nc.customerNumber,
                    salutation: nc.salutation,
                    title: nc.title,
                    first_name: nc.firstName,
                    last_name: nc.lastName,
                    practice_name: nc.practiceName,
                    street: nc.street,
                    postal_code: nc.zip,
                    city: nc.city
                  });
                }
              });
            }
          }} 
        />
      )}

      {activeTab === 'invoices' && (
        <InvoicesView
          invoices={invoices}
          clients={dbClients as any}
          loading={invoicesLoading || clientsLoading}
          onCreateInvoice={() => {
            setEditingInvoice(null);
            setIsInvoiceModalOpen(true);
          }}
          onEditInvoice={(invoice) => {
            setEditingInvoice(invoice);
            setIsInvoiceModalOpen(true);
          }}
          onDeleteInvoice={deleteInvoice}
          onDownloadPDF={downloadPDF}
          onPreviewPDF={openPDFInNewTab}
          onStatusChange={setInvoiceStatus}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          userSettings={userSettings}
          onUpdateSettings={setUserSettings}
          customPositions={customPositions}
          onUpdateCustomPositions={setCustomPositions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          regions={REGIONS}
          globalPriceFactor={globalPriceFactor}
          onGlobalPriceFactorChange={setGlobalPriceFactor}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onRestartOnboarding={handleRestartOnboarding}
        />
      )}

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        clients={dbClients as any}
        initialData={editingInvoice}
      />

      <TemplateCreationModal
        isOpen={isTemplateCreationModalOpen}
        onClose={() => setIsTemplateCreationModalOpen(false)}
        selectedPositions={allPositionsForSearch.filter(p => selectedForTemplate.includes(p.id))}
        onSave={handleSaveTemplateFromModal}
      />
    </DashboardLayout>
  );
}
