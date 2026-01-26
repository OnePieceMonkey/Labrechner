"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserSettings, UserRole } from "@/types/database";

// Helper Functions für Role-Checks
export const isAdmin = (settings: UserSettings | null): boolean =>
  settings?.role === "admin";

export const isBetaTester = (settings: UserSettings | null): boolean =>
  settings?.role === "beta_tester";

export const hasBetaAccess = (settings: UserSettings | null): boolean =>
  settings?.role === "admin" || settings?.role === "beta_tester";

export const hasRole = (
  settings: UserSettings | null,
  role: UserRole
): boolean => settings?.role === role;

// Prüft ob User alle Subscription-Limits überspringen kann
export const canBypassLimits = (settings: UserSettings | null): boolean =>
  settings?.role === "admin";

interface UseUserReturn {
  user: User | null;
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  hasBetaAccess: boolean;
  canBypassLimits: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadSettings = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setSettings(null);
      return;
    }

    const { data: userSettings, error: settingsError } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .single();

    if (settingsError && settingsError.code !== "PGRST116") {
      // PGRST116 = no rows returned (OK für neue User)
      throw settingsError;
    }

    setSettings(userSettings);
  }, [supabase]);

  // Lade User und Settings
  useEffect(() => {
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("useUser loading timed out - forcing loading completion");
        setIsLoading(false);
      }
    }, 5000);

    const loadUser = async () => {
      try {
        // Hole aktuellen User
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (mounted) {
          setUser(currentUser);
          await loadSettings(currentUser);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        if (mounted) setError("Benutzer konnte nicht geladen werden.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadUser();

    // Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setIsLoading(true); // Temporär loading anzeigen beim Wechsel
      try {
        await loadSettings(session?.user ?? null);
      } catch (err) {
        console.error("Error loading user settings:", err);
        setError("Benutzereinstellungen konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [supabase, loadSettings]);

  // Update Settings
  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) {
      setError("Nicht angemeldet.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from("user_settings")
        .upsert({
          user_id: user.id,
          ...(settings ?? {}),
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setSettings(data as UserSettings);
    } catch (err) {
      console.error("Error updating settings:", err);
      setError("Einstellungen konnten nicht gespeichert werden.");
      throw err;
    }
  };

  return {
    user,
    settings,
    isLoading,
    error,
    isAdmin: isAdmin(settings),
    hasBetaAccess: hasBetaAccess(settings),
    canBypassLimits: canBypassLimits(settings),
    updateSettings,
  };
}
