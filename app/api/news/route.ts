import type { LiveNewsArticle } from "@/types";
import { buildMeta, fetchTextWithRetry, jsonError, jsonWithMeta, normalizeError } from "@/lib/api/reliability";

export const dynamic = "force-dynamic";

const NEWS_CACHE_SECONDS = 900;

const GOOGLE_NEWS_BASE = "https://news.google.com/rss/search";

const PREFERRED_SOURCES = new Map<string, { tier: "preferred"; locale: "global" | "regional" }>([
  ["Bloomberg", { tier: "preferred", locale: "global" }],
  ["Bloomberg Línea", { tier: "preferred", locale: "regional" }],
  ["Reuters", { tier: "preferred", locale: "global" }],
  ["Financial Times", { tier: "preferred", locale: "global" }],
  ["The Wall Street Journal", { tier: "preferred", locale: "global" }],
  ["The Economist", { tier: "preferred", locale: "global" }],
  ["Infobae", { tier: "preferred", locale: "regional" }],
  ["Infobae Economía", { tier: "preferred", locale: "regional" }],
  ["El Cronista", { tier: "preferred", locale: "regional" }],
  ["Ámbito", { tier: "preferred", locale: "regional" }],
  ["Ambito", { tier: "preferred", locale: "regional" }],
]);

const SOURCE_SCORE: Record<string, number> = {
  Bloomberg: 100,
  Reuters: 96,
  "Financial Times": 93,
  "The Wall Street Journal": 91,
  "The Economist": 89,
  "Bloomberg Línea": 87,
  "Infobae Economía": 83,
  Infobae: 80,
  "El Cronista": 79,
  "Ámbito": 77,
  Ambito: 77,
};

const QUERY_GROUPS = [
  {
    locale: "global" as const,
    q: 'when:7d (site:reuters.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:economist.com) (markets OR earnings OR inflation OR rates OR stocks OR bonds)',
  },
  {
    locale: "regional" as const,
    q: 'when:7d (site:infobae.com OR site:cronista.com OR site:ambito.com OR site:bloomberglinea.com) (economia OR finanzas OR mercados OR dolar OR acciones OR bonos)',
  },
  {
    locale: "regional" as const,
    q: "when:7d Argentina finanzas economia mercados",
  },
];

type ParsedItem = {
  title: string;
  articleUrl: string;
  sourceName: string;
  sourceUrl: string | null;
  publishedAt: string;
  locale: "global" | "regional";
};

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function stripTags(value: string): string {
  return decodeXml(value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1] : null;
}

function extractSource(block: string): { name: string; url: string | null } | null {
  const match = block.match(/<source(?:\s+url="([^"]*)")?>([\s\S]*?)<\/source>/i);
  if (!match) return null;
  return {
    url: match[1] ? decodeXml(match[1]) : null,
    name: stripTags(match[2] ?? ""),
  };
}

