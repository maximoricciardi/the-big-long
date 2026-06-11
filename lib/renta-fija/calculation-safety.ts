import type { FixedIncomeMetadata, MetadataConfidence } from "./metadata";
import { meetsConfidenceThreshold } from "./confidence";

export type CalculationSafetyResult = {
  ok: boolean;
  reasons: string[];
};

export function canUsePrice(price: number | null | undefined): CalculationSafetyResult {
  return price != null && Number.isFinite(price) && price > 0
    ? { ok: true, reasons: [] }
    : { ok: false, reasons: ["price_unavailable"] };
}

export function canCalculateWithSchedule(
  metadata: FixedIncomeMetadata | undefined,
  price: number | null | undefined,
  minimumConfidence: MetadataConfidence = "medium"
): CalculationSafetyResult {
  const reasons = [
    ...canUsePrice(price).reasons,
    ...(!metadata ? ["metadata_unavailable"] : []),
    ...(metadata && !metadata.maturityDate ? ["maturity_unavailable"] : []),
    ...(metadata && metadata.cashflowScheduleStatus !== "reliable" ? ["schedule_unavailable"] : []),
    ...(metadata && !meetsConfidenceThreshold(metadata.metadataConfidence, minimumConfidence) ? ["confidence_below_threshold"] : []),
  ];

  return { ok: reasons.length === 0, reasons };
}
