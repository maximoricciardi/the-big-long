"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";

interface EarningsItem {
  symbol: string;
  name: string;
  date: string;
  hour: string;
  epsEstimate: number | null;
  epsActual?: number | null;
  revenueEstimate?: number | null;
  revenueActual?: number | null;
  logo: string | null;
  companyDomain: string | null;
  logoFallback: string | null;
  reported?: boolean;
  beat?: boolean | null;
}

interface EarningsResponse {
  earnings: EarningsItem[];
  count: number;
  from: string;
  to: string;
  windowDays: number;
  source: string;
  logoStrategy: string;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function groupByDate(items: EarningsItem[]): Record<string, EarningsItem[]> {
  return items.reduce<Record<string, EarningsItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

function fmtRevenue(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

function formatHour(hour: string): string {
  if (hour === "bmo") return "Antes apertura";
  if (hour === "amc") return "Después cierre";
  return "Horario no informado";
}

function CompanyLogo({
  primary,
  fallback,
  symbol,
  t,
}: {
  primary: string | null;
  fallback: string | null;
  symbol: string;
  t: ReturnType<typeof useAppTheme>;
}) {
  const [activeSrc, setActiveSrc] = useState(primary ?? fallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setActiveSrc(primary ?? fallback);
    setFailed(false);
  }, [primary, fallback]);

  if (!activeSrc || failed) {
    return (
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: t.alt,
          border: `1px solid ${t.brd}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: t.mu }}>
          {symbol.slice(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={symbol}
      width={42}
      height={42}
      onError={() => {
        if (activeSrc !== fallback && fallback) {
          setActiveSrc(fallback);
          return;
        }
        setFailed(true);
      }}
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        objectFit: "contain",
        background: "#fff",
        border: `1px solid ${t.brd}`,
        padding: 5,
        flexShrink: 0,
      }}
    />
  );
}

export function EarningsCalendar() {
  const t = useAppTheme();
  const [payload, setPayload] = useState<EarningsResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"upcoming" | "reported">("upcoming");
  const [sessionFilter, setSessionFilter] = useState<"all" | "bmo" | "amc">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/earnings", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json() as EarningsResponse;
        setPayload(json);
        setStatus("ok");
        setLastUpdate(new Date());
      } catch {
        setStatus("error");
      }
    };

    load();
    const timer = setInterval(load, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const earnings = payload?.earnings ?? [];
  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    return earnings.filter((item) => {
      if (filter === "upcoming" && item.date < today) return false;
      if (filter === "reported" && !item.reported) return false;
      if (sessionFilter !== "all" && item.hour !== sessionFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [earnings, filter, search, sessionFilter, today]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const logoCoverage = earnings.filter((item) => item.logo || item.logoFallback).length;

  const statCards = [
    { label: "Eventos", value: String(filtered.length) },
    { label: "Próximos", value: String(earnings.filter((item) => item.date >= today).length) },
    { label: "BMO / AMC", value: `${earnings.filter((item) => item.hour === "bmo").length} / ${earnings.filter((item) => item.hour === "amc").length}` },
    { label: "Logo coverage", value: `${earnings.length ? Math.round((logoCoverage / earnings.length) * 100) : 0}%` },
  ];

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(145deg, #0f172a, #162235 58%, #1f3d5b)",
          borderRadius: 18,
          padding: "22px 24px",
          marginBottom: 18,
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 22px 50px rgba(15,23,42,.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 5 }}>
              FINANZAS CORPORATIVAS
            </div>
            <h2 style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>
              Calendario de <span style={{ color: "#7db5f0" }}>Resultados</span>
            </h2>
            <p style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,.65)", margin: "8px 0 0", lineHeight: 1.6 }}>
              Ventana activa: {payload?.windowDays ?? 14} días · Fuente {payload?.source ?? "Nasdaq public earnings calendar"} · Logos con fallback institucional.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.07)",
              borderRadius: 12,
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: status === "ok" ? "#22c55e" : "#f59e0b",
                boxShadow: status === "ok" ? "0 0 8px #22c55e" : "none",
              }}
            />
            <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,.8)" }}>
              {status === "loading" && "Sincronizando"}
              {status === "error" && "Error de actualización"}
              {status === "ok" && lastUpdate && `Act. ${lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
          {statCards.map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "11px 12px" }}>
              <div style={{ fontFamily: FB, fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,.48)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 700, color: "#fff" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", background: t.alt, borderRadius: 10, padding: 3, border: `1px solid ${t.brd}`, gap: 2 }}>
          {([["upcoming", "Próximos"], ["reported", "Reportados"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                fontFamily: FB,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: filter === id ? t.bl : "transparent",
                color: filter === id ? "#fff" : t.mu,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", background: t.alt, borderRadius: 10, padding: 3, border: `1px solid ${t.brd}`, gap: 2 }}>
          {([["all", "Todo"], ["bmo", "Pre"], ["amc", "Post"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSessionFilter(id)}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                fontFamily: FB,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: sessionFilter === id ? t.go : "transparent",
                color: sessionFilter === id ? "#fff" : t.mu,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar ticker o empresa"
          style={{
            fontFamily: FB,
            fontSize: 12,
            padding: "8px 12px",
            borderRadius: 10,
            width: 220,
            border: `1.5px solid ${t.brd}`,
            background: t.srf,
            color: t.tx,
            outline: "none",
          }}
        />

        <span style={{ marginLeft: "auto", fontFamily: FB, fontSize: 9, color: t.fa }}>
          Logos: {payload?.logoStrategy ?? "Clearbit + fallback"}.
        </span>
      </div>

      {status === "loading" && (
        <div style={{ display: "grid", gap: 8 }}>
          {[1, 2, 3].map((item) => (
            <div key={item} style={{ height: 92, background: t.alt, borderRadius: 16, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      )}

      {status === "error" && (
        <div style={{ textAlign: "center", padding: "48px 0", fontFamily: FB, fontSize: 13, color: t.mu }}>
          No pudimos actualizar el calendario en vivo. La integración usa Nasdaq y reintenta automáticamente.
        </div>
      )}

      {status === "ok" && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", fontFamily: FB, fontSize: 13, color: t.mu }}>
          No hay compañías para el filtro seleccionado.
        </div>
      )}

      {status === "ok" && sortedDates.map((date) => {
        const items = grouped[date];
        const isToday = date === today;
        const isPast = date < today;

        return (
          <div key={date} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  padding: "5px 14px",
                  borderRadius: 999,
                  background: isToday ? t.bl : isPast ? t.alt : t.srf,
                  border: `1px solid ${isToday ? t.bl : t.brd}`,
                  fontFamily: FB,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isToday ? "#fff" : t.mu,
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {isToday ? "Hoy" : formatDate(date)}
              </div>
              <div style={{ flex: 1, height: 1, background: t.brd }} />
              <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>
                {items.length} compañía{items.length > 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 10 }}>
              {items.map((item) => {
                const accentColor = item.beat === true ? t.gr : item.beat === false ? t.rd : t.bl;
                return (
                  <div
                    key={`${item.symbol}-${item.date}`}
                    className="premium-hover"
                    style={{
                      background: t.srf,
                      border: `1px solid ${t.brd}`,
                      borderRadius: 16,
                      padding: "15px 16px",
                      borderTop: `3px solid ${accentColor}`,
                      opacity: isPast ? 0.86 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <CompanyLogo primary={item.logo} fallback={item.logoFallback} symbol={item.symbol} t={t} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: t.bl }}>
                            {item.symbol}
                          </span>
                          <span style={{ fontFamily: FB, fontSize: 8, fontWeight: 700, color: t.go, background: t.goBg, borderRadius: 999, padding: "3px 7px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                            {formatHour(item.hour)}
                          </span>
                        </div>
                        <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.tx, lineHeight: 1.35 }}>
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      <div style={{ background: t.alt, borderRadius: 10, padding: "8px 10px" }}>
                        <div style={{ fontFamily: FB, fontSize: 8, color: t.fa, marginBottom: 2 }}>EPS estimado</div>
                        <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: t.tx }}>
                          {item.epsEstimate != null ? `$${item.epsEstimate.toFixed(2)}` : "—"}
                        </div>
                      </div>
                      <div style={{ background: t.alt, borderRadius: 10, padding: "8px 10px" }}>
                        <div style={{ fontFamily: FB, fontSize: 8, color: t.fa, marginBottom: 2 }}>Revenue</div>
                        <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: t.tx }}>
                          {fmtRevenue(item.revenueEstimate)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontFamily: FB, fontSize: 10, color: t.mu }}>
                        {item.companyDomain ?? "Logo pendiente de mapear"}
                      </div>
                      <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: item.reported ? t.gr : t.mu, background: item.reported ? t.grBg : t.alt, border: `1px solid ${item.reported ? `${t.gr}33` : t.brd}`, borderRadius: 999, padding: "4px 8px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {item.reported ? "Reportado" : "Pendiente"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
