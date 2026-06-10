/** Parse numeric strings across AR/US formats: "$1.452", "$102,50", "9,50%", "8.24%", 2.3. */
export function parseNumStrict(raw: string | number | null | undefined): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (raw == null) return null;

  const trimmed = raw.toString().trim();
  if (!trimmed || trimmed === "—" || trimmed.toLowerCase() === "n/a") return null;

  const cleaned = trimmed
    .replace(/\s/g, "")
    .replace(/[$%]/g, "")
    .replace(/[^\d,.-]/g, "");

  if (!/\d/.test(cleaned)) return null;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  const decimalSeparator =
    lastComma >= 0 && lastDot >= 0
      ? (lastComma > lastDot ? "," : ".")
      : lastComma >= 0
        ? ","
        : lastDot >= 0
          ? "."
          : null;

  let normalized = cleaned;
  if (decimalSeparator) {
    const integerPart = cleaned.slice(0, cleaned.lastIndexOf(decimalSeparator));
    const decimalPart = cleaned.slice(cleaned.lastIndexOf(decimalSeparator) + 1);
    const hasSingleSeparator = cleaned.indexOf(decimalSeparator) === cleaned.lastIndexOf(decimalSeparator);
    const hasOtherSeparator = decimalSeparator === "," ? cleaned.includes(".") : cleaned.includes(",");
    const looksLikeThousandsOnly =
      hasSingleSeparator &&
      !hasOtherSeparator &&
      decimalPart.length === 3 &&
      integerPart.replace("-", "").length >= 1 &&
      integerPart.replace("-", "").length <= 3;

    if (looksLikeThousandsOnly) {
      normalized = cleaned.replace(new RegExp(`\\${decimalSeparator}`, "g"), "");
    } else {
      const thousandsSeparator = decimalSeparator === "," ? "." : ",";
      normalized = cleaned
        .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
        .replace(decimalSeparator, ".");
    }
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parseNum(raw: string | number | null | undefined): number {
  return parseNumStrict(raw) ?? 0;
}

export function parseARSPriceStrict(raw: string | number | null | undefined): number | null {
  return parseNumStrict(raw);
}

export function parseARSPrice(raw: string | number | null | undefined): number {
  return parseNum(raw);
}

export function parsePctStrict(raw: string | number | null | undefined): number | null {
  return parseNumStrict(raw);
}

export function parsePct(raw: string | number | null | undefined): number {
  return parseNum(raw);
}
