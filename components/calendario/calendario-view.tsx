"use client";

import { useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { FB, FH } from "@/lib/constants";
import { RentaFijaMarketProvider, useRentaFijaMarketContext } from "@/components/renta-fija/renta-fija-market-context";
import { normalizeFixedIncomeTicker, selectFixedIncomeUniverse, type FixedIncomeCategoryId } from "@/lib/renta-fija";

type InstrumentoTipo = "LECAP" | "BONCAP" | "Soberano" | "Dólar Linked" | "Dual" | "CER" | "BOPREAL" | "ON / Crédito";
type EventoTipo = "Renta" | "Amortización" | "Renta + Amort." | "Vencimiento" | "Cronograma no disponible";

type CalendarEvent = {
  fecha: Date;
  fechaLabel: string;
  ticker: string;
  evento: EventoTipo;
  montoPor1000: number;
  instrumento: InstrumentoTipo;
  source: "schedule" | "maturity";
  status: "defensible" | "metadata-only";
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDateDDMMYYYY(raw: string): Date | null {
  const [dd, mm, yy] = raw.split("/").map(Number);
  if (!dd || !mm || !yy) return null;
  return new Date(yy, mm - 1, dd);
}

function parseISODate(raw: string): Date | null {
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("es-AR", { month: "long", year: "numeric" }).toUpperCase();
}

function getEventoTipo(cpn: number, amort: number): EventoTipo | null {
  if (amort > 0 && cpn > 0) return "Renta + Amort.";
  if (amort > 0) return "Amortización";
  if (cpn > 0) return "Renta";
  return null;
}

function eventColor(t: ReturnType<typeof useAppTheme>, evento: EventoTipo) {
  if (evento === "Renta") return { fg: t.gr, bg: t.grBg, brd: `${t.gr}55` };
  if (evento === "Amortización" || evento === "Vencimiento") return { fg: t.go, bg: t.goBg, brd: `${t.go}55` };
  if (evento === "Cronograma no disponible") return { fg: t.fa, bg: t.alt, brd: `${t.brd}` };
  return { fg: t.tx, bg: t.alt, brd: `${t.brd}` };
}

function instrumentoColor(t: ReturnType<typeof useAppTheme>, instrumento: InstrumentoTipo) {
  if (instrumento === "LECAP") return { fg: t.go, bg: t.goBg, brd: `${t.go}55` };
  if (instrumento === "Soberano") return { fg: t.bl, bg: t.blBg, brd: `${t.bl}55` };
  return { fg: t.mu, bg: t.alt, brd: `${t.brd}` };
}

type MonthGroup = {
  key: string;
  label: string;
  rows: CalendarEvent[];
};

function buildMonthGroups(events: CalendarEvent[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const ev of events) {
    const key = monthKey(ev.fecha);
    const existing = map.get(key);
    if (existing) {
      existing.rows.push(ev);
    } else {
      map.set(key, { key, label: monthLabel(ev.fecha), rows: [ev] });
    }
  }
  return [...map.values()].sort((a, b) => a.rows[0].fecha.getTime() - b.rows[0].fecha.getTime());
}

function labelForCategory(category: FixedIncomeCategoryId): InstrumentoTipo {
  if (category === "lecap") return "LECAP";
  if (category === "boncap") return "BONCAP";
  if (category === "sovereign") return "Soberano";
  if (category === "dollar_linked") return "Dólar Linked";
  if (category === "dual") return "Dual";
  if (category === "cer") return "CER";
  if (category === "bopreal") return "BOPREAL";
  return "ON / Crédito";
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  const t = useAppTheme();
  return (
    <th style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".08em", textTransform:"uppercase", borderBottom:`2px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap", position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
}

function Td({ children, right, bold, color }: { children: React.ReactNode; right?: boolean; bold?: boolean; color?: string }) {
  const t = useAppTheme();
  return (
    <td style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:12, fontWeight:bold?700:400, color:color||t.tx, whiteSpace:"nowrap" }}>
      {children}
    </td>
  );
}

function CalendarioViewInner() {
  const t = useAppTheme();
  const { discovered } = useRentaFijaMarketContext();

  const events = useMemo<CalendarEvent[]>(() => {
    const today = startOfDay(new Date());
    const in90 = new Date(today);
    in90.setDate(in90.getDate() + 90);

    const out: CalendarEvent[] = [];
    const universe = selectFixedIncomeUniverse(discovered);
    const seen = new Set<string>();

    for (const row of universe.calendarEligible) {
      const flows = row.metadata.cashflows;
      let addedScheduleEvent = false;
      for (const flow of flows) {
        const fecha = parseISODate(flow.date);
        if (!fecha) continue;
        const f = startOfDay(fecha);
        if (f < today || f > in90) continue;
        const evento = flow.eventType === "coupon_amortization"
          ? "Renta + Amort."
          : flow.eventType === "amortization"
            ? "Amortización"
            : flow.eventType === "coupon"
              ? "Renta"
              : getEventoTipo(flow.couponAmount ?? 0, flow.amortizationAmount ?? 0);
        if (!evento) continue;
        const key = `${normalizeFixedIncomeTicker(row.ticker)}-${flow.date}-${evento}`;
        if (seen.has(key)) continue;
        seen.add(key);
        addedScheduleEvent = true;
        out.push({
          fecha: f,
          fechaLabel: formatDate(f),
          ticker: row.ticker,
          evento,
          montoPor1000: ((flow.couponAmount ?? 0) + (flow.amortizationAmount ?? 0)) * 10,
          instrumento: labelForCategory(row.category),
          source: "schedule",
          status: "defensible",
        });
      }

      if (addedScheduleEvent) continue;

      const maturityLabel = row.maturity;
      const maturity = maturityLabel ? parseDateDDMMYYYY(maturityLabel) : null;
      if (!maturity || !maturityLabel) continue;
      const fecha = startOfDay(maturity);
      if (fecha < today || fecha > in90) continue;
      const key = `${normalizeFixedIncomeTicker(row.ticker)}-${maturityLabel}-maturity`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        fecha,
        fechaLabel: maturityLabel,
        ticker: row.ticker,
        evento: row.hasSchedule ? "Vencimiento" : "Cronograma no disponible",
        montoPor1000: row.category === "lecap" || row.category === "boncap" ? 1000 : 0,
        instrumento: labelForCategory(row.category),
        source: "maturity",
        status: row.hasSchedule ? "defensible" : "metadata-only",
      });
    }

    out.sort((a, b) => a.fecha.getTime() - b.fecha.getTime() || a.ticker.localeCompare(b.ticker));
    return out;
  }, [discovered]);

  const monthGroups = useMemo(() => buildMonthGroups(events), [events]);

  const tableCtr: React.CSSProperties = {
    background: t.srf,
    border: `1px solid ${t.brd}`,
    borderRadius: 14,
    overflow: "hidden",
    overflowX: "auto",
  };

  return (
    <div className="fade-up">
      <SectionLabel t={t}>CALENDARIO · EVENTOS DE PAGO (90 DÍAS)</SectionLabel>

      <Card t={t} style={{ marginTop: 14, marginBottom: 16 }}>
        <div style={{ padding:"14px 18px", display:"flex", alignItems:"baseline", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontFamily:FH, fontSize:18, fontWeight:800, color:t.tx }}>Rentas, amortizaciones y vencimientos</div>
            <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
              Próximos 90 días de flujos para LECAPs y soberanos USD, ordenados por fecha y agrupados por mes.
            </div>
          </div>
          <div style={{ fontFamily:FB, fontSize:11, color:t.fa, fontVariantNumeric:"tabular-nums" }}>
            {events.length} evento{events.length === 1 ? "" : "s"}
          </div>
        </div>
      </Card>

      <div style={tableCtr}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Ticker</Th>
              <Th>Tipo de evento</Th>
              <Th right>Monto por c/$1.000 VN</Th>
              <Th>Instrumento</Th>
              <Th>Fuente</Th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding:"26px 14px", textAlign:"center", fontFamily:FB, color:t.mu }}>
                  No hay pagos ni vencimientos con metadata disponible dentro de los próximos 90 días.
                </td>
              </tr>
            ) : (
              monthGroups.flatMap(group => [
                <tr key={`month-${group.key}`} style={{ background: t.alt, borderTop:`1px solid ${t.brd}`, borderBottom:`1px solid ${t.brd}` }}>
                  <td colSpan={6} style={{ padding:"8px 12px", fontFamily:FB, fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:t.mu }}>
                    {group.label}
                  </td>
                </tr>,
                ...group.rows.map((ev, idx) => {
                  const evColor = eventColor(t, ev.evento);
                  const insColor = instrumentoColor(t, ev.instrumento);
                  return (
                    <tr key={`${group.key}-${ev.ticker}-${ev.fechaLabel}-${idx}`} style={{ borderBottom:`1px solid ${t.brd}` }}>
                      <Td bold>{ev.fechaLabel}</Td>
                      <Td bold><span style={{ fontFamily:"monospace" }}>{ev.ticker}</span></Td>
                      <Td>
                        <span style={{
                          fontFamily: FB,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: 8,
                          border: `1px solid ${evColor.brd}`,
                          background: evColor.bg,
                          color: evColor.fg,
                        }}>
                          {ev.evento}
                        </span>
                      </Td>
                      <Td right bold>
                        {ev.montoPor1000 > 0 ? `$${ev.montoPor1000.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                      </Td>
                      <Td>
                        <span style={{
                          fontFamily: FB,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: 8,
                          border: `1px solid ${insColor.brd}`,
                          background: insColor.bg,
                          color: insColor.fg,
                        }}>
                          {ev.instrumento}
                        </span>
                      </Td>
                      <Td>
                        <span style={{ fontFamily:FB, fontSize:9, color:ev.status === "defensible" ? t.gr : t.fa }}>
                          {ev.source === "schedule" ? "Cronograma" : ev.status === "defensible" ? "Vencimiento" : "Solo vencimiento · sin cronograma"}
                        </span>
                      </Td>
                    </tr>
                  );
                }),
              ])
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:10 }}>
        Universo live DATA912 + metadata confiable disponible. No se inventan cupones, amortizaciones ni fechas de pago.
      </p>
    </div>
  );
}

export function CalendarioView() {
  return (
    <RentaFijaMarketProvider>
      <CalendarioViewInner />
    </RentaFijaMarketProvider>
  );
}
