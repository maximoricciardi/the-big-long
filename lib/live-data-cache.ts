export type LocalCacheState = "empty" | "fresh" | "stale";

export interface LocalCacheRead<T> {
  data: T | null;
  state: LocalCacheState;
  savedAt: number | null;
  ageMs: number | null;
}

interface LocalCacheEnvelope<T> {
  version: 1;
  savedAt: number;
  data: T;
  meta?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEnvelope(value: unknown): value is LocalCacheEnvelope<unknown> {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.savedAt === "number" &&
    "data" in value
  );
}

export function readTimestampedCache<T>(
  key: string,
  ttlMs: number,
  normalize: (value: unknown) => T | null,
): LocalCacheRead<T> {
  if (typeof window === "undefined") {
    return { data: null, state: "empty", savedAt: null, ageMs: null };
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { data: null, state: "empty", savedAt: null, ageMs: null };

    const parsed = JSON.parse(raw) as unknown;
    if (isEnvelope(parsed)) {
      const data = normalize(parsed.data);
      if (!data) return { data: null, state: "empty", savedAt: null, ageMs: null };

      const ageMs = Math.max(0, Date.now() - parsed.savedAt);
      return {
        data,
        state: ageMs <= ttlMs ? "fresh" : "stale",
        savedAt: parsed.savedAt,
        ageMs,
      };
    }

    const legacyData = normalize(parsed);
    return legacyData
      ? { data: legacyData, state: "stale", savedAt: null, ageMs: null }
      : { data: null, state: "empty", savedAt: null, ageMs: null };
  } catch {
    return { data: null, state: "empty", savedAt: null, ageMs: null };
  }
}

export function writeTimestampedCache<T>(key: string, data: T, meta?: unknown) {
  if (typeof window === "undefined") return;

  try {
    const envelope: LocalCacheEnvelope<T> = {
      version: 1,
      savedAt: Date.now(),
      data,
      ...(meta !== undefined ? { meta } : {}),
    };
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Browser storage can be unavailable in private mode or quota-limited.
  }
}
