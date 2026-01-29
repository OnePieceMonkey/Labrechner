'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Invoice, InvoiceItem, InvoiceInsert, InvoiceItemInsert, Client, UserSettings } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Rechnungen laden
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setInvoices([]);
        return;
      }

      const { data: invoicesData, error: fetchError } = await (supabase as SupabaseAny)
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const invoiceIds = (invoicesData || []).map((i: Invoice) => i.id);

      if (invoiceIds.length === 0) {
        setInvoices([]);
        return;
      }

      const { data: itemsData, error: itemsError } = await (supabase as SupabaseAny)
        .from('invoice_items')
        .select('*')
        .in('invoice_id', invoiceIds)
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      const invoicesWithItems: InvoiceWithItems[] = (invoicesData || []).map((invoice: Invoice) => ({
        ...invoice,
        items: (itemsData || []).filter((item: InvoiceItem) => item.invoice_id === invoice.id),
      }));

      setInvoices(invoicesWithItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Rechnungen');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial laden
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Neue Rechnungsnummer generieren
  const generateInvoiceNumber = useCallback(async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Nicht angemeldet');

    try {
      const { data, error } = await (supabase as SupabaseAny).rpc('generate_invoice_number', {
        p_user_id: user.id,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      // Fallback if RPC is missing or blocked
      const now = new Date();
      const fallback = `RE-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;
      console.warn('generate_invoice_number failed, using fallback:', err);
      return fallback;
    }
  }, [supabase]);

  // Rechnung erstellen
  const createInvoice = useCallback(async (
    invoiceData: Omit<InvoiceInsert, 'user_id' | 'invoice_number'>,
    client?: Client | null,
    labSettings?: UserSettings | null
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      // Rechnungsnummer generieren
      const invoiceNumber = await generateInvoiceNumber();

      // Client & Lab Snapshots erstellen
      const clientSnapshot = client ? {
        id: client.id,
        customer_number: client.customer_number,
        salutation: client.salutation,
        title: client.title,
        first_name: client.first_name,
        last_name: client.last_name,
        practice_name: client.practice_name,
        street: client.street,
        house_number: client.house_number,
        postal_code: client.postal_code,
        city: client.city,
      } : null;

      const labSnapshot = labSettings ? {
        lab_name: labSettings.lab_name,
        lab_street: labSettings.lab_street,
        lab_house_number: labSettings.lab_house_number,
        lab_postal_code: labSettings.lab_postal_code,
        lab_city: labSettings.lab_city,
        tax_id: labSettings.tax_id,
        vat_id: labSettings.vat_id,
        jurisdiction: labSettings.jurisdiction,
        bank_name: labSettings.bank_name,
        iban: labSettings.iban,
        bic: labSettings.bic,
        logo_url: labSettings.logo_url,
      } : null;

      // Basis-Payload ohne neue XML-Felder (für Abwärtskompatibilität)
      const basePayload = {
        ...invoiceData,
        user_id: user.id,
        invoice_number: invoiceNumber,
        client_snapshot: clientSnapshot,
        lab_snapshot: labSnapshot,
        patient_name: invoiceData.patient_name,
      };

      let data: Invoice | null = null;
      let insertError: unknown | null = null;

      // Erster Versuch: Mit allen Feldern (inkl. generate_xml)
      const insertResult = await (supabase as SupabaseAny)
        .from('invoices')
        .insert(basePayload)
        .select()
        .single();

      data = insertResult.data || null;
      insertError = insertResult.error || null;

      // Fallback: Falls XML/HKP-Spalten fehlen, ohne diese Felder versuchen
      if (insertError) {
        const errorMsg = (insertError as any)?.message || '';
        if (errorMsg.toLowerCase().includes('generate_xml') ||
            errorMsg.toLowerCase().includes('hkp_nummer') ||
            errorMsg.toLowerCase().includes('column')) {
          console.warn('XML/HKP columns missing, retrying without these fields');
          const { generate_xml, xml_url, xml_generated_at, hkp_nummer, ...fallbackPayload } = basePayload as any;
          const retryResult = await (supabase as SupabaseAny)
            .from('invoices')
            .insert(fallbackPayload)
            .select()
            .single();
          data = retryResult.data || null;
          insertError = retryResult.error || null;
        }
      }

      if (insertError || !data) throw insertError || new Error('Insert failed');

      const newInvoice: InvoiceWithItems = { ...data, items: [] };
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
      throw err;
    }
  }, [supabase, generateInvoiceNumber]);

  // Rechnung aktualisieren
  const updateInvoice = useCallback(async (id: string, updates: Partial<InvoiceInsert>) => {
    try {
      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setInvoices(prev =>
        prev.map(i => (i.id === id ? { ...i, ...data } : i))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  // Rechnung löschen
  const deleteInvoice = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('invoices')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setInvoices(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
      throw err;
    }
  }, [supabase]);

  // Position zu Rechnung hinzufügen
  const addInvoiceItem = useCallback(async (invoiceId: string, itemData: Omit<InvoiceItemInsert, 'invoice_id'>) => {
    try {
      const invoice = invoices.find(i => i.id === invoiceId);
      const maxOrder = invoice?.items.reduce((max, item) => Math.max(max, item.sort_order), -1) ?? -1;

      const basePayload = {
        ...itemData,
        invoice_id: invoiceId,
        sort_order: maxOrder + 1,
      };

      let data: InvoiceItem | null = null;
      let insertError: unknown | null = null;

      const insertResult = await (supabase as SupabaseAny)
        .from('invoice_items')
        .insert(basePayload)
        .select()
        .single();

      data = insertResult.data || null;
      insertError = insertResult.error || null;

      if (insertError) {
        const message = (insertError as any)?.message || '';
        if (message.toLowerCase().includes('vat_rate')) {
          // Fallback if vat_rate column is missing in DB
          const { vat_rate, ...fallbackPayload } = basePayload as any;
          const retry = await (supabase as SupabaseAny)
            .from('invoice_items')
            .insert(fallbackPayload)
            .select()
            .single();
          data = retry.data || null;
          insertError = retry.error || null;
        }
      }

      if (insertError || !data) throw insertError || new Error('Insert failed');

      // Try to recalc totals (ignore if function not available)
      try {
        await (supabase as SupabaseAny).rpc('recalculate_invoice_totals', {
          p_invoice_id: invoiceId,
        });
      } catch {
        // ignore
      }

      // Rechnung neu laden um aktualisierte Beträge zu erhalten
      const { data: updatedInvoice, error: fetchError } = await (supabase as SupabaseAny)
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (fetchError) throw fetchError;

      setInvoices(prev =>
        prev.map(i =>
          i.id === invoiceId
            ? { ...updatedInvoice, items: [...i.items, data] }
            : i
        )
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
      throw err;
    }
  }, [supabase, invoices]);

  // Position aktualisieren
  const updateInvoiceItem = useCallback(async (itemId: string, updates: Partial<InvoiceItemInsert>) => {
    try {
      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('invoice_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Rechnung ID finden und neu laden
      const invoiceId = data.invoice_id;
      try {
        await (supabase as SupabaseAny).rpc('recalculate_invoice_totals', {
          p_invoice_id: invoiceId,
        });
      } catch {
        // ignore
      }
      const { data: updatedInvoice, error: fetchError } = await (supabase as SupabaseAny)
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (fetchError) throw fetchError;

      setInvoices(prev =>
        prev.map(i => ({
          ...i,
          ...(i.id === invoiceId ? updatedInvoice : {}),
          items: i.items.map(item => (item.id === itemId ? data : item)),
        }))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  // Position löschen
  const deleteInvoiceItem = useCallback(async (itemId: string, invoiceId: string) => {
    try {
      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('invoice_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      try {
        await (supabase as SupabaseAny).rpc('recalculate_invoice_totals', {
          p_invoice_id: invoiceId,
        });
      } catch {
        // ignore
      }

      // Rechnung neu laden
      const { data: updatedInvoice, error: fetchError } = await (supabase as SupabaseAny)
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (fetchError) throw fetchError;

      setInvoices(prev =>
        prev.map(i => ({
          ...i,
          ...(i.id === invoiceId ? updatedInvoice : {}),
          items: i.items.filter(item => item.id !== itemId),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
      throw err;
    }
  }, [supabase]);

  // Status ändern
  const setInvoiceStatus = useCallback(async (id: string, status: Invoice['status']) => {
    const updates: Partial<InvoiceInsert> = { status };

    if (status === 'sent') {
      updates.sent_at = new Date().toISOString();
    } else if (status === 'paid') {
      updates.paid_at = new Date().toISOString();
    }

    return updateInvoice(id, updates);
  }, [updateInvoice]);

  // Rechnung nach ID holen
  const getInvoiceById = useCallback((id: string) => {
    return invoices.find(i => i.id === id);
  }, [invoices]);

  // Statistiken
  const getStats = useCallback(() => {
    const now = new Date();
    const thisMonth = invoices.filter(i => {
      const date = new Date(i.invoice_date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    return {
      total: invoices.length,
      draft: invoices.filter(i => i.status === 'draft').length,
      sent: invoices.filter(i => i.status === 'sent').length,
      paid: invoices.filter(i => i.status === 'paid').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
      thisMonthCount: thisMonth.length,
      thisMonthTotal: thisMonth.reduce((sum, i) => sum + Number(i.total), 0),
      paidTotal: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0),
      pendingTotal: invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + Number(i.total), 0),
    };
  }, [invoices]);

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    addInvoiceItem,
    updateInvoiceItem,
    deleteInvoiceItem,
    setInvoiceStatus,
    getInvoiceById,
    getStats,
    refresh: fetchInvoices,
  };
}
