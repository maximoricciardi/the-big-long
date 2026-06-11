import type { FixedIncomeCashflowEvent, MetadataConfidence, MetadataSourceKind } from "./metadata";
import type { ValidationStatus } from "./confidence";

export type ScheduleEventType = "coupon" | "amortization" | "coupon_amortization" | "maturity";

export type ScheduleValidationResult = {
  status: ValidationStatus;
  reason?: string;
};

export type ScheduleEngineInput = {
  ticker: string;
  events: FixedIncomeCashflowEvent[];
  source: MetadataSourceKind;
  confidence: MetadataConfidence;
};

export type ScheduleEngineResult = {
  ticker: string;
  events: FixedIncomeCashflowEvent[];
  status: "reliable" | "partial" | "maturity_only" | "unavailable";
  validation: ScheduleValidationResult;
};

function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function validateSchedule(input: ScheduleEngineInput): ScheduleEngineResult {
  if (!input.events.length) {
    return {
      ticker: input.ticker,
      events: [],
      status: "unavailable",
      validation: { status: "unavailable", reason: "missing_schedule" },
    };
  }

  const invalid = input.events.find((event) => !isValidIsoDate(event.date));
  if (invalid) {
    return {
      ticker: input.ticker,
      events: input.events,
      status: "partial",
      validation: { status: "invalid", reason: "invalid_event_date" },
    };
  }

  const hasCashflow = input.events.some((event) => (event.couponAmount ?? 0) > 0 || (event.amortizationAmount ?? 0) > 0);
  const onlyMaturity = input.events.every((event) => event.eventType === "maturity");

  return {
    ticker: input.ticker,
    events: [...input.events].sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
    status: hasCashflow ? "reliable" : onlyMaturity ? "maturity_only" : "partial",
    validation: {
      status: input.source === "provider" ? "provider_verified" : input.source === "static_schedule" ? "validated" : "inferred",
    },
  };
}

export function nextScheduleEvent(events: FixedIncomeCashflowEvent[], now = new Date()) {
  return [...events]
    .filter((event) => new Date(event.date) > now)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))[0];
}
