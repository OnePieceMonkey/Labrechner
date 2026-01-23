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
          // Lab-Stammdaten
          lab_name: string | null;
          lab_street: string | null;
          lab_house_number: string | null;
          lab_postal_code: string | null;
          lab_city: string | null;
          // Steuer & Recht
          tax_id: string | null;
          vat_id: string | null;
          jurisdiction: string | null;
          // Bank
          bank_name: string | null;
          iban: string | null;
          bic: string | null;
          // Logo
          logo_url: string | null;
          // Rechnung
          next_invoice_number: number;
          invoice_prefix: string;
          global_factor: number;
          default_payment_days: number;
          // Timestamps
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          private_factor?: number;
          lab_name?: string | null;
          lab_street?: string | null;
          lab_house_number?: string | null;
          lab_postal_code?: string | null;
          lab_city?: string | null;
          tax_id?: string | null;
          vat_id?: string | null;
          jurisdiction?: string | null;
          bank_name?: string | null;
          iban?: string | null;
          bic?: string | null;
          logo_url?: string | null;
          next_invoice_number?: number;
          invoice_prefix?: string;
          global_factor?: number;
          default_payment_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          private_factor?: number;
          lab_name?: string | null;
          lab_street?: string | null;
          lab_house_number?: string | null;
          lab_postal_code?: string | null;
          lab_city?: string | null;
          tax_id?: string | null;
          vat_id?: string | null;
          jurisdiction?: string | null;
          bank_name?: string | null;
          iban?: string | null;
          bic?: string | null;
          logo_url?: string | null;
          next_invoice_number?: number;
          invoice_prefix?: string;
          global_factor?: number;
          default_payment_days?: number;
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
      favorites: {
        Row: {
          id: string;
          user_id: string;
          position_id: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          position_id: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          position_id?: number;
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          customer_number: string | null;
          salutation: string | null;
          title: string | null;
          first_name: string | null;
          last_name: string;
          practice_name: string | null;
          street: string | null;
          house_number: string | null;
          postal_code: string | null;
          city: string | null;
          country: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_number?: string | null;
          salutation?: string | null;
          title?: string | null;
          first_name?: string | null;
          last_name: string;
          practice_name?: string | null;
          street?: string | null;
          house_number?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_number?: string | null;
          salutation?: string | null;
          title?: string | null;
          first_name?: string | null;
          last_name?: string;
          practice_name?: string | null;
          street?: string | null;
          house_number?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      custom_positions: {
        Row: {
          id: string;
          user_id: string;
          position_code: string;
          name: string;
          description: string | null;
          default_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          position_code: string;
          name: string;
          description?: string | null;
          default_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          position_code?: string;
          name?: string;
          description?: string | null;
          default_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      template_items: {
        Row: {
          id: string;
          template_id: string;
          position_id: number | null;
          custom_position_id: string | null;
          quantity: number;
          factor: number;
          custom_price: number | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          position_id?: number | null;
          custom_position_id?: string | null;
          quantity?: number;
          factor?: number;
          custom_price?: number | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          position_id?: number | null;
          custom_position_id?: string | null;
          quantity?: number;
          factor?: number;
          custom_price?: number | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          invoice_number: string;
          client_id: string | null;
          client_snapshot: Json | null;
          lab_snapshot: Json | null;
          kzv_id: number | null;
          labor_type: "gewerbe" | "praxis";
          invoice_date: string;
          due_date: string | null;
          status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total: number;
          notes: string | null;
          internal_notes: string | null;
          pdf_url: string | null;
          pdf_generated_at: string | null;
          created_at: string;
          updated_at: string;
          sent_at: string | null;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_number: string;
          client_id?: string | null;
          client_snapshot?: Json | null;
          lab_snapshot?: Json | null;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          invoice_date?: string;
          due_date?: string | null;
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          internal_notes?: string | null;
          pdf_url?: string | null;
          pdf_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
          sent_at?: string | null;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_number?: string;
          client_id?: string | null;
          client_snapshot?: Json | null;
          lab_snapshot?: Json | null;
          kzv_id?: number | null;
          labor_type?: "gewerbe" | "praxis";
          invoice_date?: string;
          due_date?: string | null;
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          internal_notes?: string | null;
          pdf_url?: string | null;
          pdf_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
          sent_at?: string | null;
          paid_at?: string | null;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          position_id: number | null;
          custom_position_id: string | null;
          position_code: string;
          position_name: string;
          position_description: string | null;
          quantity: number;
          factor: number;
          unit_price: number;
          line_total: number;
          notes: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          position_id?: number | null;
          custom_position_id?: string | null;
          position_code: string;
          position_name: string;
          position_description?: string | null;
          quantity?: number;
          factor?: number;
          unit_price: number;
          line_total: number;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          position_id?: number | null;
          custom_position_id?: string | null;
          position_code?: string;
          position_name?: string;
          position_description?: string | null;
          quantity?: number;
          factor?: number;
          unit_price?: number;
          line_total?: number;
          notes?: string | null;
          sort_order?: number;
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

// ERP Types
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type CustomPosition = Database["public"]["Tables"]["custom_positions"]["Row"];
export type Template = Database["public"]["Tables"]["templates"]["Row"];
export type TemplateItem = Database["public"]["Tables"]["template_items"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];

// Insert Types
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"];
export type TemplateItemInsert = Database["public"]["Tables"]["template_items"]["Insert"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceItemInsert = Database["public"]["Tables"]["invoice_items"]["Insert"];

// Status Types
export type InvoiceStatus = Invoice["status"];

// Search Result Type
export type BelSearchResult =
  Database["public"]["Functions"]["search_bel_positions"]["Returns"][number];
