export function formatPositionCode(code?: string | null): string {
  if (!code) return "";
  const raw = String(code).trim();
  if (!raw) return "";

  // Numeric codes: normalize whitespace, then pad to 4 digits if short.
  if (/^[\d\s]+$/.test(raw)) {
    const digits = raw.replace(/\s+/g, "");
    if (digits.length <= 4) {
      return digits.padStart(4, "0");
    }
    return digits;
  }

  return raw;
}
