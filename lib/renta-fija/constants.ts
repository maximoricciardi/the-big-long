// lib/renta-fija/constants.ts
// PHILOSOPHY: Solo datos en vivo. Sin fallbacks a referencia estática.
// Si no hay precio live → no se calcula TNA/TEM → se muestra "—"

/** Intervalo de refresco: 30 segundos */
export const REFRESH_MS = 30 * 1000;

/** Fecha de emisión del snapshot de referencia (solo para VN al vto) */
export const REFERENCE_AS_OF = "2026-03-19";
export const REFERENCE_AS_OF_DATE = new Date("2026-03-19");

/** Desviación máxima precio live vs teórico antes de marcar bad_live (%) */
export const MAX_PRICE_DEVIATION_PCT = 20; // más permisivo

/** Divergencia TNA live vs ref (pp) — solo informativa, no bloquea */
export const MAX_TNA_DIVERGENCE_PP = 10;

/** Límites sanity para tasas live. Valores fuera de rango se retiran de curvas y calculadoras. */
export const TNA_LIVE_MAX = 50;
export const TNA_LIVE_MIN = 0;
export const TEM_LIVE_MAX = 4;

/** Modo estricto: false = usa precio live si existe aunque falle validación */
export const STRICT_LIVE_VALIDATION = false;
