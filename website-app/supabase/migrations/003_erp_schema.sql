-- ============================================
-- Labrechner - ERP-Erweiterung Schema
-- Version: 3.0
-- Datum: Januar 2025
-- Phase 2: Favorites, Templates, Clients, Invoices
-- ============================================

-- ============================================
-- 1. FAVORITEN
-- ============================================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, position_id)
);

-- Index für schnellen Zugriff
CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites(user_id);

-- RLS: Nur eigene Favoriten
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. KUNDEN/ZAHNÄRZTE (Recipients)
-- ============================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Identifikation
  customer_number VARCHAR(50),               -- Kundennummer

  -- Anrede & Name
  salutation VARCHAR(20),                    -- Herr/Frau/Dr./Prof.
  title VARCHAR(50),                         -- Akademischer Titel
  first_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,

  -- Praxis
  practice_name VARCHAR(200),                -- Praxisname

  -- Adresse
  street VARCHAR(200),
  house_number VARCHAR(20),
  postal_code VARCHAR(10),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Deutschland',

  -- Kontakt
  phone VARCHAR(50),
  email VARCHAR(255),

  -- Notizen
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes
CREATE INDEX IF NOT EXISTS clients_user_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients(last_name, first_name);
CREATE INDEX IF NOT EXISTS clients_customer_number_idx ON clients(customer_number);

-- RLS: Nur eigene Kunden
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger für updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. EIGENE POSITIONEN
-- ============================================

CREATE TABLE IF NOT EXISTS custom_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  position_code VARCHAR(20) NOT NULL,        -- z.B. "E001" für Eigenposition
  name VARCHAR(255) NOT NULL,
  description TEXT,
  default_price DECIMAL(10, 2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, position_code)
);

-- Index
CREATE INDEX IF NOT EXISTS custom_positions_user_idx ON custom_positions(user_id);

-- RLS
ALTER TABLE custom_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom positions" ON custom_positions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom positions" ON custom_positions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom positions" ON custom_positions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom positions" ON custom_positions
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_custom_positions_updated_at
  BEFORE UPDATE ON custom_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. TEMPLATES (Vorlagen)
-- ============================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Metadata
  icon VARCHAR(50),                          -- Emoji oder Icon-Name
  color VARCHAR(20),                         -- Hex-Farbe

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS templates_user_idx ON templates(user_id);

-- RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates" ON templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. TEMPLATE ITEMS (Positionen in Templates)
-- ============================================

CREATE TABLE IF NOT EXISTS template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,

  -- Entweder BEL-Position oder Custom-Position
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE SET NULL,
  custom_position_id UUID REFERENCES custom_positions(id) ON DELETE SET NULL,

  -- Überschreibbare Werte
  quantity INTEGER DEFAULT 1,
  factor DECIMAL(4, 2) DEFAULT 1.00,         -- z.B. 2.3 Faktor
  custom_price DECIMAL(10, 2),               -- Überschreibt BEL-Preis
  notes TEXT,

  -- Sortierung
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Mindestens eine Position muss gesetzt sein
  CONSTRAINT template_item_has_position
    CHECK (position_id IS NOT NULL OR custom_position_id IS NOT NULL)
);

-- Indizes
CREATE INDEX IF NOT EXISTS template_items_template_idx ON template_items(template_id);
CREATE INDEX IF NOT EXISTS template_items_position_idx ON template_items(position_id);
CREATE INDEX IF NOT EXISTS template_items_custom_idx ON template_items(custom_position_id);

-- RLS (über Parent Template)
ALTER TABLE template_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own template items" ON template_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM templates t
      WHERE t.id = template_items.template_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own template items" ON template_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM templates t
      WHERE t.id = template_items.template_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own template items" ON template_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM templates t
      WHERE t.id = template_items.template_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own template items" ON template_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM templates t
      WHERE t.id = template_items.template_id
      AND t.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. RECHNUNGEN (Invoices)
-- ============================================

