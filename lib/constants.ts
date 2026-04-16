import {
  Home, ClipboardList, DollarSign, BarChart3, Package, Search,
} from "lucide-react";
import type { TabDef } from "@/types";

/* ── Contact ─────────────────────────────────────────────── */
export const CONTACT = {
  name:  "Máximo Ricciardi",
  title: "Asesor Financiero",
  phone: "",
  email: "",
} as const;

/* ── WhatsApp ────────────────────────────────────────────── */
const WA_NUM = ""; // set phone number here
export const WA_LINK = (msg: string) =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

/* ── Fonts ───────────────────────────────────────────────── */
export const FH = "'Sora','IBM Plex Sans',sans-serif";
export const FB = "'IBM Plex Sans',sans-serif";
export const FD = "'Playfair Display','Georgia',serif";

/* ── Tabs ────────────────────────────────────────────────── */
export const TABS: TabDef[] = [
  { id:"inicio",        label:"Inicio",        Icon:Home,         desc:"Dashboard y resumen del día" },
  { id:"mercados",      label:"Mercados",       Icon:DollarSign,   desc:"Cotizaciones, FX y noticias live" },
  { id:"rentafija",     label:"Renta Fija",     Icon:ClipboardList,desc:"LECAPs, soberanos, ONs y plazos fijos" },
  { id:"rentavariable", label:"Renta Variable", Icon:BarChart3,    desc:"CEDEARs y screener de equities" },
  { id:"productos",     label:"Productos",      Icon:Package,      desc:"FCIs y ETPs Balanz" },
  { id:"research",      label:"Research",       Icon:Search,       desc:"Resúmenes, balances y recomendaciones" },
];

export const VALID_TABS = TABS.map(t => t.id);

/* ── API endpoints ───────────────────────────────────────── */
export const FINNHUB_PROXY = "/api/quote?symbol";

/* ── FX Fallback values (verified 09 ABR 2026) ──────────── */
export const FX_FALLBACK = {
  oficial:         { compra: 1395, venta: 1420 },
  blue:            { compra: 1415, venta: 1440 },
  bolsa:           { compra: 1405, venta: 1412 },
  contadoconliqui: { compra: 1430, venta: 1455 },
  mayorista:       { compra: 1380, venta: 1382 },
};

export const RIESGO_PAIS_FALLBACK = { valor: 618, fecha: "09 ABR 2026" };

/* ── Admin PIN ───────────────────────────────────────────── */
export const ADMIN_PIN = "1243";

/* ── Live market localStorage key ───────────────────────── */
export const LIVE_MARKET_KEY = "tbl-live-market";
