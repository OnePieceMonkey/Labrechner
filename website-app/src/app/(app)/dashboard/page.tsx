'use client';

import React, { useState, useEffect } from 'react';
import {
  DashboardLayout,
  SearchView,
  TemplatesView,
  ClientsView,
  SettingsView,
  InvoicesView,
  InvoiceModal,
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

// Mock Templates für den Anfang (Fallback)
const INITIAL_TEMPLATES: Template[] = [
  {
    id: 1,
    name: 'Standard Zirkonkrone',
    items: [
      { id: '0010', isAi: false, quantity: 1 },
      { id: '0052', isAi: false, quantity: 1 },
      { id: '1022', isAi: false, quantity: 1 },
    ],
    factor: 1.0,
  },
];

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
    setInvoiceStatus, 
    loading: invoicesLoading 
  } = useInvoices();
  
  const { 
    clients: dbClients, 
    loading: clientsLoading 
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
  const { settings: dbSettings } = useUser();

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);

  // Map database clients to Recipient format for ClientsView compatibility
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
      await createInvoice(
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
    }
  };

  const handleCreateTemplateFromSelection = () => {
    if (selectedForTemplate.length === 0) return;

    const newTemplate: Template = {
      id: Date.now(),
      name: `Neue Vorlage (${new Date().toLocaleDateString('de-DE')})`,
      items: selectedForTemplate.map(id => ({
        id,
        isAi: false,
        quantity: 1
      })),
      factor: 1.0
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setSelectedForTemplate([]);
    setActiveTab('templates');
    
    alert('Vorlage aus Auswahl erstellt!');
  };

  // Map Favorites Set to array for compatibility with SearchView
  const favoritesArray = Array.from(favoriteIds).map(id => id.toString());

  const toggleFavorite = (id: string) => {
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      supabaseToggleFavorite(numericId);
    }
  };

  // Load KZV IDs
  useEffect(() => {
    async function loadKzvIds() {
      const supabase = createClient();
      const { data } = await supabase
        .from('kzv_regions')
        .select('id, code') as { data: { id: number; code: string }[] | null };

      if (data) {
        const mapping: Record<string, number> = {};
        data.forEach((kzv) => {
          mapping[kzv.code] = kzv.id;
        });
        const kzvCode = REGION_TO_KZV[selectedRegion];
        if (kzvCode && mapping[kzvCode]) {
          setKzvId(mapping[kzvCode]);
        }
      }
    }
    loadKzvIds();
  }, [selectedRegion]);

  // Supabase Search
  const { results, isLoading, search } = useSearch({
    kzvId,
    laborType: labType,
    groupId: selectedGroup !== 'all' ? parseInt(selectedGroup.split('-')[0]) : null,
  });

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

    // Dark mode
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

  // Dark mode toggle
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
    id: r.id.toString(),
    position_code: r.position_code,
    name: r.name,
    price: r.price || 0,
    group: r.group_name || 'all',
  }));

  // Add custom positions
  const allPositionsForSearch = [
    ...positions,
    ...customPositions.map((c) => ({ ...c, group: 'Eigenpositionen' })),
  ];

  // Combined positions for template editing (All BEL + Custom)
  const templateEditPositions = [
    ...allBelPositions,
    ...customPositions.map(c => ({ ...c, group: 'Eigenpositionen' }))
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
      {/* Search View */}
      {(activeTab === 'search' || activeTab === 'favorites') && (
        <SearchView
          positions={allPositionsForSearch}
          favorites={favoritesArray}
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
        />
      )}

      {/* Templates View */}
      {activeTab === 'templates' && (
        <TemplatesView
          templates={templates}
          onUpdateTemplates={setTemplates}
          onCreateInvoice={handleCreateInvoice}
          positions={templateEditPositions}
          getPositionPrice={getPositionPrice}
          getPositionName={getPositionName}
        />
      )}

      {/* Clients View */}
      {activeTab === 'clients' && (
        <ClientsView 
          clients={formattedClients} 
          onUpdateClients={() => {}} 
        />
      )}

      {/* Invoices View */}
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

      {/* Settings View */}
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
    </DashboardLayout>
  );
}