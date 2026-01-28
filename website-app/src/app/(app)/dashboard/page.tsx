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
import { Loader2, X } from 'lucide-react';
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
import type { InvoiceItem } from '@/types/database';
import { DEFAULT_USER_SETTINGS } from '@/types/erp';

// KZV Konfiguration (Fallback falls DB-Liste nicht geladen)
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
  const [kzvRegions, setKzvRegions] = useState<Array<{ id: number; name: string; code: string }>>([]);
  const [kzvNameToId, setKzvNameToId] = useState<Record<string, number>>({});

  // === HOOKS ===
  const { invoices, createInvoice, updateInvoice, deleteInvoice, addInvoiceItem, setInvoiceStatus, loading: invoicesLoading } = useInvoices();
  const { clients: dbClients, loading: clientsLoading, addClient: createClientHook, updateClient: updateClientHook, deleteClient: deleteClientHook } = useClients();
  const { favoriteIds, favoriteCustomIds, toggleFavorite: supabaseToggleFavorite, toggleCustomFavorite: supabaseToggleCustomFavorite, loading: favoritesLoading, refresh: refreshFavorites } = useFavorites();
  const { templates: dbTemplates, loading: templatesLoading, createTemplate, updateTemplate, deleteTemplate, addTemplateItem, updateTemplateItem, deleteTemplateItem, refresh: refreshTemplates } = useTemplates();

  const [kzvId, setKzvId] = useState<number | undefined>(undefined);
  const { positions: allBelPositions } = useAllPositions(kzvId, labType);
  const { downloadPDF, generatePDFBlob } = usePDFGenerator();

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
        name: dbSettings.contact_name || '',
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

  // KZV Sync (persistente Regionen aus DB)
  useEffect(() => {
    async function syncKzv() {
      const supabase = createClient() as any;
      const { data } = await supabase
        .from('kzv_regions')
        .select('id, code, name') as { data: { id: number; code: string; name: string }[] | null };

      if (data) {
        setKzvRegions(data);
        const idToName = Object.fromEntries(data.map(k => [k.id, k.name]));
        const nameToId = Object.fromEntries(data.map(k => [k.name, k.id]));
        setKzvNameToId(nameToId);

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
        .select('id, position_code, name, default_price, vat_rate')
        .order('position_code') as {
          data: Array<{
            id: string;
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
          db_id: p.id,
          name: p.name,
          price: Number(p.default_price ?? 0),
          vat_rate: Number(p.vat_rate ?? 19),
        })));
      }

      setCustomPositionsLoaded(true);
    };

    loadCustomPositions();
  }, [user, customPositionsLoaded]);

  const saveCustomPositions = async (positionsOverride?: CustomPosition[]): Promise<CustomPosition[]> => {
    const supabase = createClient() as any;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Nicht angemeldet');

    const { data: existing, error: existingError } = await supabase
      .from('custom_positions')
      .select('id, position_code') as {
        data: Array<{ id: string; position_code: string }> | null;
        error: unknown;
      };

    if (existingError) throw existingError;

    const positionsToSave = positionsOverride ?? customPositions;
    const currentCodes = new Set(positionsToSave.map(p => p.id));
    const toDelete = (existing || [])
      .filter(p => !currentCodes.has(p.position_code))
      .map(p => p.id);

    if (toDelete.length > 0) {
      const { error: deleteError } = await (supabase
        .from('custom_positions') as any)
        .delete()
        .in('id', toDelete);
      if (deleteError) throw deleteError;
    }

    const upsertRows = positionsToSave
      .map(p => {
        const safePrice = Number.isFinite(p.price) ? p.price : 0;
        const safeVat = Number.isFinite(p.vat_rate) ? p.vat_rate : 19;
        return {
          user_id: currentUser.id,
          position_code: p.id.trim(),
          name: p.name.trim(),
          default_price: safePrice,
          vat_rate: safeVat,
        };
      })
      .filter(p => p.position_code && p.name);

    const uniqueRows = Array.from(
      new Map(upsertRows.map(row => [row.position_code, row])).values()
    );

    if (uniqueRows.length > 0) {
      const { error: upsertError } = await (supabase
        .from('custom_positions') as any)
        .upsert(uniqueRows, { onConflict: 'user_id,position_code' });
      if (upsertError) throw upsertError;
    }

    const { data: refreshed, error: refreshError } = await supabase
      .from('custom_positions')
      .select('id, position_code, name, default_price, vat_rate')
      .order('position_code') as {
        data: Array<{
          id: string;
          position_code: string;
          name: string;
          default_price: number | null;
          vat_rate: number | null;
        }> | null;
        error: unknown;
      };

    if (refreshError) throw refreshError;

    if (refreshed) {
      const mapped = refreshed.map(p => ({
        id: p.position_code,
        db_id: p.id,
        name: p.name,
        price: Number(p.default_price ?? 0),
        vat_rate: Number(p.vat_rate ?? 19),
      }));
      setCustomPositions(mapped);
      return mapped;
    }

    return [];
  };

  const handleQuickAddCustomPosition = async (position: CustomPosition) => {
    const normalized: CustomPosition = {
      ...position,
      id: position.id.trim(),
      name: position.name.trim(),
      price: Number.isFinite(position.price) ? position.price : 0,
      vat_rate: Number.isFinite(position.vat_rate) ? position.vat_rate : 19,
    };

    const nextPositions = [
      ...customPositions.filter((p) => p.id !== normalized.id),
      normalized,
    ];

    setCustomPositions(nextPositions);
    await saveCustomPositions(nextPositions);
  };

  // === HANDLERS ===
  const handleToggleFavorite = async (posCode: string) => {
    console.log('Toggle Favorite for:', posCode);

    let customMatch = customPositions.find(p => p.id === posCode);
    if (customMatch) {
      let customId = customMatch.db_id;
      if (!customId) {
        const refreshed = await saveCustomPositions();
        const refreshedMatch = (refreshed || []).find(p => p.id === posCode);
        customId = refreshedMatch?.db_id;
      }

      if (customId) {
        try {
          await supabaseToggleCustomFavorite(customId);
          await refreshFavorites();
        } catch (err) {
          console.error('Error toggling custom favorite:', err);
        }
      }
      return;
    }

    // Zuerst in allBelPositions suchen (vollst??ndige Liste)
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
      console.warn('Favorit-ID konnte nicht gemappt werden f??r:', posCode);
    }
  };

  const handleRegionChange = async (name: string) => {
    setSelectedRegion(name);
    const directId = kzvNameToId[name];
    if (directId) {
      setKzvId(directId);
      await updateSettings({ kzv_id: directId });
      return;
    }
    const code = REGION_TO_KZV[name];
    if (code) {
      const supabase = createClient();
      const { data } = await supabase
        .from('kzv_regions')
        .select('id')
        .eq('code', code)
        .single() as { data: { id: number } | null };
      if (data?.id) {
        setKzvId(data.id);
        await updateSettings({ kzv_id: data.id });
      }
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedForTemplate(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const resolveCustomPositionId = async (code: string) => {
    const existing = customCodeToIdMap.get(code);
    if (existing) return existing;
    const refreshed = await saveCustomPositions();
    return refreshed.find(p => p.id === code)?.db_id;
  };

  const handleUpdateTemplates = async (updatedTemplates: any[]) => {
    const existingById = new Map(dbTemplates.map(t => [t.id, t]));
    const updatedByDbId = new Map(updatedTemplates.filter(t => t.db_id).map(t => [t.db_id, t]));

    for (const t of dbTemplates) {
      if (!updatedByDbId.has(t.id)) {
        await deleteTemplate(t.id);
      }
    }

    for (const ut of updatedTemplates) {
      if (!ut.db_id) {
        const created = await createTemplate({ name: ut.name, icon: 'Layout', color: 'brand' });
        if (created) {
          for (const item of ut.items || []) {
            const posId = codeToIdMap[item.id];
            const isCustom = customPositionIds.has(item.id) || customPositionDbIds.has(item.id);
            const customId = isCustom
              ? (customPositionDbIds.has(item.id) ? item.id : await resolveCustomPositionId(item.id))
              : null;
            await addTemplateItem(created.id, {
              position_id: isCustom ? null : posId || null,
              custom_position_id: isCustom ? customId || null : null,
              quantity: Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1,
              factor: Number.isFinite(Number(item.factor)) ? Number(item.factor) : 1.0,
            });
          }
        }
        continue;
      }

      const dbT = existingById.get(ut.db_id);
      if (!dbT) continue;

      if (dbT.name !== ut.name) {
        await updateTemplate(ut.db_id, { name: ut.name });
      }

      const existingItems = dbT.items || [];
      const existingItemsById = new Map(existingItems.map(i => [i.id, i]));
      const updatedItems = ut.items || [];
      const updatedItemIds = new Set(updatedItems.map((i: any) => i.db_id).filter(Boolean));

      for (const item of updatedItems) {
        const rawQuantity = Number(item.quantity);
        const rawFactor = Number(item.factor);
        const safeQuantity = Number.isFinite(rawQuantity) ? rawQuantity : 1;
        const safeFactor = Number.isFinite(rawFactor) ? rawFactor : 1.0;

        if (item.db_id && existingItemsById.has(item.db_id)) {
          const existingItem = existingItemsById.get(item.db_id);
          if (!existingItem) continue;
          if (existingItem.quantity !== safeQuantity || existingItem.factor !== safeFactor) {
            await updateTemplateItem(item.db_id, {
              quantity: safeQuantity,
              factor: safeFactor,
            });
          }
        } else {
          const posId = codeToIdMap[item.id];
          const isCustom = customPositionIds.has(item.id) || customPositionDbIds.has(item.id);
          const customId = isCustom
            ? (customPositionDbIds.has(item.id) ? item.id : await resolveCustomPositionId(item.id))
            : null;
          await addTemplateItem(ut.db_id, {
            position_id: isCustom ? null : posId || null,
            custom_position_id: isCustom ? customId || null : null,
            quantity: safeQuantity,
            factor: safeFactor,
          });
        }
      }

      for (const existingItem of existingItems) {
        if (!updatedItemIds.has(existingItem.id)) {
          await deleteTemplateItem(existingItem.id);
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
        const isCustom = customPositionIds.has(item.id) || customPositionDbIds.has(item.id);
        const customId = isCustom
          ? (customPositionDbIds.has(item.id) ? item.id : await resolveCustomPositionId(item.id))
          : null;
        await addTemplateItem(newTemp.id, {
          position_id: isCustom ? null : posId || null,
          custom_position_id: isCustom ? customId || null : null,
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
  const customFavoriteCodes = useMemo(() =>
    customPositions
      .filter(p => p.db_id && favoriteCustomIds.has(p.db_id))
      .map(p => p.id),
  [customPositions, favoriteCustomIds]);

  const uiFavorites = useMemo(() => {
    const belCodes = Array.from(favoriteIds)
      .map(id => idToCodeMap[id])
      .filter((code): code is string => !!code);
    return [...belCodes, ...customFavoriteCodes];
  }, [favoriteIds, idToCodeMap, customFavoriteCodes]);

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
      const favs = allBelPositions.filter(p => uiFavorites.includes(p.id));
      const customFavs = customPositions.filter(p => p.db_id && favoriteCustomIds.has(p.db_id));
      if (showCustomOnly) return customFavs;
      if (activeGroupId) return favs.filter(p => p.groupId === activeGroupId);
      return [...favs, ...customFavs];
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
  }, [activeTab, allBelPositions, customPositions, searchQuery, uiFavorites, mappedResults, activeGroupId, showCustomOnly, showAllGroups, favoriteCustomIds]);

  const selectedPositionsForTemplate = useMemo(() => {
    const lookup = new Map<string, BELPosition | CustomPosition>();
    allBelPositions.forEach(p => lookup.set(p.id, p));
    customPositions.forEach(p => lookup.set(p.id, p));
    mappedResults.forEach(p => lookup.set(p.id, p));
    return selectedForTemplate.map(id => lookup.get(id)).filter((p): p is BELPosition | CustomPosition => Boolean(p));
  }, [allBelPositions, customPositions, mappedResults, selectedForTemplate]);

  const customPositionIds = useMemo(() => new Set(customPositions.map(p => p.id)), [customPositions]);
  const customPositionDbIds = useMemo(() => new Set(customPositions.filter(p => p.db_id).map(p => p.db_id!)), [customPositions]);
  const isCustomPosition = useCallback((id: string) => customPositionIds.has(id) || customPositionDbIds.has(id), [customPositionIds, customPositionDbIds]);

  const customCodeToIdMap = useMemo(() => new Map(customPositions.filter(p => p.db_id).map(p => [p.id, p.db_id!])), [customPositions]);
  const customIdToCodeMap = useMemo(() => new Map(customPositions.filter(p => p.db_id).map(p => [p.db_id!, p.id])), [customPositions]);

  const formattedTemplates = useMemo(() => dbTemplates.map(t => ({
    id: t.id,
    db_id: t.id,
    name: t.name,
    factor: t.items[0]?.factor || 1.0,
    items: t.items
      .map(i => ({
        id: i.position_id ? idToCodeMap[i.position_id] : (i.custom_position_id ? (customIdToCodeMap.get(i.custom_position_id) || i.custom_position_id) : i.custom_position_id),
        quantity: i.quantity,
        factor: i.factor ?? 1.0,
        isAi: false,
        db_id: i.id,
      }))
      .filter(i => i.id)
  })), [dbTemplates, idToCodeMap, customIdToCodeMap]);

  const invoicePreviewCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    return () => {
      invoicePreviewCache.current.forEach(url => URL.revokeObjectURL(url));
      invoicePreviewCache.current.clear();
    };
  }, []);

  const requestInvoicePreviewUrl = useCallback(async (invoice: InvoiceWithItems, items: InvoiceItem[]) => {
    const cached = invoicePreviewCache.current.get(invoice.id);
    if (cached) return cached;
    let resolvedItems = items;
    if (!resolvedItems || resolvedItems.length === 0) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoice.id)
          .order('sort_order', { ascending: true }) as { data: InvoiceItem[] | null };
        if (data && data.length > 0) resolvedItems = data;
      } catch {
        // ignore and fallback to provided items
      }
    }
    const blob = await generatePDFBlob(invoice, resolvedItems);
    const url = URL.createObjectURL(blob);
    invoicePreviewCache.current.set(invoice.id, url);
    return url;
  }, [generatePDFBlob]);

  const requestShareLink = useCallback(async (invoiceId: string) => {
    const res = await fetch('/api/invoices/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Share-Link konnte nicht erstellt werden');
    }
    const data = await res.json();
    return data.url as string;
  }, []);

  const regionOptions = kzvRegions.length > 0 ? kzvRegions.map((r) => r.name) : REGIONS;

  // === MODAL & ONBOARDING ===
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTemplateCreationModalOpen, setIsTemplateCreationModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);
  const [pendingItems, setPendingItems] = useState<{ id: string; quantity: number }[] | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceWithItems | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const openInvoicePreview = useCallback(async (invoice: InvoiceWithItems, items: InvoiceItem[]) => {
    setIsInvoicePreviewOpen(true);
    setPreviewInvoice(invoice);
    setPreviewError(null);
    setPreviewLoading(true);
    setPreviewUrl(null);
    try {
      const url = await requestInvoicePreviewUrl(invoice, items);
      setPreviewUrl(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Vorschau konnte nicht geladen werden.';
      setPreviewError(message);
    } finally {
      setPreviewLoading(false);
    }
  }, [requestInvoicePreviewUrl]);

  const closeInvoicePreview = () => {
    setIsInvoicePreviewOpen(false);
    setPreviewInvoice(null);
    setPreviewError(null);
    setPreviewLoading(false);
  };


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
      regions={regionOptions} userName={localUserSettings.labName || 'Benutzer'}
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
          onQuickAddCustomPosition={activeTab === 'search' ? handleQuickAddCustomPosition : undefined}
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
          positions={[...allBelPositions, ...customPositions] as any}
          getPositionPrice={id => {
            const pos = allBelPositions.find(p => p.id === id)
              || customPositions.find(p => p.id === id || p.db_id === id);
            return pos?.price || 0;
          }}
          getPositionName={id => {
            const pos = allBelPositions.find(p => p.id === id)
              || customPositions.find(p => p.id === id || p.db_id === id);
            return pos?.name || id;
          }}
          isCustomPosition={isCustomPosition}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView 
          clients={dbClients.map(c => ({ id: c.id, customerNumber: c.customer_number || '', salutation: c.salutation || '', title: c.title || '', firstName: c.first_name || '', lastName: c.last_name, practiceName: c.practice_name || '', street: c.street || '', zip: c.postal_code || '', city: c.city || '', email: c.email || '' }))}
          onUpdateClients={async (newClients) => {
            const dbById = new Map(dbClients.map(dc => [dc.id, dc]));
            const newById = new Map(newClients.map(nc => [nc.id, nc]));

            const added = newClients.filter(nc => !dbById.has(nc.id));
            const removed = dbClients.filter(dc => !newById.has(dc.id));
            const updated = newClients.filter(nc => {
              const dc = dbById.get(nc.id);
              if (!dc) return false;
              return (
                (dc.customer_number || '') !== (nc.customerNumber || '') ||
                (dc.salutation || '') !== (nc.salutation || '') ||
                (dc.title || '') !== (nc.title || '') ||
                (dc.first_name || '') !== (nc.firstName || '') ||
                (dc.last_name || '') !== (nc.lastName || '') ||
                (dc.practice_name || '') !== (nc.practiceName || '') ||
                (dc.street || '') !== (nc.street || '') ||
                (dc.postal_code || '') !== (nc.zip || '') ||
                (dc.city || '') !== (nc.city || '') ||
                (dc.email || '') !== (nc.email || '')
              );
            });

            for (const addedClient of added) {
              await createClientHook({
                customer_number: addedClient.customerNumber,
                salutation: addedClient.salutation,
                title: addedClient.title,
                first_name: addedClient.firstName,
                last_name: addedClient.lastName,
                practice_name: addedClient.practiceName,
                street: addedClient.street,
                postal_code: addedClient.zip,
                city: addedClient.city,
                country: 'Deutschland',
                email: addedClient.email,
              });
            }

            for (const removedClient of removed) {
              await deleteClientHook(removedClient.id);
            }

            for (const updatedClient of updated) {
              await updateClientHook(updatedClient.id, {
                customer_number: updatedClient.customerNumber,
                salutation: updatedClient.salutation,
                title: updatedClient.title,
                first_name: updatedClient.firstName,
                last_name: updatedClient.lastName,
                practice_name: updatedClient.practiceName,
                street: updatedClient.street,
                postal_code: updatedClient.zip,
                city: updatedClient.city,
                email: updatedClient.email,
              });
            }
          }}
        />
      )}

      {activeTab === 'invoices' && (
        <InvoicesView
          invoices={invoices} clients={dbClients as any} loading={invoicesLoading}
          onCreateInvoice={() => { setPendingItems(null); setEditingInvoice(null); setIsInvoiceModalOpen(true); }}
          onEditInvoice={inv => { setEditingInvoice(inv); setIsInvoiceModalOpen(true); }}
          onDeleteInvoice={deleteInvoice}
          onDownloadPDF={downloadPDF}
          onOpenPreview={openInvoicePreview}
          onRequestPreviewUrl={requestInvoicePreviewUrl}
          onRequestShareLink={requestShareLink}
          onStatusChange={setInvoiceStatus}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          userSettings={localUserSettings} onUpdateSettings={setLocalUserSettings}
          customPositions={customPositions} onUpdateCustomPositions={setCustomPositions}
          selectedRegion={selectedRegion} onRegionChange={handleRegionChange} regions={regionOptions}
          globalPriceFactor={globalPriceFactor} 
          onGlobalPriceFactorChange={async (f) => { setGlobalPriceFactor(f); await updateSettings({ global_factor: f }); }}
          isDark={theme === 'dark'} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
          onRestartOnboarding={() => setShowOnboarding(true)}
          onSaveProfile={async () => {
            try {
              await updateSettings({
                contact_name: localUserSettings.name,
                lab_name: localUserSettings.labName, 
                lab_email: localUserSettings.labEmail,
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
                kzv_id: kzvId,
              } as any);
              await saveCustomPositions();
              // Show visual feedback
              const toast = document.createElement('div');
              toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-fade-in-up';
              toast.innerText = '✓ Einstellungen erfolgreich gespeichert';
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 3000);
            } catch (err) {
              const message = err instanceof Error && err.message
                ? err.message
                : (err as any)?.message || 'Fehler beim Speichern';
              alert('Fehler beim Speichern');
              throw new Error(message);
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
            const createdItems: InvoiceItem[] = [];
            for (const item of pendingItems) {
              const pos = [...allBelPositions, ...customPositions].find(p => p.id === item.id);
              if (pos) {
                const isCustomItem = customPositionIds.has(item.id) || customPositionDbIds.has(item.id);
                const customItemId = customPositionDbIds.has(item.id)
                  ? item.id
                  : (customCodeToIdMap.get(item.id) || null);
                const vat = isCustomItem ? (pos as any).vat_rate || 19 : 7;
                const created = await addInvoiceItem(newInv.id, {
                  position_id: isCustomItem ? null : (pos as any).db_id,
                  custom_position_id: isCustomItem ? customItemId : null,
                  position_code: (pos as any).position_code || item.id,
                  position_name: pos.name, quantity: item.quantity, factor: 1.0, unit_price: pos.price, line_total: pos.price * item.quantity, vat_rate: vat
                });
                if (created) createdItems.push(created);
              }
            }
            setPendingItems(null);
            setActiveTab('invoices');
            if (createdItems.length > 0) {
              await openInvoicePreview({ ...newInv, items: createdItems }, createdItems);
            }
          }
        }} 
        clients={dbClients as any} initialData={editingInvoice} 
      />

      {isInvoicePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rechnungsvorschau</h3>
                {previewInvoice && (
                  <p className="text-xs text-slate-500">{previewInvoice.invoice_number}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {previewInvoice && (
                  <button
                    onClick={() => downloadPDF(previewInvoice, previewInvoice.items)}
                    className="px-3 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    PDF herunterladen
                  </button>
                )}
                <button
                  onClick={closeInvoicePreview}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/40">
              {previewLoading && (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                </div>
              )}
              {previewError && (
                <div className="h-full flex items-center justify-center text-sm text-red-500">
                  {previewError}
                </div>
              )}
              {!previewLoading && !previewError && previewUrl && (
                <iframe
                  title="Rechnungsvorschau"
                  src={previewUrl}
                  className="w-full h-[75vh] bg-white"
                />
              )}
              {!previewLoading && !previewError && !previewUrl && (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  Keine Vorschau verfÃ¼gbar.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <TemplateCreationModal 
        isOpen={isTemplateCreationModalOpen} onClose={() => setIsTemplateCreationModalOpen(false)} 
        selectedPositions={selectedPositionsForTemplate} 
        onSave={handleCreateTemplate} 
      />
      <OnboardingTour isOpen={showOnboarding} onComplete={() => { setShowOnboarding(false); localStorage.setItem('labrechner-onboarding-done', 'true'); }} onStepChange={step => { if (['search', 'favorites', 'templates', 'clients', 'settings'].includes(step)) setActiveTab(step as TabType); }} />
    </DashboardLayout>
  );
}
