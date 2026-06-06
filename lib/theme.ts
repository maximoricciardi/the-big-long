import type { ThemeTokens } from "@/types";

export const TH: { l: ThemeTokens; d: ThemeTokens } = {
  l: {
    bg:    "#F5F2EA", srf:   "#FFFEFA",  alt:  "#ECE7DC", brd:  "#D8D0C2",
    tx:    "#111827", mu:    "#5C6675",  fa:   "#8B9380",
    go:    "#9A6A2F", goBg:  "#F3E8D3",  goAcc:"#B88945",
    gr:    "#1F6B45", grBg:  "#E8F3EC",  grAcc:"#2B8A5B",
    rd:    "#A33A34", rdBg:  "#F6E7E4",  rdAcc:"#C8524A",
    bl:    "#2F5D86", blBg:  "#E6EEF5",  blAcc:"#4378A5",
    pu:    "#665A8D", puBg:  "#ECE8F4",
    hdr:   "rgba(255,254,250,.88)", tick:  "#0B0F16",  tickT:"#A6ADBB",
    ft:    "#080B10", ftT:   "#F2F0EA",
    sh:    "0 1px 2px rgba(17,24,39,.04), 0 14px 40px rgba(17,24,39,.07)",
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
    bg:    "#070A0F", srf:   "#0F141B",  alt:  "#151B23", brd:  "#27303A",
    tx:    "#F3F0E8", mu:    "#A2A9B4",  fa:   "#6F7886",
    go:    "#C6A15B", goBg:  "#211A0D",  goAcc:"#D8B76C",
    gr:    "#74B88A", grBg:  "#102016",  grAcc:"#8BCB9A",
    rd:    "#D5766E", rdBg:  "#251313",  rdAcc:"#E48D83",
    bl:    "#8AA7C7", blBg:  "#111D2A",  blAcc:"#A2BEDB",
    pu:    "#A79BC7", puBg:  "#1A1728",
    hdr:   "rgba(11,15,22,.86)", tick:  "#030507",  tickT:"#7E8795",
    ft:    "#030507", ftT:   "#F3F0E8",
    sh:    "0 1px 2px rgba(0,0,0,.35), 0 18px 50px rgba(0,0,0,.28)",
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
