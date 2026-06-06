"use client";

import { useMemo } from "react";
import useSWR from "swr";
import type { LiveNewsArticle } from "@/types";
import type { BreakingNewsItem } from "@/lib/data/breaking-news";

const REFRESH_MS = 20 * 60 * 1000;
const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<{ articles?: LiveNewsArticle[]; updatedAt?: string }>;
};

function pickColor(title: string): "red" | "gold" | "green" {
  const normalized = title.toLowerCase();
  if (/(sube|record|récord|acuerdo|mejora|rebote|ganan|alza)/i.test(normalized)) return "green";
  if (/(cae|caida|caída|crisis|default|retrocede|baja|guerra)/i.test(normalized)) return "red";
  return "gold";
}

export function useLiveNews(): {
  breakingNews: BreakingNewsItem | null;
  articles: LiveNewsArticle[];
  featuredArticle: LiveNewsArticle | null;
  lastUpdate: Date | null;
  status: "loading" | "ok" | "error";
} {
  const { data, error, isLoading } = useSWR("/api/news", fetcher, {
    refreshInterval: REFRESH_MS,
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  const articles = data?.articles ?? [];
  const status: "loading" | "ok" | "error" = error
    ? "error"
    : isLoading && articles.length === 0
      ? "loading"
      : "ok";
  const lastUpdate = data?.updatedAt ? new Date(data.updatedAt) : null;

  const featuredArticle = articles[0] ?? null;

  const breakingNews = useMemo<BreakingNewsItem | null>(() => {
    if (!featuredArticle) return null;

    return {
      text: featuredArticle.title,
      color: pickColor(featuredArticle.title),
      fuente: featuredArticle.sourceName,
      publishedLabel: featuredArticle.publishedLabel,
      href: featuredArticle.articleUrl,
      link: { tab: "mercados" },
    };
  }, [featuredArticle]);

  return { breakingNews, articles, featuredArticle, lastUpdate, status };
}
