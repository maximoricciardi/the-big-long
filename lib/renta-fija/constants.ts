export const REFERENCE_AS_OF = "2026-03-19";
export const REFERENCE_AS_OF_DATE = new Date("2026-03-19");

export const REFRESH_MS = 5 * 60 * 1000;

/** Max deviation of live price vs theoretical before flagging bad_live */
export const MAX_PRICE_DEVIATION_PCT = 15;

/** TNA live vs ref divergence (percentage points) before flagging */
export const MAX_TNA_DIVERGENCE_PP = 5;

export const TNA_LIVE_MAX = 200;
export const TNA_LIVE_MIN = 0;
