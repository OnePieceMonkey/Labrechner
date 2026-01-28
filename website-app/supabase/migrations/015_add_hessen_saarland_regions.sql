-- ============================================
-- Migration: Füge KZV-Regionen Hessen & Saarland hinzu
-- Datum: 2026-01-28
-- ============================================

-- Füge KZV Hessen hinzu (falls nicht vorhanden)
INSERT INTO kzv_regions (code, name, bundesland)
VALUES ('KZVH', 'KZV Hessen', 'Hessen')
ON CONFLICT (code) DO NOTHING;

-- Füge KZV Saarland hinzu (falls nicht vorhanden)
INSERT INTO kzv_regions (code, name, bundesland)
VALUES ('KZVSL', 'KZV Saarland', 'Saarland')
ON CONFLICT (code) DO NOTHING;

-- Zeige alle KZV-Regionen zur Überprüfung
-- (Kommentiere dies aus, wenn du die Migration produktiv ausführst)
SELECT
  id,
  code,
  name,
  bundesland,
  created_at
FROM kzv_regions
ORDER BY name;
