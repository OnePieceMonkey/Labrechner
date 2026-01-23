-- ============================================
-- Labrechner - Festzuschuss-Schema
-- Version: 1.0
-- Datum: Januar 2026
-- ============================================

-- ============================================
-- 1. TABELLEN
-- ============================================

-- Festzuschuss-Befunde (ca. 40+ Befundnummern)
CREATE TABLE IF NOT EXISTS festzuschuss_befunde (
  id SERIAL PRIMARY KEY,
  befund_nummer VARCHAR(10) UNIQUE NOT NULL,    -- z.B. "1.1", "2.3", "7.7"
  befund_klasse INTEGER NOT NULL,               -- 1-7
  bezeichnung VARCHAR(255) NOT NULL,            -- z.B. "Erhaltungswürdiger Zahn"
  beschreibung TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Festzuschuss-Preise (pro Befund und Kassenart)
CREATE TABLE IF NOT EXISTS festzuschuss_preise (
  id SERIAL PRIMARY KEY,
  befund_id INTEGER REFERENCES festzuschuss_befunde(id) ON DELETE CASCADE,
  kassenart INTEGER NOT NULL CHECK (kassenart IN (1, 2, 3, 4)),
  -- 1 = 60% (ohne Bonus)
  -- 2 = 70% (Bonus 1)
  -- 3 = 75% (Bonus 2)
  -- 4 = 100% (Härtefall)
  prozent INTEGER NOT NULL CHECK (prozent IN (60, 70, 75, 100)),
  preis DECIMAL(10, 2) NOT NULL,
  valid_from DATE NOT NULL DEFAULT '2025-01-01',
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(befund_id, kassenart, valid_from)
);

-- Festzuschuss-Kombinierbarkeit (welche Befunde zusammen abgerechnet werden dürfen)
CREATE TABLE IF NOT EXISTS festzuschuss_kombinierbarkeit (
  id SERIAL PRIMARY KEY,
  befund_id_1 INTEGER REFERENCES festzuschuss_befunde(id) ON DELETE CASCADE,
  befund_id_2 INTEGER REFERENCES festzuschuss_befunde(id) ON DELETE CASCADE,
  kombination_typ VARCHAR(20) NOT NULL CHECK (kombination_typ IN ('kiefer', 'zahn')),
  -- 'kiefer' = im selben Kiefer kombinierbar
  -- 'zahn' = am selben Zahn kombinierbar
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(befund_id_1, befund_id_2)
);

-- Hamburg Kassenspezifische Multiplikatoren (für spätere Nutzung)
CREATE TABLE IF NOT EXISTS kzv_multiplikatoren (
  id SERIAL PRIMARY KEY,
  kzv_id INTEGER REFERENCES kzv_regions(id) ON DELETE CASCADE,
  quartal VARCHAR(10) NOT NULL,                 -- z.B. "2026Q1"
  krankenkasse_nummer VARCHAR(20) NOT NULL,     -- 11-stellige KK-Nummer
  kostengruppe VARCHAR(5) NOT NULL,             -- z.B. "4", "6", "H"
  pw_kch DECIMAL(5, 4),                         -- Konservierend-chirurgisch
  pw_kfo DECIMAL(5, 4),                         -- KFO
  pw_ze DECIMAL(5, 4),                          -- Zahnersatz
  pw_par DECIMAL(5, 4),                         -- Parodontologie
  pw_kbr DECIMAL(5, 4),                         -- Kieferbruch
  pw_ip DECIMAL(5, 4),                          -- Implantate
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(kzv_id, quartal, krankenkasse_nummer)
);

-- ============================================
-- 2. INDIZES
-- ============================================

-- Index für Befund-Nummern Suche
CREATE INDEX IF NOT EXISTS festzuschuss_befunde_nummer_idx
  ON festzuschuss_befunde (befund_nummer);

-- Index für Befund-Klassen Filter
CREATE INDEX IF NOT EXISTS festzuschuss_befunde_klasse_idx
  ON festzuschuss_befunde (befund_klasse);

-- Index für schnelle Preisabfragen
CREATE INDEX IF NOT EXISTS festzuschuss_preise_lookup_idx
  ON festzuschuss_preise (befund_id, kassenart, valid_from DESC);

-- Index für Multiplikatoren
CREATE INDEX IF NOT EXISTS kzv_multiplikatoren_lookup_idx
  ON kzv_multiplikatoren (kzv_id, quartal);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Festzuschuss-Daten: Öffentlich lesbar
ALTER TABLE festzuschuss_befunde ENABLE ROW LEVEL SECURITY;
ALTER TABLE festzuschuss_preise ENABLE ROW LEVEL SECURITY;
ALTER TABLE festzuschuss_kombinierbarkeit ENABLE ROW LEVEL SECURITY;
ALTER TABLE kzv_multiplikatoren ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Festzuschuss befunde are public" ON festzuschuss_befunde
  FOR SELECT USING (true);

CREATE POLICY "Festzuschuss preise are public" ON festzuschuss_preise
  FOR SELECT USING (true);

CREATE POLICY "Festzuschuss kombinierbarkeit is public" ON festzuschuss_kombinierbarkeit
  FOR SELECT USING (true);

CREATE POLICY "KZV Multiplikatoren are public" ON kzv_multiplikatoren
  FOR SELECT USING (true);

-- ============================================
-- 4. FUNKTIONEN
-- ============================================

-- Funktion: Festzuschuss für einen Befund berechnen
CREATE OR REPLACE FUNCTION get_festzuschuss(
  p_befund_nummer VARCHAR,
  p_kassenart INTEGER DEFAULT 1
)
RETURNS TABLE (
  befund_nummer VARCHAR,
  bezeichnung VARCHAR,
  kassenart INTEGER,
  prozent INTEGER,
  preis DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fb.befund_nummer,
    fb.bezeichnung,
    fp.kassenart,
    fp.prozent,
    fp.preis
  FROM festzuschuss_befunde fb
  JOIN festzuschuss_preise fp ON fb.id = fp.befund_id
  WHERE fb.befund_nummer = p_befund_nummer
    AND fp.kassenart = p_kassenart
    AND fp.valid_from <= CURRENT_DATE
    AND (fp.valid_until IS NULL OR fp.valid_until >= CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Funktion: Alle Festzuschüsse einer Befundklasse
CREATE OR REPLACE FUNCTION get_festzuschuesse_by_klasse(
  p_klasse INTEGER,
  p_kassenart INTEGER DEFAULT 1
)
RETURNS TABLE (
  befund_nummer VARCHAR,
  bezeichnung VARCHAR,
  prozent INTEGER,
  preis DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fb.befund_nummer,
    fb.bezeichnung,
    fp.prozent,
    fp.preis
  FROM festzuschuss_befunde fb
  JOIN festzuschuss_preise fp ON fb.id = fp.befund_id
  WHERE fb.befund_klasse = p_klasse
    AND fp.kassenart = p_kassenart
    AND fp.valid_from <= CURRENT_DATE
    AND (fp.valid_until IS NULL OR fp.valid_until >= CURRENT_DATE)
  ORDER BY fb.befund_nummer;
END;
$$ LANGUAGE plpgsql;
