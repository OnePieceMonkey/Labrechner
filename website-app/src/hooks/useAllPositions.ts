'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BELPosition } from '@/types/erp';

export function useAllPositions(kzvId?: number, laborType: 'gewerbe' | 'praxis' = 'gewerbe') {
  const [positions, setPositions] = useState<BELPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supabase] = useState(() => createClient());

  const fetchAll = useCallback(async () => {
    if (!kzvId) return;

    setLoading(true);
    setError(null);
    try {
      // Wir holen alle Positionen und deren Preise für die gewählte KZV
      const { data, error: fetchError } = await supabase
        .from('bel_positions')
        .select(`
          id,
          position_code,
          name,
          group:bel_groups(name),
          prices:bel_prices(price)
        `)
        .eq('bel_prices.kzv_id', kzvId)
        .eq('bel_prices.labor_type', laborType);

      if (fetchError) throw fetchError;

      const formatted: BELPosition[] = (data || []).map((p: any) => ({
        id: p.position_code, // Wir behalten position_code als UI-ID
        db_id: p.id,         // NEU: Echte DB-ID für Favoriten-Mapping
        position_code: p.position_code,
        name: p.name,
        price: p.prices?.[0]?.price || 0,
        group: p.group?.name || 'all'
      }));

      setPositions(formatted);
    } catch (err) {
      console.error('Error fetching all positions:', err);
      setError('Fehler beim Laden der Positionsliste');
    } finally {
      setLoading(false);
    }
  }, [kzvId, laborType]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { positions, loading, error, refresh: fetchAll };
}
