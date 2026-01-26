'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Favorite } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [supabase] = useState(() => createClient());

  // Favoriten laden
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setFavorites([]);
        setFavoriteIds(new Set());
        return;
      }

      // Join mit bel_positions um den code zu erhalten
      const { data, error: fetchError } = await (supabase as SupabaseAny)
        .from('favorites')
        .select(`
          *,
          bel_positions (
            position_code
          )
        `)
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      setFavorites(data || []);
      setFavoriteIds(new Set((data || []).map((f: any) => f.position_id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Favoriten');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial laden
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Favorit hinzufügen
  const addFavorite = useCallback(async (positionId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const { data, error: insertError } = await (supabase as SupabaseAny)
        .from('favorites')
        .insert({ user_id: user.id, position_id: positionId })
        .select()
        .single();

      if (insertError) throw insertError;

      setFavorites(prev => [...prev, data]);
      setFavoriteIds(prev => new Set([...prev, positionId]));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
      throw err;
    }
  }, [supabase]);

  // Favorit entfernen
  const removeFavorite = useCallback(async (positionId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('position_id', positionId);

      if (deleteError) throw deleteError;

      setFavorites(prev => prev.filter(f => f.position_id !== positionId));
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(positionId);
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Entfernen');
      throw err;
    }
  }, [supabase]);

  // Toggle Favorit
  const toggleFavorite = useCallback(async (positionId: number) => {
    if (favoriteIds.has(positionId)) {
      await removeFavorite(positionId);
    } else {
      await addFavorite(positionId);
    }
  }, [favoriteIds, addFavorite, removeFavorite]);

  // Prüfen ob Favorit
  const isFavorite = useCallback((positionId: number) => {
    return favoriteIds.has(positionId);
  }, [favoriteIds]);

  return {
    favorites,
    favoriteIds,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refresh: fetchFavorites,
  };
}
