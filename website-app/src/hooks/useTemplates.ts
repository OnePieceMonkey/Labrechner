'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Template, TemplateItem, TemplateInsert, TemplateItemInsert } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

export interface TemplateWithItems extends Template {
  items: TemplateItem[];
}

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [supabase] = useState(() => createClient());

  // Templates laden
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await (supabase as SupabaseAny).auth.getUser();

      if (!user) {
        setTemplates([]);
        return;
      }

      // Templates mit Items laden
      const { data: templatesData, error: fetchError } = await (supabase as SupabaseAny)
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Items für alle Templates laden
      const templateIds = (templatesData || []).map((t: Template) => t.id);

      if (templateIds.length === 0) {
        setTemplates([]);
        return;
      }

      const { data: itemsData, error: itemsError } = await (supabase as SupabaseAny)
        .from('template_items')
        .select('*')
        .in('template_id', templateIds)
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      // Templates mit Items zusammenführen
      const templatesWithItems: TemplateWithItems[] = (templatesData || []).map((template: Template) => ({
        ...template,
        items: (itemsData || []).filter((item: TemplateItem) => item.template_id === template.id),
      }));

      setTemplates(templatesWithItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Vorlagen');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial laden
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Template erstellen
  const createTemplate = useCallback(async (templateData: Omit<TemplateInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await (supabase as SupabaseAny).auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const { data, error: insertError } = await (supabase as SupabaseAny)
        .from('templates')
        .insert({ ...templateData, user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;

      const newTemplate: TemplateWithItems = { ...data, items: [] };
      setTemplates(prev => [...prev, newTemplate].sort((a, b) => a.name.localeCompare(b.name)));
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
      throw err;
    }
  }, [supabase]);

  // Template aktualisieren
  const updateTemplate = useCallback(async (id: string, updates: Partial<TemplateInsert>) => {
    try {
      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTemplates(prev =>
        prev
          .map(t => (t.id === id ? { ...t, ...data } : t))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  // Template löschen
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('templates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
      throw err;
    }
  }, [supabase]);

  // Item zu Template hinzufügen
  const addTemplateItem = useCallback(async (templateId: string, itemData: Omit<TemplateItemInsert, 'template_id'>) => {
    try {
      // Aktuelle höchste sort_order finden
      const template = templates.find(t => t.id === templateId);
      const maxOrder = template?.items.reduce((max, item) => Math.max(max, item.sort_order), -1) ?? -1;

      const { data, error: insertError } = await (supabase as SupabaseAny)
        .from('template_items')
        .insert({
          ...itemData,
          template_id: templateId,
          sort_order: maxOrder + 1,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTemplates(prev =>
        prev.map(t =>
          t.id === templateId
            ? { ...t, items: [...t.items, data] }
            : t
        )
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen');
      throw err;
    }
  }, [supabase, templates]);

  // Item aktualisieren
  const updateTemplateItem = useCallback(async (itemId: string, updates: Partial<TemplateItemInsert>) => {
    try {
      const { data, error: updateError } = await (supabase as SupabaseAny)
        .from('template_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      setTemplates(prev =>
        prev.map(t => ({
          ...t,
          items: t.items.map(item => (item.id === itemId ? data : item)),
        }))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
      throw err;
    }
  }, [supabase]);

  // Item löschen
  const deleteTemplateItem = useCallback(async (itemId: string) => {
    try {
      const { error: deleteError } = await (supabase as SupabaseAny)
        .from('template_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      setTemplates(prev =>
        prev.map(t => ({
          ...t,
          items: t.items.filter(item => item.id !== itemId),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
      throw err;
    }
  }, [supabase]);

  // Template nach ID holen
  const getTemplateById = useCallback((id: string) => {
    return templates.find(t => t.id === id);
  }, [templates]);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addTemplateItem,
    updateTemplateItem,
    deleteTemplateItem,
    getTemplateById,
    refresh: fetchTemplates,
  };
}
