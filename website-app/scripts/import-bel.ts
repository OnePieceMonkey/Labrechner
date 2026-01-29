/**
 * BEL-Daten Import Script
 * Importiert BEL-Positionen und Preise aus CSV-Dateien in Supabase
 *
 * Ausführen: npx tsx scripts/import-bel.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// .env.local laden
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

// Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase Credentials nicht gefunden in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Pfad zu den CSV-Dateien
const CSV_DIR = path.join(__dirname, '..', '..', 'BEL 2026');

// KZV-Codes für die Dateien
const KZV_CODES: Record<string, string> = {
  'Bayern': 'KZVB',
  'BW': 'KZVBW',
  'NRW': 'KZVNR',
  'RLP': 'KZVRLP',
  'SA': 'KZVSA',
  'Niedersachsen': 'KZVN',
  'Schleswig-Holstein': 'KZVSH',
  'Thueringen': 'KZVTH',
  'Sachsen': 'KZVS',
  'Meck_Pom': 'KZVMV',
  'Westfalen-Lippe': 'KZVWL',
  'Nordrhein': 'KZVNO',
  'Berlin': 'KZVB_BE',
  'Brandenburg': 'KZVLB',
  'Bremen': 'KZVHB',
  'Hessen': 'KZVH',
  'Saarland': 'KZVSL',
  'Hamburg': 'KZVHH'
};

interface BelPosition {
  position_code: string;
  name: string;
  group_id: number | null;
  is_ukps: boolean;
  is_implant: boolean;
}

interface BelPrice {
  position_code: string;
  kzv_code: string;
  labor_type: 'gewerbe' | 'praxis';
  price: number;
}

// Deutsche Dezimalzahlen parsen (Komma -> Punkt)
function parseGermanNumber(str: string): number {
  if (!str || str.trim() === '') return 0;
  return parseFloat(str.replace(',', '.'));
}

// Positions-Code normalisieren (Leerzeichen entfernen, 4-stellig machen)
function normalizeCode(code: string): string {
  return code.replace(/\s/g, '').padStart(4, '0');
}

// Gruppe aus Position-Code ermitteln (erste Ziffer)
function getGroupFromCode(code: string): number {
  const firstDigit = parseInt(code[0], 10);
  // Gruppe 6 existiert nicht in BEL II
  return firstDigit;
}

// UKPS-Position erkennen (endet auf 5, z.B. 0015, 0115, 0125)
function isUkps(code: string, name: string): boolean {
  return code.endsWith('5') && name.toLowerCase().includes('ukps');
}

// Implantat-Position erkennen (endet auf 8 oder enthält "implantat")
function isImplant(code: string, name: string): boolean {
  return code.endsWith('8') || name.toLowerCase().includes('implantat');
}

// Bayern CSV parsen (Format: Code;Code;Name;Gruppe;Praxis;Gewerbe;...)
function parseBayernCSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 6) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[2]?.trim();
    const praxisPrice = parseGermanNumber(parts[4]);
    const gewerbePrice = parseGermanNumber(parts[5]);

    if (!code || !name || code === 'Pos.') continue;

    // Position nur einmal hinzufügen
    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    // Preise hinzufügen
    if (praxisPrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Bayern, labor_type: 'praxis', price: praxisPrice });
    }
    if (gewerbePrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Bayern, labor_type: 'gewerbe', price: gewerbePrice });
    }
  }

  return { positions, prices };
}

// BW CSV parsen (Format: Code;Name;Preis)
function parseBWCSV(content: string, laborType: 'gewerbe' | 'praxis'): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 3) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[1]?.trim();
    const price = parseGermanNumber(parts[2]);

    if (!code || !name || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (price > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.BW, labor_type: laborType, price });
    }
  }

  return { positions, prices };
}

// NRW CSV parsen (Format: Pos.;Name;Preis;;)
function parseNRWCSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 3) continue;

    // NRW hat Format "001 0" mit Leerzeichen
    const code = normalizeCode(parts[0]);
    const name = parts[1]?.trim();
    const price = parseGermanNumber(parts[2]);

    if (!code || !name || code === 'Pos.' || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (price > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.NRW, labor_type: 'praxis', price });
    }
  }

  return { positions, prices };
}

// Rheinland-Pfalz CSV parsen (Format: Kürzel;Nr.;Bezeichnung;Kassenart;PreisPraxis;PreisGewerbe;...)
function parseRLPCSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 6) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[2]?.trim();
    const praxisPrice = parseGermanNumber(parts[4]);
    const gewerbePrice = parseGermanNumber(parts[5]);

    // Header-Zeile überspringen
    if (!code || !name || code === 'Kürz' || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (praxisPrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.RLP, labor_type: 'praxis', price: praxisPrice });
    }
    if (gewerbePrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.RLP, labor_type: 'gewerbe', price: gewerbePrice });
    }
  }

  return { positions, prices };
}

// Sachsen-Anhalt CSV parsen (Format: Code;Code;Name;Kassenart;Praxis;Gewerbe;;)
function parseSACSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 6) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[2]?.trim();
    const praxisPrice = parseGermanNumber(parts[4]);
    const gewerbePrice = parseGermanNumber(parts[5]);

    if (!code || !name || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (praxisPrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.SA, labor_type: 'praxis', price: praxisPrice });
    }
    if (gewerbePrice > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.SA, labor_type: 'gewerbe', price: gewerbePrice });
    }
  }

  return { positions, prices };
}

// Generische CSV parsen (Format: Code;Bezeichnung;Preis) - für neue Regionen
// Hessen 2026 CSV parsen (Format: Code;Code;Name;0;... mehrere Preis-Spalten)
function parseHessen2026CSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 6) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[2]?.trim();
    const priceGewerbe = parseGermanNumber(parts[4] || '');
    const pricePraxis = parseGermanNumber(parts[6] || '');

    if (!code || !name || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (priceGewerbe > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Hessen, labor_type: 'gewerbe', price: priceGewerbe });
    }
    if (pricePraxis > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Hessen, labor_type: 'praxis', price: pricePraxis });
    }
  }

  return { positions, prices };
}

// Saarland 2026 CSV parsen (Format: Code;Code;Name;0;Praxis;Gewerbe)
function parseSaarland2026CSV(content: string): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 6) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[2]?.trim();
    const pricePraxis = parseGermanNumber(parts[4] || '');
    const priceGewerbe = parseGermanNumber(parts[5] || '');

    if (!code || !name || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (priceGewerbe > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Saarland, labor_type: 'gewerbe', price: priceGewerbe });
    }
    if (pricePraxis > 0) {
      prices.push({ position_code: code, kzv_code: KZV_CODES.Saarland, labor_type: 'praxis', price: pricePraxis });
    }
  }

  return { positions, prices };
}

function parseGenericCSV(content: string, kzvCode: string, laborType: 'gewerbe' | 'praxis' = 'gewerbe'): { positions: BelPosition[], prices: BelPrice[] } {
  const positions: BelPosition[] = [];
  const prices: BelPrice[] = [];
  const seenCodes = new Set<string>();

  const lines = content.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 3) continue;

    const code = normalizeCode(parts[0]);
    const name = parts[1]?.trim();
    const price = parseGermanNumber(parts[2]);

    // Header-Zeile und ungültige Zeilen überspringen
    if (!code || !name || code === 'Code' || isNaN(parseInt(code[0], 10))) continue;

    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      positions.push({
        position_code: code,
        name,
        group_id: getGroupFromCode(code),
        is_ukps: isUkps(code, name),
        is_implant: isImplant(code, name)
      });
    }

    if (price > 0) {
      prices.push({ position_code: code, kzv_code: kzvCode, labor_type: laborType, price });
    }
  }

  return { positions, prices };
}

async function main() {
  console.log('🚀 BEL-Daten Import gestartet...\n');

  // Alle Positionen und Preise sammeln
  const allPositions = new Map<string, BelPosition>();
  const allPrices: BelPrice[] = [];

  // 1. Bayern CSV laden
  const bayernPath = path.join(CSV_DIR, 'Bayern 11la0126.csv');
  if (fs.existsSync(bayernPath)) {
    console.log('📄 Lade Bayern CSV...');
    const content = fs.readFileSync(bayernPath, 'latin1'); // Windows-Encoding
    const { positions, prices } = parseBayernCSV(content);
    positions.forEach(p => allPositions.set(p.position_code, p));
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // 2. BW Gewerbelabor CSV laden
  const bwGewerbePath = path.join(CSV_DIR, 'BW gewerbelabor_ab-2026-01-01.csv');
  if (fs.existsSync(bwGewerbePath)) {
    console.log('📄 Lade BW Gewerbelabor CSV...');
    const content = fs.readFileSync(bwGewerbePath, 'latin1');
    const { positions, prices } = parseBWCSV(content, 'gewerbe');
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // 3. BW Praxislabor CSV laden
  const bwPraxisPath = path.join(CSV_DIR, 'BW praxislabor_ab-2026-01-01.csv');
  if (fs.existsSync(bwPraxisPath)) {
    console.log('📄 Lade BW Praxislabor CSV...');
    const content = fs.readFileSync(bwPraxisPath, 'latin1');
    const { positions, prices } = parseBWCSV(content, 'praxis');
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // 4. NRW CSV laden
  const nrwPath = path.join(CSV_DIR, 'NRW BEL_II_ab01.01.2026.csv');
  if (fs.existsSync(nrwPath)) {
    console.log('📄 Lade NRW CSV...');
    const content = fs.readFileSync(nrwPath, 'latin1');
    const { positions, prices } = parseNRWCSV(content);
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // 5. Rheinland-Pfalz CSV laden
  const rlpPath = path.join(CSV_DIR, 'BEL leistungen', 'Rheinland-Pfalz', 'Rheinland_Pfalz_2026.csv');
  if (fs.existsSync(rlpPath)) {
    console.log('📄 Lade Rheinland-Pfalz CSV...');
    const content = fs.readFileSync(rlpPath, 'latin1');
    const { positions, prices } = parseRLPCSV(content);
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // 6. Sachsen-Anhalt CSV laden
  const saPath = path.join(CSV_DIR, 'BEL leistungen', 'Sachse-Anhalt', 'Sachsen_Anhalt_BEL_2026.csv');
  if (fs.existsSync(saPath)) {
    console.log('📄 Lade Sachsen-Anhalt CSV...');
    const content = fs.readFileSync(saPath, 'latin1');
    const { positions, prices } = parseSACSV(content);
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // Hessen 2026 CSV laden
  const hessen2026Path = path.join(CSV_DIR, 'BEL leistungen', 'Hessen BEL_2026_20la0126.csv');
  if (fs.existsSync(hessen2026Path)) {
    console.log('ÐY"" Lade Hessen 2026 CSV...');
    const content = fs.readFileSync(hessen2026Path, 'latin1');
    const { positions, prices } = parseHessen2026CSV(content);
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ƒo. ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // Saarland 2026 CSV laden
  const saarland2026Path = path.join(CSV_DIR, 'BEL leistungen', 'Saarland BEL_2026_35la0126.csv');
  if (fs.existsSync(saarland2026Path)) {
    console.log('ÐY"" Lade Saarland 2026 CSV...');
    const content = fs.readFileSync(saarland2026Path, 'latin1');
    const { positions, prices } = parseSaarland2026CSV(content);
    positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
    allPrices.push(...prices);
    console.log(`   ƒo. ${positions.length} Positionen, ${prices.length} Preise`);
  }

  // Neue Regionen laden (Format: Code;Bezeichnung;Preis)
  const newRegions = [
    { name: 'Niedersachsen', folder: 'Niedersachsen', file: 'Niedersachsen_2026_Gewerbe.csv', kzv: 'KZVN' },
    { name: 'Schleswig-Holstein', folder: 'Schleswig-Holstein', file: 'Schleswig_Holstein_2026_Gewerbe.csv', kzv: 'KZVSH' },
    { name: 'Thüringen', folder: 'Thüringen', file: 'Thueringen_2026_Gewerbe.csv', kzv: 'KZVT' },
    { name: 'Sachsen', folder: 'Sachsen', file: 'Sachsen_2026_Gewerbe.csv', kzv: 'KZVS' },
    { name: 'Mecklenburg-Vorpommern', folder: 'Meck_Pom', file: 'Meck_Pom_2026_Gewerbe.csv', kzv: 'KZVMV' },
    { name: 'Westfalen-Lippe', folder: 'Westfalen-Lippe', file: 'Westfalen_Lippe_2026_Gewerbe.csv', kzv: 'KZVWL' },
    { name: 'Nordrhein', folder: 'Nordrhein', file: 'Nordrhein_2026_Gewerbe.csv', kzv: 'KZVNR' },
    { name: 'Berlin', folder: 'Berlin', file: 'Berlin_2025_Gewerbe.csv', kzv: 'KZVBerlin' },
    { name: 'Brandenburg', folder: 'Brandenburg', file: 'Brandenburg_2025_Gewerbe.csv', kzv: 'KZVLB' },
    { name: 'Bremen', folder: 'Bremen', file: 'Bremen_2025_Gewerbe.csv', kzv: 'KZVBremen' },
  ];

  for (const region of newRegions) {
    const regionPath = path.join(CSV_DIR, 'BEL leistungen', region.folder, region.file);
    if (fs.existsSync(regionPath)) {
      console.log(`📄 Lade ${region.name} CSV...`);
      const content = fs.readFileSync(regionPath, 'utf-8');
      const { positions, prices } = parseGenericCSV(content, region.kzv, 'gewerbe');
      positions.forEach(p => { if (!allPositions.has(p.position_code)) allPositions.set(p.position_code, p); });
      allPrices.push(...prices);
      console.log(`   ✅ ${positions.length} Positionen, ${prices.length} Preise`);
    } else {
      console.log(`⚠️  ${region.name} CSV nicht gefunden: ${regionPath}`);
    }
  }

  console.log(`\n📊 Gesamt: ${allPositions.size} Positionen, ${allPrices.length} Preise\n`);

  // KZV-IDs laden
  console.log('🔍 Lade KZV-Regionen...');
  const { data: kzvRegions, error: kzvError } = await supabase
    .from('kzv_regions')
    .select('id, code');

  if (kzvError) {
    console.error('❌ Fehler beim Laden der KZV-Regionen:', kzvError.message);
    process.exit(1);
  }

  const kzvMap = new Map(kzvRegions?.map(k => [k.code, k.id]) || []);
  console.log(`   ✅ ${kzvMap.size} KZV-Regionen geladen`);

  // BEL-Gruppen IDs laden
  console.log('🔍 Lade BEL-Gruppen...');
  const { data: belGroups, error: groupError } = await supabase
    .from('bel_groups')
    .select('id, group_number');

  if (groupError) {
    console.error('❌ Fehler beim Laden der BEL-Gruppen:', groupError.message);
    process.exit(1);
  }

  const groupMap = new Map(belGroups?.map(g => [g.group_number, g.id]) || []);
  console.log(`   ✅ ${groupMap.size} BEL-Gruppen geladen`);

  // Positionen einfügen
  console.log('\n💾 Füge BEL-Positionen ein...');
  const positionsToInsert = Array.from(allPositions.values()).map(p => ({
    position_code: p.position_code,
    name: p.name,
    group_id: groupMap.get(p.group_id || 0) || null,
    is_ukps: p.is_ukps,
    is_implant: p.is_implant
  }));

  // In Batches einfügen (Supabase Limit)
  const BATCH_SIZE = 100;
  let insertedPositions = 0;

  for (let i = 0; i < positionsToInsert.length; i += BATCH_SIZE) {
    const batch = positionsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('bel_positions')
      .upsert(batch, { onConflict: 'position_code' });

    if (error) {
      console.error(`❌ Fehler beim Einfügen (Batch ${i / BATCH_SIZE + 1}):`, error.message);
    } else {
      insertedPositions += batch.length;
    }
  }
  console.log(`   ✅ ${insertedPositions} Positionen eingefügt/aktualisiert`);

  // Position IDs laden für Preise
  console.log('\n🔍 Lade Position-IDs...');
  const { data: positions, error: posError } = await supabase
    .from('bel_positions')
    .select('id, position_code');

  if (posError) {
    console.error('❌ Fehler beim Laden der Positionen:', posError.message);
    process.exit(1);
  }

  const positionMap = new Map(positions?.map(p => [p.position_code, p.id]) || []);
  console.log(`   ✅ ${positionMap.size} Positionen geladen`);

  // Preise einfügen
  console.log('\n💾 Füge BEL-Preise ein...');
  const pricesToInsert = allPrices
    .filter(p => positionMap.has(p.position_code) && kzvMap.has(p.kzv_code))
    .map(p => ({
      position_id: positionMap.get(p.position_code),
      kzv_id: kzvMap.get(p.kzv_code),
      labor_type: p.labor_type,
      price: p.price,
      valid_from: '2026-01-01'
    }));

  let insertedPrices = 0;

  for (let i = 0; i < pricesToInsert.length; i += BATCH_SIZE) {
    const batch = pricesToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('bel_prices')
      .upsert(batch, { onConflict: 'position_id,kzv_id,labor_type,valid_from' });

    if (error) {
      console.error(`❌ Fehler beim Einfügen der Preise (Batch ${i / BATCH_SIZE + 1}):`, error.message);
    } else {
      insertedPrices += batch.length;
    }
  }
  console.log(`   ✅ ${insertedPrices} Preise eingefügt/aktualisiert`);

  console.log('\n✅ Import abgeschlossen!');

  // Zusammenfassung
  console.log('\n📊 Zusammenfassung:');
  console.log(`   - Positionen: ${insertedPositions}`);
  console.log(`   - Preise: ${insertedPrices}`);
  console.log(`   - KZVs: Bayern, Baden-Württemberg, NRW, Rheinland-Pfalz, Sachsen-Anhalt,`);
  console.log(`           Niedersachsen, Schleswig-Holstein, Thüringen, Sachsen, Mecklenburg-Vorpommern,`);
  console.log(`           Westfalen-Lippe, Nordrhein, Berlin, Brandenburg, Bremen, Hessen, Saarland`);
}

main().catch(console.error);