-- Status-ENUM
DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Rechnungsnummer
  invoice_number VARCHAR(50) NOT NULL,

  -- Kunde
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Snapshot der Kundendaten zum Zeitpunkt der Rechnung
  client_snapshot JSONB,

  -- Labordaten Snapshot
  lab_snapshot JSONB,

  -- KZV & Labortyp zum Zeitpunkt der Rechnung
  kzv_id INTEGER REFERENCES kzv_regions(id),
  labor_type VARCHAR(20) DEFAULT 'gewerbe',

  -- Daten
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,

  -- Status
  status invoice_status DEFAULT 'draft',

  -- Beträge (werden bei Speichern berechnet)
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_rate DECIMAL(4, 2) DEFAULT 19.00,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,

  -- Optionale Felder
  notes TEXT,
  internal_notes TEXT,

  -- PDF
  pdf_url TEXT,
  pdf_generated_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Indizes
CREATE INDEX IF NOT EXISTS invoices_user_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_client_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_date_idx ON invoices(invoice_date DESC);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 7. RECHNUNGSPOSITIONEN (Invoice Items)
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,

  -- Referenz zur Position (optional, kann gelöscht werden)
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE SET NULL,
  custom_position_id UUID REFERENCES custom_positions(id) ON DELETE SET NULL,

  -- Snapshot der Position (unveränderlich nach Erstellung)
  position_code VARCHAR(20) NOT NULL,
  position_name VARCHAR(255) NOT NULL,
  position_description TEXT,

  -- Mengen & Preise
  quantity INTEGER DEFAULT 1,
  factor DECIMAL(4, 2) DEFAULT 1.00,
  unit_price DECIMAL(10, 2) NOT NULL,        -- Basispreis pro Einheit
  line_total DECIMAL(12, 2) NOT NULL,        -- quantity * factor * unit_price

  -- Notizen
  notes TEXT,

  -- Sortierung
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes
CREATE INDEX IF NOT EXISTS invoice_items_invoice_idx ON invoice_items(invoice_id);

-- RLS (über Parent Invoice)
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_items.invoice_id
      AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_items.invoice_id
      AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_items.invoice_id
      AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own invoice items" ON invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_items.invoice_id
      AND i.user_id = auth.uid()
    )
  );

-- ============================================
-- 8. ERWEITERTE USER SETTINGS
-- ============================================

-- Spalten hinzufügen falls nicht vorhanden
DO $$
BEGIN
  -- Labor-Stammdaten
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_name') THEN
    ALTER TABLE user_settings ADD COLUMN lab_name VARCHAR(200);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_street') THEN
    ALTER TABLE user_settings ADD COLUMN lab_street VARCHAR(200);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_house_number') THEN
    ALTER TABLE user_settings ADD COLUMN lab_house_number VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_postal_code') THEN
    ALTER TABLE user_settings ADD COLUMN lab_postal_code VARCHAR(10);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_city') THEN
    ALTER TABLE user_settings ADD COLUMN lab_city VARCHAR(100);
  END IF;

  -- Steuer & Recht
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'tax_id') THEN
    ALTER TABLE user_settings ADD COLUMN tax_id VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'vat_id') THEN
    ALTER TABLE user_settings ADD COLUMN vat_id VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'jurisdiction') THEN
    ALTER TABLE user_settings ADD COLUMN jurisdiction VARCHAR(100);
  END IF;

  -- Bank
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'bank_name') THEN
    ALTER TABLE user_settings ADD COLUMN bank_name VARCHAR(200);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'iban') THEN
    ALTER TABLE user_settings ADD COLUMN iban VARCHAR(34);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'bic') THEN
    ALTER TABLE user_settings ADD COLUMN bic VARCHAR(11);
  END IF;

  -- Logo
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'logo_url') THEN
    ALTER TABLE user_settings ADD COLUMN logo_url TEXT;
  END IF;

  -- Rechnungsnummer
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'next_invoice_number') THEN
    ALTER TABLE user_settings ADD COLUMN next_invoice_number INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'invoice_prefix') THEN
    ALTER TABLE user_settings ADD COLUMN invoice_prefix VARCHAR(20) DEFAULT 'RE-';
  END IF;

  -- Global Factor
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'global_factor') THEN
    ALTER TABLE user_settings ADD COLUMN global_factor DECIMAL(4, 2) DEFAULT 1.00;
  END IF;

  -- Zahlungsziel
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'default_payment_days') THEN
    ALTER TABLE user_settings ADD COLUMN default_payment_days INTEGER DEFAULT 14;
  END IF;

