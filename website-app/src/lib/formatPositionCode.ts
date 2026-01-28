export function formatPositionCode(code?: string | null): string {
  if (!code) return '';
  const raw = String(code);

  // Wenn es eine rein numerische Position ist
  if (/^\d+$/.test(raw)) {
    // BEL-Positionen (001-815) haben 3 Stellen - diese beibehalten
    if (raw.length === 3) {
      return raw;
    }

    // Für längere Nummern (z.B. "0001" → "001") auf 3 Stellen kürzen
    if (raw.length > 3) {
      const trimmed = raw.replace(/^0+/, '');
      if (trimmed.length <= 3) {
        return trimmed.padStart(3, '0');
      }
      return trimmed;
    }

    // Für kürzere Nummern (z.B. "1" → "001") auf 3 Stellen auffüllen
    if (raw.length < 3) {
      return raw.padStart(3, '0');
    }
  }

  return raw;
}
