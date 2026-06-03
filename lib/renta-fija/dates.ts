export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseVtoDDMMYYYY(vto: string): Date | null {
  const parts = vto.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yy] = parts.map(Number);
  if (!dd || !mm || !yy) return null;
  return new Date(yy, mm - 1, dd);
}

/** Calendar days from today (start of day) to maturity, inclusive of vto day logic */
export function daysToMaturity(vto: string, from: Date = new Date()): number {
  const maturity = parseVtoDDMMYYYY(vto);
  if (!maturity) return 0;
  const today = startOfDay(from);
  const end = startOfDay(maturity);
  return Math.max(0, Math.round((end.getTime() - today.getTime()) / 86400000));
}

export function daysSinceReference(from: Date, reference: Date): number {
  return Math.floor((startOfDay(from).getTime() - startOfDay(reference).getTime()) / 86400000);
}

export function isVtoActive(vto: string, from: Date = new Date()): boolean {
  const maturity = parseVtoDDMMYYYY(vto);
  if (!maturity) return true;
  return startOfDay(maturity) >= startOfDay(from);
}
