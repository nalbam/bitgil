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
