import type { ExtendedFacilityType, SafetyLevel } from "@/lib/maps/types";

export interface GlowStyle {
  color: string;
  radiusPx: number;
  iconSize: number;
  label: string;
}

export const FACILITY_GLOW: Record<ExtendedFacilityType, GlowStyle> = {
  streetlight: { color: "#FFD700", radiusPx: 120, iconSize: 10, label: "가로등" },
  cctv: { color: "#4FC3F7", radiusPx: 80, iconSize: 8, label: "CCTV" },
  police: { color: "#FFFFFF", radiusPx: 150, iconSize: 14, label: "경찰" },
  police_station: { color: "#FFFFFF", radiusPx: 150, iconSize: 14, label: "파출소" },
  crosswalk: { color: "#FFF9C4", radiusPx: 100, iconSize: 8, label: "횡단보도" },
  danger: { color: "#B71C1C", radiusPx: 90, iconSize: 12, label: "위험구간" },
  emergency_bell: { color: "#FF9800", radiusPx: 70, iconSize: 8, label: "비상벨" },
};

export const ROUTE_COLORS: Record<
  SafetyLevel,
  {
    stroke: string;
    opacity: number;
    weight: number;
    glowWeight: number;
    glowOpacity: number;
  }
> = {
  safe: { stroke: "#FFD700", opacity: 1, weight: 5, glowWeight: 12, glowOpacity: 0.3 },
  moderate: { stroke: "#FFC107", opacity: 0.8, weight: 4, glowWeight: 10, glowOpacity: 0.2 },
  caution: { stroke: "#616161", opacity: 0.5, weight: 3, glowWeight: 0, glowOpacity: 0 },
};

export const ROUTE_SELECTED_MULTIPLIER = 1.5;
export const ROUTE_UNSELECTED_OPACITY = 0.3;
