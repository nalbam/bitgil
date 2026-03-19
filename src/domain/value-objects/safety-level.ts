import type { SafetyLevel } from "@/lib/maps/types";

export const SAFETY_LEVEL_THRESHOLDS = {
  safe: 70,
  moderate: 40,
} as const;

export function scoreToSafetyLevel(score: number): SafetyLevel {
  if (score >= SAFETY_LEVEL_THRESHOLDS.safe) return "safe";
  if (score >= SAFETY_LEVEL_THRESHOLDS.moderate) return "moderate";
  return "caution";
}

export const SAFETY_LEVEL_LABELS: Record<SafetyLevel, string> = {
  safe: "Safe",
  moderate: "Moderate",
  caution: "Caution",
};
