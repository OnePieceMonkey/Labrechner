/**
 * ERP Types für Labrechner
 * Extrahiert aus V3 AppView.tsx
 */

// ============================================
// Core Data Types
// ============================================

export interface BELPosition {
  id: string;
  db_id?: number;
  position_code?: string;
  name: string;
  price: number;
  group: string;
}

export interface CustomPosition {
  id: string;
  name: string;
  price: number;
  vat_rate?: number;
}

export interface TemplateItem {
  id: string;
  isAi: boolean;
  quantity: number;
  factor?: number;
}

export interface Template {
  id: number;
  name: string;
  items: TemplateItem[];
  factor: number;
}

// ============================================
// Client / Recipient Types
// ============================================

export interface Recipient {
  id: string;
  customerNumber: string;
  salutation: string;
  title: string;
  firstName: string;
  lastName: string;
  practiceName: string;
  street: string;
  zip: string;
  city: string;
  email?: string;
}

// ============================================
// User / Lab Settings
// ============================================

export interface UserSettings {
  name: string;
  labName: string;
  labEmail?: string;
  street: string;
  zip: string;
  city: string;
  taxId: string;
  nextInvoiceNumber: string;
  bankName: string;
  iban: string;
  bic: string;
  logoUrl: string | null;
  jurisdiction: string;
}

// ============================================
// Invoice Types
// ============================================

export interface InvoicePreview {
  items: TemplateItem[];
  name: string;
  factor: number;
}

export interface FinalInvoice {
  recipient: Recipient;
  items: TemplateItem[];
  factor: number;
  invoiceNumber: string;
  date: string;
}

// ============================================
// Filter / UI Types
// ============================================

export type TabType = 'search' | 'favorites' | 'templates' | 'clients' | 'invoices' | 'settings';
export type LabType = 'gewerbe' | 'praxis';

export interface BELGroup {
  id: string;
  label: string;
}

// ============================================
// Constants
// ============================================

export const BEL_GROUPS: BELGroup[] = [
  { id: 'all', label: 'Alle Gruppen' },
  { id: 'custom', label: '⭐ Eigenpositionen' },
  { id: '1', label: '001-032 Modelle & Hilfsmittel' },
  { id: '2', label: '101-165 Kronen & Brücken' },
  { id: '3', label: '201-213 Metallbasis / Modellguss' },
  { id: '4', label: '301-382 Verblendungen' },
  { id: '5', label: '401-413 Schienen & Behelfe' },
  { id: '6', label: '501-521 UKPS' },
  { id: '7', label: '701-751 KFO' },
  { id: '8', label: '801-815 Reparaturen' },
];

// Default Settings
export const DEFAULT_USER_SETTINGS: UserSettings = {
  name: '',
  labName: '',
  street: '',
  zip: '',
  city: '',
  taxId: '',
  nextInvoiceNumber: '2026-1001',
  bankName: '',
  iban: '',
  bic: '',
  logoUrl: null,
  jurisdiction: '',
};

export const DEFAULT_RECIPIENT: Partial<Recipient> = {
  salutation: 'Herr',
  customerNumber: '',
};
