export interface BreakingNewsItem {
  text:  string;
  icon:  string;
  color: "red" | "gold" | "green";
  link?: { tab: string; sub?: string };
}

// Set to null to hide the breaking news bar
export const BREAKING_NEWS: BreakingNewsItem | null = {
  text:  "FMI: acuerdo con Argentina por USD 20.000M aprobado. Merval +6%, bonos soberanos suben hasta +4% en la rueda.",
  icon:  "🏦",
  color: "green",
  link:  { tab: "mercados" },
};
