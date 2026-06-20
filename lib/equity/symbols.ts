export function normalizeEquitySymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

export function normalizeEquityProviderSymbol(symbol: string): string {
  const normalized = normalizeEquitySymbol(symbol);
  if (normalized === "BRKB" || normalized === "BRK/B") return "BRK.B";
  if (normalized === "BITF") return "KEEL";
  if (normalized === "FI") return "FISV";
  if (normalized === "MMC") return "MRSH";
  return normalized;
}

export function isSpecialEquityExposure(symbol: string): boolean {
  return normalizeEquitySymbol(symbol) === "SPCX";
}

export function yahooQuoteCandidates(symbol: string): string[] {
  const base = normalizeEquityProviderSymbol(symbol);
  const out = new Set<string>();

  if (base === "SPCX") return [];
  if (base === "MERV") return ["^MERV", "MERV.BA"];
  if (base === "BRK.B") return ["BRK-B", "BRK.B", "BRKB"];
  if (base === "YPFD") {
    out.add("YPF");
    out.add("YPF.BA");
  }

  out.add(base);
  if (base.endsWith("D") && base.length > 2) {
    const noD = base.slice(0, -1);
    out.add(noD);
    out.add(`${noD}.BA`);
  }
  if (!base.includes(".") && !base.startsWith("^")) out.add(`${base}.BA`);
  return [...out];
}

export function finnhubQuoteSymbol(symbol: string): string {
  const normalized = normalizeEquityProviderSymbol(symbol);
  if (normalized === "MERV") return "^MERV";
  return normalized;
}

export function fundamentalsProviderTickerFor(symbol: string): string {
  const normalized = normalizeEquitySymbol(symbol);
  if (normalized === "BRKB") return "BRK.B";
  if (normalized === "YPFD") return "YPF";
  return normalizeEquityProviderSymbol(normalized);
}