END $$;

-- ============================================
-- 9. HILFSFUNKTIONEN
-- ============================================

-- Funktion: Nächste Rechnungsnummer generieren
CREATE OR REPLACE FUNCTION generate_invoice_number(p_user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_prefix VARCHAR;
  v_number INTEGER;
  v_result VARCHAR;
BEGIN
  -- Hole aktuelle Einstellungen
  SELECT invoice_prefix, next_invoice_number
  INTO v_prefix, v_number
  FROM user_settings
  WHERE user_id = p_user_id;

  -- Default falls nicht vorhanden
  IF v_prefix IS NULL THEN v_prefix := 'RE-'; END IF;
  IF v_number IS NULL THEN v_number := 1; END IF;

  -- Generiere Nummer mit Jahr
  v_result := v_prefix || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(v_number::TEXT, 4, '0');

  -- Inkrementiere Nummer
  UPDATE user_settings
  SET next_invoice_number = v_number + 1
  WHERE user_id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Rechnung Beträge neu berechnen
CREATE OR REPLACE FUNCTION recalculate_invoice_totals(p_invoice_id UUID)
RETURNS VOID AS $$
DECLARE
  v_subtotal DECIMAL(12, 2);
  v_tax_rate DECIMAL(4, 2);
  v_tax_amount DECIMAL(12, 2);
  v_total DECIMAL(12, 2);
BEGIN
  -- Hole Steuersatz
  SELECT tax_rate INTO v_tax_rate FROM invoices WHERE id = p_invoice_id;
  IF v_tax_rate IS NULL THEN v_tax_rate := 19.00; END IF;

  -- Berechne Subtotal
  SELECT COALESCE(SUM(line_total), 0) INTO v_subtotal
  FROM invoice_items
  WHERE invoice_id = p_invoice_id;

  -- Berechne Steuer
  v_tax_amount := ROUND(v_subtotal * (v_tax_rate / 100), 2);
  v_total := v_subtotal + v_tax_amount;

  -- Update Invoice
  UPDATE invoices
  SET subtotal = v_subtotal,
      tax_amount = v_tax_amount,
      total = v_total,
      updated_at = NOW()
  WHERE id = p_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Automatisch Beträge neu berechnen
CREATE OR REPLACE FUNCTION trigger_recalculate_invoice()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM recalculate_invoice_totals(OLD.invoice_id);
    RETURN OLD;
  ELSE
    PERFORM recalculate_invoice_totals(NEW.invoice_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoice_items_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_invoice();

-- ============================================
-- 10. VIEWS FÜR DASHBOARDS
-- ============================================

-- View: Rechnungsübersicht mit Kunde
CREATE OR REPLACE VIEW invoice_overview AS
SELECT
  i.id,
  i.user_id,
  i.invoice_number,
  i.invoice_date,
  i.due_date,
  i.status,
  i.total,
  c.id AS client_id,
  c.last_name,
  c.first_name,
  c.practice_name,
  (
    SELECT COUNT(*) FROM invoice_items ii WHERE ii.invoice_id = i.id
  ) AS item_count
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id;

-- View: Monatliche Umsätze
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  user_id,
  DATE_TRUNC('month', invoice_date) AS month,
  COUNT(*) AS invoice_count,
  SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) AS paid_total,
  SUM(CASE WHEN status IN ('sent', 'overdue') THEN total ELSE 0 END) AS pending_total,
  SUM(total) AS total_revenue
FROM invoices
WHERE status != 'cancelled'
GROUP BY user_id, DATE_TRUNC('month', invoice_date)
ORDER BY month DESC;
