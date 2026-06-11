import type { FixedIncomeMetadata, MetadataConfidence } from "./metadata";
import { meetsConfidenceThreshold } from "./confidence";

export type FixedIncomeAnalyticsReadiness = {
  canCalculate: boolean;
  missing: string[];
};

export type SovereignAnalytics = {
  duration?: number;
  modifiedDuration?: number;
  macaulayDuration?: number;
  convexity?: number;
  carry?: number;
  rollDown?: number;
};

export type CorporateCreditAnalytics = {
  issuer?: string;
  accruedInterest?: number;
  residualValue?: number;
  couponStructure?: string;
};

export function analyticsReadiness(
  metadata: FixedIncomeMetadata,
  {
    requireSchedule = true,
    minimumConfidence = "medium",
  }: {
    requireSchedule?: boolean;
    minimumConfidence?: MetadataConfidence;
  } = {}
): FixedIncomeAnalyticsReadiness {
  const missing = [
    ...(!metadata.maturityDate ? ["maturity"] : []),
    ...(requireSchedule && metadata.cashflowScheduleStatus !== "reliable" ? ["reliable_schedule"] : []),
    ...(!meetsConfidenceThreshold(metadata.metadataConfidence, minimumConfidence) ? ["metadata_confidence"] : []),
  ];

  return { canCalculate: missing.length === 0, missing };
}
