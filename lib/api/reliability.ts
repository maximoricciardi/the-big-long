import { NextResponse } from "next/server";

export type ProviderStatus = "ok" | "partial" | "empty" | "error";

export type ProviderMeta = {
  provider: string;
  source: string;
  status: ProviderStatus;
  fetchedAt: string;
  latencyMs: number;
  cacheSeconds?: number;
  staleAfterSeconds?: number;
  errors?: Array<{ provider: string; message: string; status?: number }>;
};

type FetchJsonOptions = {
  provider: string;
  timeoutMs?: number;
  retries?: number;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: RequestInit["next"];
};

export class ProviderError extends Error {
  provider: string;
  status?: number;

  constructor(provider: string, message: string, status?: number) {
    super(message);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
  }
}

export function normalizeError(err: unknown, provider = "unknown") {
  if (err instanceof ProviderError) {
    return { provider: err.provider, message: err.message, status: err.status };
  }
  if (err instanceof Error) return { provider, message: err.message };
  return { provider, message: "Unknown provider error" };
}

async function parseJsonSafe<T>(response: Response, provider: string): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ProviderError(provider, "Provider returned invalid JSON", response.status);
  }
}

export async function fetchJsonWithRetry<T>(
  url: string,
  {
    provider,
    timeoutMs = 8_000,
    retries = 1,
    headers,
    cache,
    next,
  }: FetchJsonOptions
): Promise<T> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        cache,
        next,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new ProviderError(provider, `Provider returned HTTP ${response.status}`, response.status);
      }

      return await parseJsonSafe<T>(response, provider);
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new ProviderError(provider, "Unknown provider failure");
}

export async function fetchTextWithRetry(
  url: string,
  {
    provider,
    timeoutMs = 8_000,
    retries = 1,
    headers,
    cache,
    next,
  }: FetchJsonOptions
): Promise<string> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        cache,
        next,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new ProviderError(provider, `Provider returned HTTP ${response.status}`, response.status);
      }

      return await response.text();
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new ProviderError(provider, "Unknown provider failure");
}

export function buildMeta({
  provider,
  source,
  status,
  startedAt,
  cacheSeconds,
  staleAfterSeconds,
  errors,
}: {
  provider: string;
  source: string;
  status: ProviderStatus;
  startedAt: number;
  cacheSeconds?: number;
  staleAfterSeconds?: number;
  errors?: Array<{ provider: string; message: string; status?: number }>;
}): ProviderMeta {
  return {
    provider,
    source,
    status,
    fetchedAt: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    cacheSeconds,
    staleAfterSeconds,
    ...(errors?.length ? { errors } : {}),
  };
}

export function jsonWithMeta<T extends Record<string, unknown>>(
  body: T,
  meta: ProviderMeta,
  init?: { status?: number; cacheSeconds?: number; staleWhileRevalidateSeconds?: number }
) {
  const cacheSeconds = init?.cacheSeconds ?? meta.cacheSeconds;
  const staleSeconds = init?.staleWhileRevalidateSeconds ?? meta.staleAfterSeconds;
  const headers: Record<string, string> = {};
  if (cacheSeconds != null) {
    headers["Cache-Control"] = `s-maxage=${cacheSeconds}${staleSeconds != null ? `, stale-while-revalidate=${staleSeconds}` : ""}`;
  }
  return NextResponse.json({ ...body, _meta: meta }, { status: init?.status, headers });
}

export function jsonError({
  provider,
  source,
  startedAt,
  error,
  status = 502,
  cacheSeconds,
}: {
  provider: string;
  source: string;
  startedAt: number;
  error: unknown;
  status?: number;
  cacheSeconds?: number;
}) {
  const normalized = normalizeError(error, provider);
  return jsonWithMeta(
    { error: normalized.message },
    buildMeta({
      provider,
      source,
      status: "error",
      startedAt,
      cacheSeconds,
      errors: [normalized],
    }),
    { status, cacheSeconds }
  );
}

