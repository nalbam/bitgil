import type { DomainFacility } from "@/domain/entities/facility";
import type {
  ExtendedFacilityType,
  FacilityInfluence,
  SafetyFactor,
  SafetyScore,
} from "@/lib/maps/types";
import { scoreToSafetyLevel } from "@/domain/value-objects/safety-level";

interface ScoringInput {
  facilities: DomainFacility[];
  hasUnlitSegment?: boolean;
}

const FACILITY_WEIGHTS: Record<ExtendedFacilityType, number> = {
  streetlight: 8,
  cctv: 10,
  police: 15,
  police_station: 15,
  crosswalk: 5,
  danger: -25,
  emergency_bell: 7,
};

const FACILITY_LABELS: Record<ExtendedFacilityType, string> = {
  streetlight: "Streetlight",
  cctv: "CCTV Camera",
  police: "Police Presence",
  police_station: "Police Station",
  crosswalk: "Crosswalk",
  danger: "Danger Zone",
  emergency_bell: "Emergency Bell",
};

const BASE_SCORE = 50;
const UNLIT_PENALTY = -10;
const MAX_SCORE = 100;
const MIN_SCORE = 0;

export function calculateRouteSafety(input: ScoringInput): SafetyScore {
  const factors: SafetyFactor[] = [];
  let delta = 0;

  const typeCounts: Partial<Record<ExtendedFacilityType, number>> = {};
  for (const f of input.facilities) {
    typeCounts[f.type] = (typeCounts[f.type] ?? 0) + 1;
  }

  for (const [rawType, count] of Object.entries(typeCounts)) {
    const type = rawType as ExtendedFacilityType;
    if (!(type in FACILITY_WEIGHTS)) continue;
    const weight = FACILITY_WEIGHTS[type] ?? 0;
    const impact = weight * (count ?? 0);
    delta += impact;
    factors.push({
      type,
      label: FACILITY_LABELS[type] ?? type,
      impact,
      description: buildFactorDescription(type, count ?? 0, impact),
    });
  }

  if (input.hasUnlitSegment) {
    delta += UNLIT_PENALTY;
    factors.push({
      type: "dark_segment",
      label: "Unlit Segment",
      impact: UNLIT_PENALTY,
      description: "Part of this route passes through a poorly-lit area.",
    });
  }

  const raw = BASE_SCORE + delta;
  const score = Math.min(MAX_SCORE, Math.max(MIN_SCORE, raw));

  return {
    score: Math.round(score),
    level: scoreToSafetyLevel(score),
    factors,
  };
}

export function buildFacilityInfluences(facilities: DomainFacility[]): FacilityInfluence[] {
  return facilities.map((f) => {
    const weight = FACILITY_WEIGHTS[f.type] ?? 0;
    return {
      facilityId: f.id,
      facilityType: f.type,
      label: f.name,
      impact: weight >= 0 ? "positive" : "negative",
      weight: Math.abs(weight) / 25,
    };
  });
}

function buildFactorDescription(
  type: ExtendedFacilityType,
  count: number,
  impact: number,
): string {
  const sign = impact >= 0 ? "+" : "";
  switch (type) {
    case "streetlight":
      return `${count} streetlight${count > 1 ? "s" : ""} improve visibility (${sign}${impact} pts)`;
    case "cctv":
      return `${count} CCTV camera${count > 1 ? "s" : ""} enhance surveillance (${sign}${impact} pts)`;
    case "police":
    case "police_station":
      return `Police presence nearby provides security (${sign}${impact} pts)`;
    case "crosswalk":
      return `${count} crosswalk${count > 1 ? "s" : ""} improve pedestrian safety (${sign}${impact} pts)`;
    case "danger":
      return `Danger zone detected — avoid if possible (${sign}${impact} pts)`;
    case "emergency_bell":
      return `Emergency bell${count > 1 ? "s" : ""} available along route (${sign}${impact} pts)`;
    default:
      return `Factor impact: ${sign}${impact} pts`;
  }
}
