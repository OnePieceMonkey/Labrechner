-- ============================================
-- Labrechner - Initiales Datenbank-Schema
-- Version: 1.0
-- Datum: Januar 2025
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================

-- Trigram für Fuzzy-Suche
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- 2. TABELLEN
-- ============================================

-- KZV-Regionen (17 Stück)
CREATE TABLE IF NOT EXISTS kzv_regions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,        -- z.B. "KZVB", "KZVNR"
  name VARCHAR(100) NOT NULL,              -- z.B. "KZV Bayern"
  bundesland VARCHAR(50) NOT NULL,         -- z.B. "Bayern"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BEL-Gruppen (8 Hauptgruppen)
CREATE TABLE IF NOT EXISTS bel_groups (
  id SERIAL PRIMARY KEY,
  group_number INTEGER UNIQUE NOT NULL,    -- 0-8 (ohne 6)
  name VARCHAR(100) NOT NULL,              -- z.B. "Modelle & Hilfsmittel"
  description TEXT,
  position_range VARCHAR(20),              -- z.B. "001-032"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BEL-Positionen (~155 Leistungen)
CREATE TABLE IF NOT EXISTS bel_positions (
  id SERIAL PRIMARY KEY,
  position_code VARCHAR(10) NOT NULL,      -- z.B. "0010", "1021"
  name VARCHAR(255) NOT NULL,              -- z.B. "Vollkrone/Metall"
  description TEXT,
  group_id INTEGER REFERENCES bel_groups(id),
  is_ukps BOOLEAN DEFAULT FALSE,           -- UKPS-Variante (Suffix 5)
  is_implant BOOLEAN DEFAULT FALSE,        -- Implantatversorgung (Suffix 8)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(position_code)
);

-- BEL-Preise (pro Position, KZV und Labortyp)
CREATE TABLE IF NOT EXISTS bel_prices (
  id SERIAL PRIMARY KEY,
  position_id INTEGER REFERENCES bel_positions(id) ON DELETE CASCADE,
  kzv_id INTEGER REFERENCES kzv_regions(id) ON DELETE CASCADE,
  labor_type VARCHAR(20) NOT NULL CHECK (labor_type IN ('gewerbe', 'praxis')),
  price DECIMAL(10, 2) NOT NULL,
  valid_from DATE NOT NULL DEFAULT '2026-01-01',
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(position_id, kzv_id, labor_type, valid_from)
);

-- Benutzereinstellungen
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  kzv_id INTEGER REFERENCES kzv_regions(id),
  labor_type VARCHAR(20) DEFAULT 'gewerbe' CHECK (labor_type IN ('gewerbe', 'praxis')),
  private_factor DECIMAL(3, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warteliste für Beta
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  labor_name VARCHAR(200),
  bundesland VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INDIZES
-- ============================================

-- Full-Text Search Index für deutsche Sprache
CREATE INDEX IF NOT EXISTS bel_positions_search_idx
  ON bel_positions USING GIN (to_tsvector('german', name || ' ' || COALESCE(description, '')));

-- Trigram Index für Fuzzy-Suche
CREATE INDEX IF NOT EXISTS bel_positions_trgm_idx
  ON bel_positions USING GIN (name gin_trgm_ops);

-- Index für Position-Code Suche
CREATE INDEX IF NOT EXISTS bel_positions_code_idx
  ON bel_positions (position_code);

-- Index für schnelle Preisabfragen
CREATE INDEX IF NOT EXISTS bel_prices_lookup_idx
  ON bel_prices (position_id, kzv_id, labor_type, valid_from DESC);

-- Index für Gruppen-Filter
CREATE INDEX IF NOT EXISTS bel_positions_group_idx
  ON bel_positions (group_id);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- BEL-Daten: Öffentlich lesbar
ALTER TABLE kzv_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "KZV regions are public" ON kzv_regions
  FOR SELECT USING (true);

CREATE POLICY "BEL groups are public" ON bel_groups
  FOR SELECT USING (true);

CREATE POLICY "BEL positions are public" ON bel_positions
  FOR SELECT USING (true);

CREATE POLICY "BEL prices are public" ON bel_prices
  FOR SELECT USING (true);

-- User Settings: Nur eigene Daten
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Waitlist: Jeder kann sich eintragen
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. FUNKTIONEN
-- ============================================

-- Such-Funktion für BEL-Positionen
CREATE OR REPLACE FUNCTION search_bel_positions(
  search_query TEXT,
  user_kzv_id INTEGER DEFAULT NULL,
  user_labor_type VARCHAR DEFAULT 'gewerbe',
  group_filter INTEGER DEFAULT NULL,
  result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id INTEGER,
  position_code VARCHAR,
  name VARCHAR,
  description TEXT,
  group_id INTEGER,
  group_name VARCHAR,
  price DECIMAL,
  is_ukps BOOLEAN,
  is_implant BOOLEAN,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id,
    bp.position_code,
    bp.name,
    bp.description,
    bp.group_id,
    bg.name AS group_name,
    pr.price,
    bp.is_ukps,
    bp.is_implant,
    GREATEST(
      ts_rank(to_tsvector('german', bp.name || ' ' || COALESCE(bp.description, '')), plainto_tsquery('german', search_query)),
      similarity(bp.name, search_query),
      CASE WHEN bp.position_code ILIKE search_query || '%' THEN 1.0 ELSE 0.0 END
    )::REAL AS rank
  FROM bel_positions bp
  LEFT JOIN bel_groups bg ON bp.group_id = bg.id
  LEFT JOIN bel_prices pr ON bp.id = pr.position_id
    AND (user_kzv_id IS NULL OR pr.kzv_id = user_kzv_id)
    AND pr.labor_type = user_labor_type
    AND pr.valid_from <= CURRENT_DATE
    AND (pr.valid_until IS NULL OR pr.valid_until >= CURRENT_DATE)
  WHERE
    (
      -- Full-Text Search
      to_tsvector('german', bp.name || ' ' || COALESCE(bp.description, '')) @@ plainto_tsquery('german', search_query)
      -- ODER Trigram Similarity > 0.3
      OR similarity(bp.name, search_query) > 0.3
      -- ODER Position-Code beginnt mit Suche
      OR bp.position_code ILIKE search_query || '%'
      -- ODER Name enthält Suchbegriff
      OR bp.name ILIKE '%' || search_query || '%'
    )
    -- Optionaler Gruppen-Filter
    AND (group_filter IS NULL OR bp.group_id = group_filter)
  ORDER BY rank DESC, bp.position_code
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Funktion: Alle Preise einer Position für alle KZVen
CREATE OR REPLACE FUNCTION get_position_prices(
  pos_code VARCHAR,
  labor VARCHAR DEFAULT 'gewerbe'
)
RETURNS TABLE (
  kzv_code VARCHAR,
  kzv_name VARCHAR,
  bundesland VARCHAR,
  price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kr.code,
    kr.name,
    kr.bundesland,
    pr.price
  FROM bel_positions bp
  JOIN bel_prices pr ON bp.id = pr.position_id
  JOIN kzv_regions kr ON pr.kzv_id = kr.id
  WHERE bp.position_code = pos_code
    AND pr.labor_type = labor
    AND pr.valid_from <= CURRENT_DATE
    AND (pr.valid_until IS NULL OR pr.valid_until >= CURRENT_DATE)
  ORDER BY kr.bundesland, kr.name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. TRIGGER für updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bel_positions_updated_at
  BEFORE UPDATE ON bel_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
