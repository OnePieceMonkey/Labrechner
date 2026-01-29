'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Client, ClientInsert } from '@/types/database';

// Supabase Client mit any für neue Tabellen (bis Typen regeneriert werden)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const validateClientPayload = (payload: Partial<ClientInsert>) => {
    const requiredFields: Array<{ label: string; value: string | null | undefined }> = [
      { label: 'Kundennummer', value: payload.customer_number },
      { label: 'Nachname', value: payload.last_name },
      { label: 'Praxisname', value: payload.practice_name },
      { label: 'E-Mail Adresse', value: payload.email },
      { label: 'Straße', value: payload.street },
      { label: 'PLZ', value: payload.postal_code },
      { label: 'Ort', value: payload.city },
    ];

    const missing = requiredFields
      .filter((f) => !f.value || String(f.value).trim() === '')
      .map((f) => f.label);

    if (missing.length > 0) {
      throw new Error(`Pflichtfelder fehlen: ${missing.join(', ')}`);
    }

    const emailValue = String(payload.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      throw new Error('Ungültige E-Mail-Adresse.');
    }
  };

  // Kunden laden
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setClients([]);
        return;
      }

      const { data, error: fetchError } = await (supabase as SupabaseAny)
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('last_name', { ascending: true });

      if (fetchError) throw fetchError;

      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Kunden');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial laden
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Kunde hinzufügen
  const addClient = useCallback(async (clientData: Omit<ClientInsert, 'user_id'>) => {
    try {
      validateClientPayload(clientData);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const { data, error: insertError } = await (supabase as SupabaseAny)
        .from('clients')
        .insert({ ...clientData, user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;

      setClients(prev => [...prev, data].sort((a, b) => a.last_name.localeCompare(b.last_name)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
      throw err;
    }
  }, [supabase]);

  // Kunde aktualisieren
  const updateClient = useCallback(async (id: string, updates: Partial<ClientInsert>) => {
    try {
      validateClientPayload(updates);
      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setClients(prev =>
        prev
          .map(c => (c.id === id ? data : c))
          .sort((a, b) => a.last_name.localeCompare(b.last_name))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  // Kunde löschen
  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
      throw err;
    }
  }, [supabase]);

  // Kunde nach ID holen
  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  // Kunden suchen
  const searchClients = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return clients.filter(c =>
      c.last_name.toLowerCase().includes(lowerQuery) ||
      c.first_name?.toLowerCase().includes(lowerQuery) ||
      c.practice_name?.toLowerCase().includes(lowerQuery) ||
      c.customer_number?.toLowerCase().includes(lowerQuery)
    );
  }, [clients]);

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    searchClients,
    refresh: fetchClients,
  };
}
