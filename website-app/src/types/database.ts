/**
 * TypeScript Types für Supabase Database
 * Generiert aus dem Datenbank-Schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      kzv_regions: {
        Row: {
          id: number;
          code: string;
          name: string;
          bundesland: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          bundesland: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          bundesland?: string;
          created_at?: string;
        };
      };
      bel_groups: {
        Row: {
          id: number;
          group_number: number;
          name: string;
          description: string | null;
          position_range: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          group_number: number;
          name: string;
          description?: string | null;
          position_range?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          group_number?: number;
          name?: string;
          description?: string | null;
          position_range?: string | null;
          created_at?: string;
        };
      };
      bel_positions: {
        Row: {
          id: number;
          position_code: string;
          name: string;
          description: string | null;
          group_id: number | null;
          is_ukps: boolean;
          is_implant: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          position_code: string;
          name: string;
          description?: string | null;
          group_id?: number | null;
          is_ukps?: boolean;
          is_implant?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          position_code?: string;
          name?: string;
          description?: string | null;
          group_id?: number | null;
          is_ukps?: boolean;
          is_implant?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bel_prices: {
        Row: {
          id: number;
          position_id: number;
          kzv_id: number;
          labor_type: "gewerbe" | "praxis";
          price: number;
          valid_from: string;
          valid_until: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          position_id: number;
          kzv_id: number;
          labor_type: "gewerbe" | "praxis";
          price: number;
          valid_from?: string;
          valid_until?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          position_id?: number;
          kzv_id?: number;
          labor_type?: "gewerbe" | "praxis";
          price?: number;
          valid_from?: string;
          valid_until?: string | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          kzv_id: number | null;
          labor_type: "gewerbe" | "praxis";
          private_factor: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          private_factor?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          private_factor?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          labor_name: string | null;
          bundesland: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          labor_name?: string | null;
          bundesland?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          labor_name?: string | null;
          bundesland?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      search_bel_positions: {
        Args: {
          search_query: string;
          user_kzv_id?: number | null;
          user_labor_type?: string;
          group_filter?: number | null;
          result_limit?: number;
        };
        Returns: {
          id: number;
          position_code: string;
          name: string;
          description: string | null;
          group_id: number | null;
          group_name: string | null;
          price: number | null;
          is_ukps: boolean;
          is_implant: boolean;
          rank: number;
        }[];
      };
      get_position_prices: {
        Args: {
          pos_code: string;
          labor?: string;
        };
        Returns: {
          kzv_code: string;
          kzv_name: string;
          bundesland: string;
          price: number;
        }[];
      };
    };
  };
}

// Convenience Types
export type KzvRegion = Database["public"]["Tables"]["kzv_regions"]["Row"];
export type BelGroup = Database["public"]["Tables"]["bel_groups"]["Row"];
export type BelPosition = Database["public"]["Tables"]["bel_positions"]["Row"];
export type BelPrice = Database["public"]["Tables"]["bel_prices"]["Row"];
export type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];

// Search Result Type
export type BelSearchResult =
  Database["public"]["Functions"]["search_bel_positions"]["Returns"][number];
