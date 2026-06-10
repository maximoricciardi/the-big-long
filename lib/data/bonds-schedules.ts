/**
 * lib/data/bonds-schedules.ts
 * Flujos de caja completos para bonos soberanos ARG 2020
 * Incluye historial desde emisión (sep 2020) para el cálculo de recupero
 */

export interface BondFlow {
  date:  string;   // "YYYY-MM-DD"
  cpn:   number;   // cupón % sobre VN residual
  amort: number;   // amortización % sobre VN original
}

export interface BondSchedule {
  flows: BondFlow[];
  desc:  string;
}

// ── AO27 — Bono del Tesoro USD 2027 (Bullet) ─────────────────────────
// Cupón mensual 0.25%, bullet Oct 2027
function _ao27Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  // From Jan 2021 to Oct 2027
  for (let y = 2021; y <= 2027; y++) {
    const mEnd = (y === 2027) ? 10 : 12;
    for (let m = (y === 2021 ? 1 : 1); m <= mEnd; m++) {
      const last = new Date(y, m, 0).getDate();
      out.push({
        date:  `${y}-${String(m).padStart(2,"0")}-${last}`,
        cpn:   0.25,
        amort: (y === 2027 && m === 10) ? 100 : 0,
      });
    }
  }
  return out;
}

// ── AO28 — Bono del Tesoro USD 2028 (Bullet) ─────────────────────────
// Cupón mensual 0.50%, bullet Oct 2028
function _ao28Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2028; y++) {
    const mEnd = (y === 2028) ? 10 : 12;
    for (let m = 1; m <= mEnd; m++) {
      const last = new Date(y, m, 0).getDate();
      out.push({
        date:  `${y}-${String(m).padStart(2,"0")}-${last}`,
        cpn:   0.50,
        amort: (y === 2028 && m === 10) ? 100 : 0,
      });
    }
  }
  return out;
}

// ── Helper: semi-annual constant coupon flows from 2021 ───────────────
function _semiFlows(
  cpnConst: number,
  fromYear = 2021,
  toYear   = 2030,
  toMonth  = 12,
  amortSchedule: Array<{ y: number; m: number; pct: number }> = []
): BondFlow[] {
  const out: BondFlow[] = [];
  // Semi-annual: Jan, Jul pattern for most; Apr, Oct for others
  const months = [1, 7]; // adjust per bond if needed
  for (let y = fromYear; y <= toYear; y++) {
    for (const m of months) {
      if (y === toYear && m > toMonth) break;
      if (y === fromYear && m < 1) continue;
      const last = new Date(y, m, 0).getDate();
      const amortEntry = amortSchedule.find(a => a.y === y && a.m === m);
      out.push({
        date:  `${y}-${String(m).padStart(2,"0")}-${last}`,
        cpn:   cpnConst,
        amort: amortEntry?.pct ?? 0,
      });
    }
  }
  return out;
}

// ── AL29D / GD29D — Bonds 2029 ───────────────────────────────────────
// Step-up: 0.125% sem years 1-5, 0.25% from Sep 2025
// Semi-annual Apr/Oct. Amort: 4.545% × 22 payments starting Apr 2025
const _al29Amort = Array.from({length:22},(_,i) => {
  const base = new Date(2025,3,30); // Apr 2025
  base.setMonth(base.getMonth() + i*6);
  return { y: base.getFullYear(), m: base.getMonth()+1, pct: 4.545 };
});

// ── AL30D / GD30D — Bonds 2030 ───────────────────────────────────────
// Step-up: 0.125% sem yrs 1-5 (ends Jul 2025), 0.25% from Jan 2026
// Amort: 4% × 25 payments starting Jan 2024
const _al30HistFlows: BondFlow[] = [
  // Historical semi-annual flows since 2021 (pre-amort)
  {date:"2021-01-31",cpn:0.125,amort:0},{date:"2021-07-31",cpn:0.125,amort:0},
  {date:"2022-01-31",cpn:0.125,amort:0},{date:"2022-07-31",cpn:0.125,amort:0},
  {date:"2023-01-31",cpn:0.125,amort:0},{date:"2023-07-31",cpn:0.125,amort:0},
  {date:"2024-01-31",cpn:0.125,amort:4},{date:"2024-07-31",cpn:0.125,amort:4},
  {date:"2025-01-31",cpn:0.125,amort:4},{date:"2025-07-31",cpn:0.25, amort:4},
];

// Future flows AL30 from Jan 2026 onwards
function _al30FutureFlows(): BondFlow[] {
  const out: BondFlow[] = [];
  const amortMonths = [1,7]; // Jan and Jul
  for (let y = 2026; y <= 2030; y++) {
    for (const m of amortMonths) {
      if (y === 2030 && m > 7) break;
      const last = new Date(y, m, 0).getDate();
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn:0.25, amort:4 });
    }
  }
  // Final bullet remaining at Jul 2030
  return out;
}

