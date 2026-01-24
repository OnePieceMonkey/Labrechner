-- ################################################
-- Migration 006: ERP-Tabellen für MVP
-- Tabellen: clients, custom_positions, templates, invoices
-- ################################################

-- ================================================
-- 1. CLIENTS (Kundenverwaltung)
-- ================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_number TEXT,
  salutation TEXT,
  title TEXT,
  first_name TEXT,
  last_name TEXT NOT NULL,
  practice_name TEXT,
  street TEXT,
  house_number TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Deutschland',
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own clients" ON clients
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own clients" ON clients
  FOR DELETE USING (user_id = auth.uid());

-- Index für clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_customer_number ON clients(user_id, customer_number);

-- ================================================
-- 2. CUSTOM_POSITIONS (Eigene BEL-Positionen)
-- ================================================

CREATE TABLE IF NOT EXISTS custom_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_price NUMERIC(10,2) DEFAULT 0,
  vat_rate NUMERIC(5,2) DEFAULT 19.00,
  is_material BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, position_code)
);

-- RLS für custom_positions
ALTER TABLE custom_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom_positions" ON custom_positions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own custom_positions" ON custom_positions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own custom_positions" ON custom_positions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own custom_positions" ON custom_positions
  FOR DELETE USING (user_id = auth.uid());

-- Index für custom_positions
CREATE INDEX IF NOT EXISTS idx_custom_positions_user_id ON custom_positions(user_id);

-- ================================================
-- 3. TEMPLATES (Vorlagen)
-- ================================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates" ON templates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own templates" ON templates
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own templates" ON templates
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own templates" ON templates
  FOR DELETE USING (user_id = auth.uid());

-- Index für templates
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);

-- ================================================
-- 4. TEMPLATE_ITEMS (Vorlagen-Positionen)
-- ================================================

CREATE TABLE IF NOT EXISTS template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES bel_positions(id),
  custom_position_id UUID REFERENCES custom_positions(id),
  quantity NUMERIC(10,2) DEFAULT 1,
  factor NUMERIC(5,2) DEFAULT 1.0,
  custom_price NUMERIC(10,2),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für template_items
ALTER TABLE template_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own template_items" ON template_items
  FOR SELECT USING (
    template_id IN (SELECT id FROM templates WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create their own template_items" ON template_items
  FOR INSERT WITH CHECK (
    template_id IN (SELECT id FROM templates WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own template_items" ON template_items
  FOR UPDATE USING (
    template_id IN (SELECT id FROM templates WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own template_items" ON template_items
  FOR DELETE USING (
    template_id IN (SELECT id FROM templates WHERE user_id = auth.uid())
  );

-- Index für template_items
CREATE INDEX IF NOT EXISTS idx_template_items_template_id ON template_items(template_id);

-- ================================================
-- 5. INVOICES (Rechnungen)
-- ================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_snapshot JSONB,
  lab_snapshot JSONB,
  kzv_id INTEGER REFERENCES kzv_regions(id),
  labor_type TEXT DEFAULT 'gewerbe' CHECK (labor_type IN ('gewerbe', 'praxis')),
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 19.00,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  -- MwSt-Trennung (7% / 19%)
  total_net_7 NUMERIC(10,2) DEFAULT 0,
  total_vat_7 NUMERIC(10,2) DEFAULT 0,
  total_net_19 NUMERIC(10,2) DEFAULT 0,
  total_vat_19 NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, invoice_number)
);

-- RLS für invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own invoices" ON invoices
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own invoices" ON invoices
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own invoices" ON invoices
  FOR DELETE USING (user_id = auth.uid());

-- Index für invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(user_id, invoice_date DESC);

-- ================================================
-- 6. INVOICE_ITEMS (Rechnungspositionen)
-- ================================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES bel_positions(id),
  custom_position_id UUID REFERENCES custom_positions(id),
  position_code TEXT NOT NULL,
  position_name TEXT NOT NULL,
  position_description TEXT,
  quantity NUMERIC(10,2) DEFAULT 1,
  factor NUMERIC(5,2) DEFAULT 1.0,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für invoice_items
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoice_items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create their own invoice_items" ON invoice_items
  FOR INSERT WITH CHECK (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own invoice_items" ON invoice_items
  FOR UPDATE USING (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own invoice_items" ON invoice_items
  FOR DELETE USING (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

-- Index für invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ================================================
-- 7. SHARED_LINKS (Magic-Link Sharing für Rechnungen)
-- ================================================

CREATE TABLE IF NOT EXISTS shared_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS für shared_links
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their shared_links" ON shared_links
  FOR ALL USING (
    invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
  );

CREATE POLICY "Public access via valid token" ON shared_links
  FOR SELECT USING (
    expires_at > NOW() AND access_count < max_access_count
  );

-- Index für shared_links
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_links(token);
CREATE INDEX IF NOT EXISTS idx_shared_links_invoice_id ON shared_links(invoice_id);

-- ================================================
-- TRIGGER für updated_at
-- ================================================

-- Funktion existiert bereits aus Migration 005, aber sicherstellen
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für alle Tabellen mit updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_positions_updated_at
  BEFORE UPDATE ON custom_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ################################################
-- FERTIG - Alle ERP-Tabellen erstellt
-- ################################################
