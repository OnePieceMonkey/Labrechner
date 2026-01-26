'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CustomPosition } from '@/types/erp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

export function useCustomPositions() {
  const [positions, setPositions] = useState<CustomPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [supabase] = useState(() => createClient());

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await (supabase as SupabaseAny).auth.getUser();

      if (!user) {
        setPositions([]);
        return;
      }

      const { data, error: fetchError } = await (supabase as SupabaseAny)
        .from('custom_positions')
        .select('id, position_code, name, default_price, vat_rate')
        .eq('user_id', user.id)
        .order('position_code', { ascending: true });

      if (fetchError) throw fetchError;

      const mapped: CustomPosition[] = (data || []).map((row: any) => ({
        id: row.position_code,
        db_id: row.id,
        name: row.name,
        price: Number(row.default_price) || 0,
        vat_rate: row.vat_rate ? Number(row.vat_rate) : 19,
      }));

      setPositions(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Eigenpositionen');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const createPosition = useCallback(async (position: CustomPosition) => {
    try {
      const { data: { user } } = await (supabase as SupabaseAny).auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const { data, error: insertError } = await (supabase as SupabaseAny)
        .from('custom_positions')
        .insert({
          user_id: user.id,
          position_code: position.id,
          name: position.name,
          default_price: position.price,
          vat_rate: position.vat_rate ?? 19,
        })
        .select('id, position_code, name, default_price, vat_rate')
        .single();

      if (insertError) throw insertError;

      const mapped: CustomPosition = {
        id: data.position_code,
        db_id: data.id,
        name: data.name,
        price: Number(data.default_price) || 0,
        vat_rate: data.vat_rate ? Number(data.vat_rate) : 19,
      };

      setPositions((prev) =>
        [...prev.filter((p) => p.id !== mapped.id), mapped].sort((a, b) => a.id.localeCompare(b.id))
      );
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
      throw err;
    }
  }, [supabase]);

  const updatePosition = useCallback(async (position: CustomPosition) => {
    try {
      const targetId = position.db_id;
      if (!targetId) throw new Error('Eigenposition konnte nicht zugeordnet werden');

      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('custom_positions')
        .update({
          position_code: position.id,
          name: position.name,
          default_price: position.price,
          vat_rate: position.vat_rate ?? 19,
        })
        .eq('id', targetId)
        .select('id, position_code, name, default_price, vat_rate')
        .single();

      if (updateError) throw updateError;

      const mapped: CustomPosition = {
        id: data.position_code,
        db_id: data.id,
        name: data.name,
        price: Number(data.default_price) || 0,
        vat_rate: data.vat_rate ? Number(data.vat_rate) : 19,
      };

      setPositions((prev) =>
        prev
          .map((p) => (p.db_id === mapped.db_id ? mapped : p))
          .sort((a, b) => a.id.localeCompare(b.id))
      );
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  const deletePosition = useCallback(async (position: CustomPosition) => {
    try {
      const targetId = position.db_id;
      if (!targetId) throw new Error('Eigenposition konnte nicht zugeordnet werden');

      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('custom_positions')
        .delete()
        .eq('id', targetId);

      if (deleteError) throw deleteError;

      setPositions((prev) => prev.filter((p) => p.db_id !== targetId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Loeschen');
      throw err;
    }
  }, [supabase]);

  return {
    positions,
    loading,
    error,
    createPosition,
    updatePosition,
    deletePosition,
    refresh: fetchPositions,
  };
}
