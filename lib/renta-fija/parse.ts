/** Parse numeric strings: "$102,50", "9,50%", "8.24%", 2.3 */
export function parseNum(raw: string | number | null | undefined): number {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (!raw) return 0;
  const cleaned = raw
    .toString()
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function parseARSPrice(raw: string | number | null | undefined): number {
  return parseNum(raw);
}

export function parsePct(raw: string | number | null | undefined): number {
  return parseNum(raw);
}
