export function formatPositionCode(code?: string | null): string {
  if (!code) return '';
  const raw = String(code);
  if (/^\d+$/.test(raw)) {
    const trimmed = raw.replace(/^0+/, '');
    return trimmed === '' ? '0' : trimmed;
  }
  return raw;
}
