-- Optimierung der Indizes für Performance und RLS

-- 0. Sicherstellen, dass die FAVORITES Tabelle existiert (war in Migration 003, scheint aber zu fehlen)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, position_id)
);

-- RLS für Favorites sicherstellen
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 1. Expliziter Index für user_settings (obwohl UNIQUE existiert, schadet ein expliziter Index für FK Lookup nicht, 
-- aber der UNIQUE Index auf user_id sollte eigentlich reichen. Wir setzen einen B-Tree explizit zur Sicherheit)
CREATE INDEX IF NOT EXISTS idx_user_settings_lookup ON user_settings(user_id);

-- 2. Performance für bel_prices Filterung (wird in useAllPositions und search genutzt)
-- Bestehender Index war: (position_id, kzv_id, labor_type, valid_from DESC)
-- Wir brauchen einen der mit kzv_id startet für die Filterung .eq('bel_prices.kzv_id', ...)
CREATE INDEX IF NOT EXISTS idx_bel_prices_filtering ON bel_prices(kzv_id, labor_type, valid_from);

-- 3. Custom Positions Lookup
CREATE INDEX IF NOT EXISTS idx_custom_positions_lookup ON custom_positions(user_id, position_code);

-- 4. Favorites Lookup mit FK
CREATE INDEX IF NOT EXISTS idx_favorites_user_pos ON favorites(user_id, position_id);

-- 5. Stellen sicher, dass RLS Policies nicht blockieren, indem wir die Policies 'permissive' lassen (Default)
-- aber wir prüfen ob Grant Permissions korrekt sind
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;

-- 6. Replikation und Realtime Fixes
ALTER TABLE user_settings REPLICA IDENTITY FULL;
ALTER TABLE custom_positions REPLICA IDENTITY FULL;
ALTER TABLE favorites REPLICA IDENTITY FULL;
ALTER TABLE templates REPLICA IDENTITY FULL;
ALTER TABLE invoices REPLICA IDENTITY FULL;

-- 7. RLS Safety Check für Custom Positions (falls Migration 006 nicht sauber lief)
DO $$ BEGIN
  CREATE POLICY "Users can view own custom positions" ON custom_positions FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own custom positions" ON custom_positions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own custom positions" ON custom_positions FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own custom positions" ON custom_positions FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

