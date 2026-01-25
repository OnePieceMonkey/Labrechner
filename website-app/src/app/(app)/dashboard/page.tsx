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
import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { createClient } from '@/lib/supabase/client';
import type {
  TabType,
  LabType,
  Template,
  Recipient,
  UserSettings,
  CustomPosition,
  BELPosition,
} from '@/types/erp';
import { DEFAULT_USER_SETTINGS } from '@/types/erp';

// Mock Templates für den Anfang
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
  {
    id: 2,
    name: 'Michiganschiene',
    items: [
      { id: '0010', isAi: false, quantity: 1 },
      { id: '4010', isAi: false, quantity: 1 },
    ],
    factor: 1.2,
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [clients, setClients] = useState<Recipient[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [customPositions, setCustomPositions] = useState<CustomPosition[]>([]);

  // Invoices & Clients Hooks
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

  const { downloadPDF, openPDFInNewTab } = usePDFGenerator();
  const { settings: dbSettings } = useUser();

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);

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

  // KZV ID für Supabase
  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  const KZV_CODE_TO_ID: Record<string, number> = {};

  // Load KZV IDs
  useEffect(() => {
    async function loadKzvIds() {
      const supabase = createClient();
      const { data } = await supabase
        .from('kzv_regions')
        .select('id, code') as { data: { id: number; code: string }[] | null };

      if (data) {
        data.forEach((kzv) => {
          KZV_CODE_TO_ID[kzv.code] = kzv.id;
        });
        const kzvCode = REGION_TO_KZV[selectedRegion];
        if (kzvCode && KZV_CODE_TO_ID[kzvCode]) {
          setKzvId(KZV_CODE_TO_ID[kzvCode]);
        }
      }
    }
    loadKzvIds();
  }, []);

  // Update KZV ID when region changes
  useEffect(() => {
    const kzvCode = REGION_TO_KZV[selectedRegion];
    if (kzvCode && KZV_CODE_TO_ID[kzvCode]) {
      setKzvId(KZV_CODE_TO_ID[kzvCode]);
    }
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

    const savedClients = localStorage.getItem('labrechner-clients');
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch (e) {}
    }

    const savedCustomPos = localStorage.getItem('labrechner-custom-pos');
    if (savedCustomPos) {
      try {
        setCustomPositions(JSON.parse(savedCustomPos));
      } catch (e) {}
    }

    const savedFavorites = localStorage.getItem('labrechner-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
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
    localStorage.setItem('labrechner-clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('labrechner-custom-pos', JSON.stringify(customPositions));
  }, [customPositions]);

  useEffect(() => {
    localStorage.setItem('labrechner-favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    id: r.position_code,
    name: r.name,
    price: r.price || 0,
    group: r.group_name || 'all',
  }));

  // Add custom positions
  const allPositions = [
    ...positions,
    ...customPositions.map((c) => ({ ...c, group: 'Eigenpositionen' })),
  ];

  // Helper functions
  const getPositionPrice = (id: string) => {
    const pos = allPositions.find((p) => p.id === id);
    return pos?.price || 0;
  };

  const getPositionName = (id: string) => {
    const pos = allPositions.find((p) => p.id === id);
    return pos?.name || id;
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
    // TODO: Implement invoice creation
    console.log('Create invoice from template:', template);
    alert('Rechnungserstellung kommt in Phase 3!');
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('labrechner-onboarding-done');
    // TODO: Show onboarding modal
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
          positions={allPositions}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          selectedForTemplate={selectedForTemplate}
          onToggleSelection={toggleSelection}
          onClearSelection={clearSelection}
          onCreateTemplate={() => setActiveTab('templates')}
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
          positions={allPositions}
          getPositionPrice={getPositionPrice}
          getPositionName={getPositionName}
        />
      )}

      {/* Clients View */}
      {activeTab === 'clients' && (
        <ClientsView clients={clients} onUpdateClients={setClients} />
      )}

      {/* Invoices View */}
      {activeTab === 'invoices' && (
        <InvoicesView
          invoices={invoices}
          clients={dbClients}
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
        clients={dbClients}
        initialData={editingInvoice}
      />
    </DashboardLayout>
  );
}
