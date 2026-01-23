"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserSettings } from "@/types/database";

interface UseUserReturn {
  user: User | null;
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Lade User und Settings
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Hole aktuellen User
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        setUser(currentUser);

        if (currentUser) {
          // Hole User Settings
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
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Benutzer konnte nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSettings(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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
          ...settings,
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
    updateSettings,
  };
}