// ── AL35D / GD35D — Bonds 2035 ───────────────────────────────────────
// 3.625% coupon annual (1.8125% semi), amort 2.703% × 37 from Jan 2025
function _al35Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2035; y++) {
    for (const m of [1,7]) {
      if (y === 2035 && m > 7) break;
      const last = new Date(y, m, 0).getDate();
      const hasAmort = y >= 2025;
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn:1.8125, amort:hasAmort?2.703:0 });
    }
  }
  return out;
}

// ── AL38D / GD38D — Bonds 2038 ───────────────────────────────────────
// 3.875% annual (1.9375% semi), amort 2% × 26 from Jan 2025
function _al38Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2038; y++) {
    for (const m of [1,7]) {
      if (y === 2038 && m > 1) break;
      const last = new Date(y, m, 0).getDate();
      const hasAmort = y >= 2025;
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn:1.9375, amort:hasAmort?2.0:0 });
    }
  }
  return out;
}

// ── AL41D / GD41D — Bonds 2041 ───────────────────────────────────────
// 4.125% annual (2.0625% semi), amort 2.174% × 23 from Jan 2025
function _al41Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2041; y++) {
    for (const m of [1,7]) {
      if (y === 2041 && m > 1) break;
      const last = new Date(y, m, 0).getDate();
      const hasAmort = y >= 2025;
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn:2.0625, amort:hasAmort?2.174:0 });
    }
  }
  return out;
}

// ── AL46D / GD46D — Bonds 2046 ───────────────────────────────────────
// 4.625% annual (2.3125% semi), amort 1.818% × 22 from Jul 2025
function _al46Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2046; y++) {
    for (const m of [1,7]) {
      if (y === 2046 && m > 7) break;
      const last = new Date(y, m, 0).getDate();
      const hasAmort = y > 2025 || (y === 2025 && m >= 7);
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn:2.3125, amort:hasAmort?1.818:0 });
    }
  }
  return out;
}

// ── AL29D step-up flows ───────────────────────────────────────────────
function _al29Flows(): BondFlow[] {
  const out: BondFlow[] = [];
  for (let y = 2021; y <= 2029; y++) {
    for (const m of [4,10]) {
      if (y === 2029 && m > 10) break;
      const last = new Date(y, m, 0).getDate();
      const cpn = (y < 2025 || (y === 2025 && m < 10)) ? 0.125 : 0.25;
      const amortEntry = _al29Amort.find(a => a.y === y && a.m === m);
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-${last}`, cpn, amort:amortEntry?.pct ?? 0 });
    }
  }
  return out;
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────
export const BOND_SCHEDULES: Record<string, BondFlow[]> = {
  // AO series (monthly)
  AO27D: _ao27Flows(),
  AO28D: _ao28Flows(),
  // AL series (semi-annual)
  AL29D: _al29Flows(),
  AL30D: [..._al30HistFlows, ..._al30FutureFlows()],
  AL35D: _al35Flows(),
  AL38D: _al38Flows(),
  AL41D: _al41Flows(),
  AL46D: _al46Flows(),
  // GD series = same cash flows as AL (different law)
  GD29D: _al29Flows(),
  GD30D: [..._al30HistFlows, ..._al30FutureFlows()],
  GD35D: _al35Flows(),
  GD38D: _al38Flows(),
  GD41D: _al41Flows(),
  GD46D: _al46Flows(),
};

// ── TIR Calculator (bisection method) ────────────────────────────────
export function calcSovTIR(
  priceWithCom: number,
  flows: Array<{ date: string; cpn: number; amort: number }>,
  valuationDate = new Date()
): number {
  if (!Number.isFinite(priceWithCom) || priceWithCom <= 0) return Number.NaN;

  const futureFlows: Array<{ t: number; cf: number }> = [];
  let outstanding = 100;

  [...flows]
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .forEach((f) => {
      const flowDate = new Date(f.date);
      const amort = Math.min(Math.max(f.amort, 0), outstanding);
      const coupon = outstanding * f.cpn / 100;
      const cashFlow = coupon + amort;

      if (flowDate > valuationDate && cashFlow > 0) {
        futureFlows.push({
          t: (flowDate.getTime() - valuationDate.getTime()) / (365.25 * 86400000),
          cf: cashFlow / 100,
        });
      }

      outstanding = Math.max(0, outstanding - amort);
    });

  if (!futureFlows.length) return Number.NaN;

  const target = priceWithCom / 100;
  const pvAt = (rate: number) =>
    futureFlows.reduce((s, f) => s + f.cf / Math.pow(1 + rate, f.t), 0);

  let lo = -0.95, hi = 5.0;
  if (target > pvAt(lo) || target < pvAt(hi)) return Number.NaN;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const pv = pvAt(mid);
    if (pv > target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
