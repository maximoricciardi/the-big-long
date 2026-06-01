// hooks/use-live-news.ts
// Fetch noticias RSS cada 20 minutos — retorna el item más reciente como breaking news

"use client";

import { useState, useEffect, useRef } from "react";
import type { BreakingNewsItem } from "@/lib/data/breaking-news";

interface NewsItem {
  title:  string;
  link:   string;
  pub:    Date;
  source: string;
}

const REFRESH_MS = 20 * 60 * 1000; // 20 minutos

function parseRSS(xml: string): NewsItem[] {
  try {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    return Array.from(doc.querySelectorAll("item"))
      .map(i => ({
        title:  i.querySelector("title")?.textContent?.trim() ?? "",
        link:   i.querySelector("link")?.textContent?.trim() ?? "",
        pub:    new Date(i.querySelector("pubDate")?.textContent ?? ""),
        source: i.querySelector("source")?.textContent?.trim() ?? "Google News",
      }))
      .filter(i => i.title && i.link)
      .sort((a, b) => b.pub.getTime() - a.pub.getTime());
  } catch { return []; }
}

function pickIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("dólar") || t.includes("peso") || t.includes("bcra")) return "💵";
  if (t.includes("bono") || t.includes("deuda") || t.includes("fmi")) return "🏦";
  if (t.includes("petróleo") || t.includes("brent") || t.includes("wti")) return "🛢️";
  if (t.includes("bitcoin") || t.includes("cripto")) return "₿";
  if (t.includes("merval") || t.includes("bolsa") || t.includes("accio")) return "📈";
  if (t.includes("inflaci")) return "📊";
  if (t.includes("milei") || t.includes("gobierno") || t.includes("polít")) return "🏛️";
  return "📰";
}

function pickColor(title: string): "red" | "gold" | "green" {
  const t = title.toLowerCase();
  if (t.includes("sube") || t.includes("récord") || t.includes("acuerdo") || t.includes("baja riesgo")) return "green";
  if (t.includes("cae") || t.includes("crisis") || t.includes("caída") || t.includes("default")) return "red";
  return "gold";
}

export function useLiveNews(): {
  breakingNews: BreakingNewsItem | null;
  news: NewsItem[];
  lastUpdate: Date | null;
} {
  const [news,       setNews]       = useState<NewsItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const indexRef = useRef(0); // rotates through top news items
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/news?q=" + encodeURIComponent("Argentina finanzas economia mercados"));
        if (!r.ok) return;
        const xml = await r.text();
        const items = parseRSS(xml);
        if (items.length) {
          setNews(items.slice(0, 30));
          setLastUpdate(new Date());
        }
      } catch {}
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Rotate breaking news item every 20 minutes
  useEffect(() => {
    if (!news.length) return;
    const id = setInterval(() => {
      setCurrentIdx(i => (i + 1) % Math.min(news.length, 5));
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [news.length]);

  const breakingNews: BreakingNewsItem | null = news.length > 0 ? {
    text:   news[currentIdx]?.title ?? news[0].title,
    icon:   pickIcon(news[currentIdx]?.title ?? news[0].title),
    color:  pickColor(news[currentIdx]?.title ?? news[0].title),
    fuente: news[currentIdx]?.source ?? news[0].source,
    link:   { tab: "mercados", sub: "noticias" },
  } : null;

  return { breakingNews, news, lastUpdate };
}
