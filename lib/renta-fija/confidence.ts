import type { MetadataConfidence, MetadataReviewStatus, MetadataSourceKind } from "./metadata";

export type ValidationStatus = "provider_verified" | "validated" | "stale" | "inferred" | "invalid" | "unavailable";

export type ConfidenceProfile = {
  source: MetadataSourceKind | "provider_verified" | "verified_provider_cashflow";
  confidence: MetadataConfidence;
  score: number;
  validationStatus: ValidationStatus;
};

export const CONFIDENCE_SCORE: Record<MetadataConfidence, number> = {
  highest: 100,
  high: 85,
  medium: 60,
  low: 30,
};

export function confidenceFromSource(source: MetadataSourceKind): ConfidenceProfile {
  if (source === "provider") {
    return { source: "provider_verified", confidence: "high", score: 85, validationStatus: "provider_verified" };
  }
  if (source === "static_schedule") {
    return { source, confidence: "medium", score: 60, validationStatus: "validated" };
  }
  if (source === "static_snapshot") {
    return { source, confidence: "medium", score: 55, validationStatus: "stale" };
  }
  if (source === "ticker_inference") {
    return { source, confidence: "low", score: 30, validationStatus: "inferred" };
  }
  return { source, confidence: "low", score: 0, validationStatus: "unavailable" };
}

export function reviewStatusFromConfidence(confidence: MetadataConfidence, source: MetadataSourceKind): MetadataReviewStatus {
  if (confidence === "highest" || (confidence === "high" && source === "provider")) return "verified";
  if (source === "ticker_inference") return "inferred";
  if (confidence === "low") return "needs_review";
  return "verified";
}

export function meetsConfidenceThreshold(
  confidence: MetadataConfidence,
  minimum: MetadataConfidence
) {
  return CONFIDENCE_SCORE[confidence] >= CONFIDENCE_SCORE[minimum];
}
