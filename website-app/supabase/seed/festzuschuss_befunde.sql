-- ============================================
-- Seed: Festzuschuss-Befunde und Preise
-- Basiert auf: Abrechnungshilfe für Festzuschüsse (gültig ab 01.01.2025)
-- ============================================

-- Befundklasse 1: Erhaltungswürdiger Zahn
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('1.1', 1, 'Erhaltungswürdiger Zahn mit weitgehender Zerstörung der klinischen Krone'),
  ('1.2', 1, 'Erhaltungswürdiger Zahn mit Karies/Füllungen/Frakturen'),
  ('1.3', 1, 'Erhaltungswürdiger Zahn mit Substanzdefekt'),
  ('1.4', 1, 'Erhaltungswürdiger Zahn mit freiliegendem Zahnhals'),
  ('1.5', 1, 'Erhaltungswürdiger avitaler Zahn')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 2: Zahnbegrenzte Lücken I
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('2.1', 2, 'Zahnbegrenzte Lücke mit einem fehlenden Zahn'),
  ('2.2', 2, 'Zahnbegrenzte Lücke mit zwei fehlenden Zähnen'),
  ('2.3', 2, 'Zahnbegrenzte Lücke mit drei fehlenden Zähnen'),
  ('2.4', 2, 'Zahnbegrenzte Lücke mit vier fehlenden Zähnen'),
  ('2.5', 2, 'Verkürzte Zahnreihe mit Lücke'),
  ('2.6', 2, 'Adhäsivbrücke zum Ersatz eines Schneidezahnes'),
  ('2.7', 2, 'Zahnbegrenzte Lücke durch fehlende Schneidezähne')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 3: Zahnbegrenzte Lücken II
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('3.1', 3, 'Zahnbegrenzte Lücke (große Brücke)'),
  ('3.2', 3, 'Verkürzte Zahnreihe (große Brücke)')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 4: Restzahnbestand und zahnloser Kiefer
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('4.1', 4, 'Restzahnbestand (1-4 Zähne)'),
  ('4.2', 4, 'Restzahnbestand mit erweitertem Lückengebiss'),
  ('4.3', 4, 'Restzahnbestand mit Lückensituation'),
  ('4.4', 4, 'Zahnloser Oberkiefer'),
  ('4.5', 4, 'Zahnloser Unterkiefer'),
  ('4.6', 4, 'Zahnloser Ober- und Unterkiefer'),
  ('4.7', 4, 'Atrophierter zahnloser Unterkiefer'),
  ('4.8', 4, 'Stark atrophierter zahnloser Kiefer'),
  ('4.9', 4, 'Restzahnbestand Deckprothese')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 5: Lückengebisse
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('5.1', 5, 'Lückengebiss Seitenzahnbereich'),
  ('5.2', 5, 'Lückengebiss Frontzahnbereich'),
  ('5.3', 5, 'Erweitertes Lückengebiss'),
  ('5.4', 5, 'Stark reduziertes Restgebiss')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 6: Wiederherstellung/Erweiterung
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('6.0', 6, 'Wiederherstellungsbedürftiger Zahnersatz'),
  ('6.1', 6, 'Erweiterung einer vorhandenen Prothese (1 Zahn)'),
  ('6.2', 6, 'Erweiterung einer vorhandenen Prothese (2 Zähne)'),
  ('6.3', 6, 'Erweiterung einer vorhandenen Prothese (3+ Zähne)'),
  ('6.4', 6, 'Unterfütterung einer Prothese'),
  ('6.5', 6, 'Erneuerung Prothesenbasis'),
  ('6.6', 6, 'Wiederherstellung Krone/Brücke'),
  ('6.7', 6, 'Erneuerung Totalprothese'),
  ('6.8', 6, 'Reparatur Bruchstelle'),
  ('6.9', 6, 'Wiedereingliederung Prothese'),
  ('6.10', 6, 'Halteelement erneuern')
ON CONFLICT (befund_nummer) DO NOTHING;

-- Befundklasse 7: Suprakonstruktionen Implantate
INSERT INTO festzuschuss_befunde (befund_nummer, befund_klasse, bezeichnung) VALUES
  ('7.1', 7, 'Suprakonstruktion Einzelzahnimplantat'),
  ('7.2', 7, 'Suprakonstruktion implantatgestützte Brücke'),
  ('7.3', 7, 'Suprakonstruktion implantatgestützte Prothese OK'),
  ('7.4', 7, 'Suprakonstruktion implantatgestützte Prothese UK'),
  ('7.5', 7, 'Implantatgetragener Zahnersatz'),
  ('7.6', 7, 'Reparatur Implantat-Suprakonstruktion'),
  ('7.7', 7, 'Erneuerung Implantat-Suprakonstruktion')
ON CONFLICT (befund_nummer) DO NOTHING;

-- ============================================
-- Festzuschuss-Preise (Beispieldaten, ab 01.01.2025)
-- Kassenart: 1=60%, 2=70%, 3=75%, 4=100%
-- ============================================

-- Befund 1.1 - Krone (häufigster Festzuschuss)
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 229.25, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '1.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 267.46, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '1.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 286.57, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '1.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 382.09, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '1.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;

-- Befund 2.1 - Brücke (1 Zahn)
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 458.50, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '2.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 534.92, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '2.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 573.13, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '2.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 764.17, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '2.1'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;

-- Befund 4.4 - Totalprothese Oberkiefer
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 469.82, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 548.13, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 587.28, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 783.04, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;

-- Befund 4.5 - Totalprothese Unterkiefer
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 469.82, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.5'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 548.13, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.5'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 587.28, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.5'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 783.04, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '4.5'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;

-- Befund 6.4 - Unterfütterung
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 74.53, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 86.95, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 93.16, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 124.21, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.4'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;

-- Befund 6.7 - Erneuerung Totalprothese
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 1, 60, 124.21, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.7'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 2, 70, 144.91, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.7'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 3, 75, 155.26, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.7'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
INSERT INTO festzuschuss_preise (befund_id, kassenart, prozent, preis, valid_from)
SELECT id, 4, 100, 207.01, '2025-01-01' FROM festzuschuss_befunde WHERE befund_nummer = '6.7'
ON CONFLICT (befund_id, kassenart, valid_from) DO NOTHING;
