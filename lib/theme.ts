import type { ThemeTokens } from "@/types";

export const TH: { l: ThemeTokens; d: ThemeTokens } = {
  l: {
    bg:    "#FAF9F6", srf:   "#FFFFFF",  alt:  "#F3F1EB", brd:  "#E6E2D9",
    tx:    "#0C1B30", mu:    "#64748B",  fa:   "#94A3B8",
    go:    "#B0782A", goBg:  "#FEF9EC",  goAcc:"#F59E0B",
    gr:    "#166534", grBg:  "#F0FDF4",  grAcc:"#22C55E",
    rd:    "#B91C1C", rdBg:  "#FEF2F2",  rdAcc:"#EF4444",
    bl:    "#1E40AF", blBg:  "#EFF6FF",  blAcc:"#3B82F6",
    pu:    "#6D28D9", puBg:  "#F5F3FF",
    hdr:   "#FFFFFF", tick:  "#0C1B30",  tickT:"#94A3B8",
    ft:    "#0C1B30", ftT:   "#E2E8F0",
    sh:    "0 1px 3px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.05)",
    badge: {
      green:  { bg:"#DCFCE7", tx:"#166534" },
      red:    { bg:"#FEE2E2", tx:"#B91C1C" },
      blue:   { bg:"#DBEAFE", tx:"#1E40AF" },
      gold:   { bg:"#FEF3C7", tx:"#92400E" },
      gray:   { bg:"#F3F4F6", tx:"#374151" },
      purple: { bg:"#EDE9FE", tx:"#6D28D9" },
    },
  },
  d: {
    bg:    "#0D1117", srf:   "#161B22",  alt:  "#1C2128", brd:  "#30363D",
    tx:    "#E6EDF3", mu:    "#8B949E",  fa:   "#6E7681",
    go:    "#D4A853", goBg:  "#1A1500",  goAcc:"#F59E0B",
    gr:    "#3FB950", grBg:  "#0A2012",  grAcc:"#22C55E",
    rd:    "#F85149", rdBg:  "#1F0D0D",  rdAcc:"#F87171",
    bl:    "#58A6FF", blBg:  "#0B1A30",  blAcc:"#60A5FA",
    pu:    "#A371F7", puBg:  "#1A1240",
    hdr:   "#161B22", tick:  "#010409",  tickT:"#6E7681",
    ft:    "#010409", ftT:   "#E6EDF3",
    sh:    "0 1px 3px rgba(0,0,0,.3), 0 6px 20px rgba(0,0,0,.2)",
    badge: {
      green:  { bg:"#0A2012", tx:"#3FB950" },
      red:    { bg:"#1F0D0D", tx:"#F85149" },
      blue:   { bg:"#0B1A30", tx:"#58A6FF" },
      gold:   { bg:"#1A1500", tx:"#D4A853" },
      gray:   { bg:"#21262D", tx:"#8B949E" },
      purple: { bg:"#1A1240", tx:"#A371F7" },
    },
  },
};
