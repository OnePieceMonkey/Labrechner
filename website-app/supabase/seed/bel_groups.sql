-- ============================================
-- Seed: BEL-Gruppen (8 Hauptgruppen)
-- ============================================

INSERT INTO bel_groups (group_number, name, description, position_range) VALUES
  (0, 'Modelle & Hilfsmittel', 'Arbeitsmodelle, Artikulator, Löffel, Provisorien', '001-032'),
  (1, 'Kronen & Brücken', 'Festsitzender Zahnersatz, Verblendungen, Teleskope', '101-165'),
  (2, 'Metallbasis / Modellguss', 'Gegossene Prothesenbasis, Klammern, Geschiebe', '201-212'),
  (3, 'Prothesen', 'Herausnehmbarer Zahnersatz, Aufstellung, Fertigstellung', '301-384'),
  (4, 'Schienen & Aufbissbehelfe', 'Aufbissschienen, semipermanente Schienen', '401-404'),
  (5, 'UKPS', 'Unterkiefer-Protrusionsschienen (Schlafapnoe)', '501-521'),
  (7, 'KFO', 'Kieferorthopädische Geräte', '701-751'),
  (8, 'Instandsetzung & Erweiterung', 'Reparaturen, Unterfütterungen, Erweiterungen', '801-870')
ON CONFLICT (group_number) DO NOTHING;

-- Hinweis: Gruppe 6 existiert nicht im BEL II
