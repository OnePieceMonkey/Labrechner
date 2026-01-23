-- ============================================
-- Seed: KZV-Regionen (17 Stück)
-- ============================================

INSERT INTO kzv_regions (code, name, bundesland) VALUES
  ('KZVBW', 'KZV Baden-Württemberg', 'Baden-Württemberg'),
  ('KZVB', 'KZV Bayern', 'Bayern'),
  ('KZVBerlin', 'KZV Berlin', 'Berlin'),
  ('KZVLB', 'KZV Land Brandenburg', 'Brandenburg'),
  ('KZVBremen', 'KZV Bremen', 'Bremen'),
  ('KZVHH', 'KZV Hamburg', 'Hamburg'),
  ('KZVH', 'KZV Hessen', 'Hessen'),
  ('KZVMV', 'KZV Mecklenburg-Vorpommern', 'Mecklenburg-Vorpommern'),
  ('KZVN', 'KZV Niedersachsen', 'Niedersachsen'),
  ('KZVNR', 'KZV Nordrhein', 'Nordrhein-Westfalen'),
  ('KZVRLP', 'KZV Rheinland-Pfalz', 'Rheinland-Pfalz'),
  ('KZVSaar', 'KZV Saarland', 'Saarland'),
  ('KZVS', 'KZV Sachsen', 'Sachsen'),
  ('KZVSA', 'KZV Sachsen-Anhalt', 'Sachsen-Anhalt'),
  ('KZVSH', 'KZV Schleswig-Holstein', 'Schleswig-Holstein'),
  ('KZVT', 'KZV Thüringen', 'Thüringen'),
  ('KZVWL', 'KZV Westfalen-Lippe', 'Nordrhein-Westfalen')
ON CONFLICT (code) DO NOTHING;
