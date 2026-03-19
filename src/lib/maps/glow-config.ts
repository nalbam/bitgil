import type { ExtendedFacilityType, SafetyLevel } from "@/lib/maps/types";

export interface GlowStyle {
  color: string;
  radiusPx: number;
  iconSize: number;
  label: string;
}

export const FACILITY_GLOW: Record<ExtendedFacilityType, GlowStyle> = {
  streetlight: { color: "#FFD700", radiusPx: 40, iconSize: 4, label: "가로등" },
  cctv: { color: "#4FC3F7", radiusPx: 30, iconSize: 4, label: "CCTV" },
  police: { color: "#FFFFFF", radiusPx: 50, iconSize: 6, label: "경찰" },
  police_station: { color: "#FFFFFF", radiusPx: 50, iconSize: 6, label: "파출소" },
  crosswalk: { color: "#FFF9C4", radiusPx: 35, iconSize: 4, label: "횡단보도" },
  danger: { color: "#B71C1C", radiusPx: 35, iconSize: 5, label: "위험구간" },
  emergency_bell: { color: "#FF9800", radiusPx: 28, iconSize: 4, label: "비상벨" },
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

/**
 * Convert hex color string to RGBA array for deck.gl.
 */
export function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b, alpha];
}