function normalizeSourceName(sourceName: string): string {
  return sourceName
    .replace(/\s+-\s+Últimas noticias económicas y financieras$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(title: string, sourceName: string): string {
  const escapedSource = sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp(`\\s+-\\s+${escapedSource}$`, "i"), "").trim();
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function scoreArticle(article: ParsedItem): number {
  const sourceBase = SOURCE_SCORE[article.sourceName] ?? 35;
  const publishedMs = Date.parse(article.publishedAt);
  const ageHours = Number.isFinite(publishedMs) ? Math.max(0, (Date.now() - publishedMs) / 36e5) : 999;
  const freshness = Math.max(0, 30 - Math.min(ageHours, 30));
  return sourceBase + freshness;
}

function buildArticle(item: ParsedItem): LiveNewsArticle {
  const sourceMeta = PREFERRED_SOURCES.get(item.sourceName);
  const sourceDomain = (() => {
    if (!item.sourceUrl) return null;
    try {
      return new URL(item.sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })();
  const published = new Date(item.publishedAt);

  return {
    id: `${normalizeTitle(item.title)}-${item.sourceName.toLowerCase().replace(/\s+/g, "-")}`,
    title: cleanTitle(item.title, item.sourceName),
    articleUrl: item.articleUrl,
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    sourceDomain,
    sourceFaviconUrl: sourceDomain ? `https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=64` : null,
    publishedAt: Number.isNaN(published.getTime()) ? item.publishedAt : published.toISOString(),
    publishedLabel: Number.isNaN(published.getTime())
      ? "Sin horario"
      : published.toLocaleString("es-AR", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
    sourceTier: sourceMeta?.tier ?? "standard",
    locale: sourceMeta?.locale ?? item.locale,
  };
}

function parseFeed(xml: string, locale: "global" | "regional"): ParsedItem[] {
  return xml
    .split("<item>")
    .slice(1)
    .map((chunk) => chunk.split("</item>")[0] ?? "")
    .map((block) => {
      const title = stripTags(extractTag(block, "title") ?? "");
      const articleUrl = decodeXml(extractTag(block, "link") ?? "");
      const source = extractSource(block);
      const sourceName = normalizeSourceName(source?.name ?? "Google News");
      const publishedAt = decodeXml(extractTag(block, "pubDate") ?? "");

      return {
        title,
        articleUrl,
        sourceName,
        sourceUrl: source?.url ?? null,
        publishedAt,
        locale,
      };
    })
    .filter((item) => item.title && item.articleUrl && item.sourceName);
}

async function fetchFeed(query: string, locale: "global" | "regional"): Promise<ParsedItem[]> {
  const url = new URL(GOOGLE_NEWS_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("hl", "es-419");
  url.searchParams.set("gl", "AR");
  url.searchParams.set("ceid", "AR:es-419");

  const xml = await fetchTextWithRetry(url.toString(), {
    provider: "Google News RSS",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TheBigLong/2.0; +https://thebiglong.local)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    timeoutMs: 8_000,
    retries: 1,
    next: { revalidate: NEWS_CACHE_SECONDS },
  });

  return parseFeed(xml, locale);
}

export async function GET() {
  const startedAt = Date.now();
  const errors: Array<{ provider: string; message: string; status?: number }> = [];
  try {
    const feedGroups = await Promise.all(
      QUERY_GROUPS.map(async ({ q, locale }) => {
        try {
          return await fetchFeed(q, locale);
        } catch (err) {
          errors.push(normalizeError(err, "Google News RSS"));
          return [];
        }
      })
    );

    const deduped = new Map<string, ParsedItem>();

    for (const group of feedGroups) {
      for (const item of group) {
        const key = `${normalizeTitle(item.title)}::${item.sourceName.toLowerCase()}`;
        const current = deduped.get(key);
        if (!current || scoreArticle(item) > scoreArticle(current)) {
          deduped.set(key, item);
        }
      }
    }

    const articles = [...deduped.values()]
      .sort((a, b) => scoreArticle(b) - scoreArticle(a))
      .sort((a, b) => {
        if (a.sourceName === b.sourceName) {
          return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
        }
        return 0;
      })
      .map(buildArticle)
      .filter((article) => {
        if (article.sourceTier === "preferred") return true;
        return ![...PREFERRED_SOURCES.keys()].some((source) => article.sourceName.includes(source));
      })
      .slice(0, 24);

    return jsonWithMeta(
      {
        articles,
        count: articles.length,
        updatedAt: new Date().toISOString(),
        sources: [...new Set(articles.map((article) => article.sourceName))],
      },
      buildMeta({
        provider: "Google News RSS",
        source: GOOGLE_NEWS_BASE,
        status: articles.length > 0 && errors.length === 0 ? "ok" : articles.length > 0 ? "partial" : "empty",
        startedAt,
        cacheSeconds: NEWS_CACHE_SECONDS,
        staleAfterSeconds: NEWS_CACHE_SECONDS * 2,
        errors,
      }),
      { cacheSeconds: NEWS_CACHE_SECONDS, staleWhileRevalidateSeconds: NEWS_CACHE_SECONDS * 2 }
    );
  } catch (error) {
    return jsonError({ provider: "Google News RSS", source: GOOGLE_NEWS_BASE, startedAt, error, status: 502 });
  }
}
