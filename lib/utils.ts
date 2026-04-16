import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with ARS locale and optional prefix */
export function fmt2(v: number | null | undefined, prefix = "$"): string {
  if (v == null) return "—";
  return `${prefix}${Math.round(v).toLocaleString("es-AR")}`;
}

/** Format a percentage with sign */
export function fmtPct(v: number | null | undefined): string {
  if (v == null) return "";
  return ` (${v >= 0 ? "+" : ""}${v.toFixed(2)}%)`;
}

/** Truncate text to a given length */
export function truncate(text: string, len: number): string {
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format a number as currency */
export function formatCurrency(
  value: number,
  currency = "ARS",
  locale = "es-AR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Get color variant for a badge */
export type BadgeColor = "green" | "red" | "blue" | "gold" | "gray" | "purple";

export function resolveBadgeColor(bc?: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    green:  "green",
    red:    "red",
    blue:   "blue",
    gold:   "gold",
    gray:   "gray",
    purple: "purple",
  };
  return map[bc ?? ""] ?? "gray";
}
