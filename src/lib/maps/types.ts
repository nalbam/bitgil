export interface LatLng {
  lat: number;
  lng: number;
}

export type FacilityType = "streetlight" | "cctv" | "police" | "crosswalk" | "danger";

export interface Facility {
  id: string;
  type: FacilityType;
  position: LatLng;
  label?: string;
}

export interface RoutePoint {
  position: LatLng;
  label?: string;
}

export type SafetyLevel = "safe" | "moderate" | "caution";

export interface Route {
  id: string;
  name: string;
  safetyLevel: SafetyLevel;
  points: RoutePoint[];
  score: number;
  estimatedMinutes: number;
  distanceKm: number;
}

export interface MapState {
  center: LatLng;
  zoom: number;
  selectedRouteId: string | null;
}

export type ExtendedFacilityType = FacilityType | "police_station" | "emergency_bell";

export type GeoPoint = LatLng;

export interface School {
  id: string;
  name: string;
  position: GeoPoint;
  address: string;
}

export interface Area {
  id: string;
  name: string;
  center: GeoPoint;
  radiusKm: number;
}

export interface SafetyFactor {
  type: ExtendedFacilityType | "dark_segment";
  label: string;
  impact: number; // positive = good, negative = bad
  description: string;
}

export interface SafetyScore {
  score: number; // 0–100
  level: SafetyLevel;
  factors: SafetyFactor[];
}

export interface FacilityInfluence {
  facilityId: string;
  facilityType: ExtendedFacilityType;
  label: string;
  impact: "positive" | "negative";
  weight: number; // 0–1
}

export interface RouteOption extends Route {
  explanation: string;
  facilityInfluences: FacilityInfluence[];
  safetyDetails: SafetyScore;
}

export interface RouteSafetyAnalysis {
  schoolId: string;
  areaId: string;
  routes: RouteOption[];
  recommendedRouteId: string;
  analyzedAt: string; // ISO timestamp
}

export interface RouteSummary {
  routeId: string;
  name: string;
  score: number;
  level: SafetyLevel;
  distanceKm: number;
  estimatedMinutes: number;
  explanation: string;
}
