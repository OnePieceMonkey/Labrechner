-- ============================================
-- Füge KZV-Regionen für Hessen & Saarland hinzu
-- ============================================
--
-- Dieses Script fügt die fehlenden KZV-Regionen hinzu,
-- falls sie noch nicht in der Datenbank existieren.
--
-- Verwendung:
-- 1. Führe dieses Script in der Supabase SQL Editor aus
-- 2. Prüfe, ob die Regionen erfolgreich hinzugefügt wurden

-- Prüfe, ob die Regionen bereits existieren
DO $$
BEGIN
  -- Hessen
  IF NOT EXISTS (SELECT 1 FROM kzv_regions WHERE name = 'KZV Hessen') THEN
    INSERT INTO kzv_regions (code, name, bundesland)
    VALUES ('KZVH', 'KZV Hessen', 'Hessen');
    RAISE NOTICE '✅ KZV Hessen wurde hinzugefügt';
  ELSE
    RAISE NOTICE 'ℹ️ KZV Hessen existiert bereits';
  END IF;

  -- Saarland
  IF NOT EXISTS (SELECT 1 FROM kzv_regions WHERE name = 'KZV Saarland') THEN
    INSERT INTO kzv_regions (code, name, bundesland)
    VALUES ('KZVSL', 'KZV Saarland', 'Saarland');
    RAISE NOTICE '✅ KZV Saarland wurde hinzugefügt';
  ELSE
    RAISE NOTICE 'ℹ️ KZV Saarland existiert bereits';
  END IF;
END $$;

-- Zeige alle KZV-Regionen
SELECT
  id,
  code,
  name,
  bundesland,
  created_at
FROM kzv_regions
ORDER BY name;
