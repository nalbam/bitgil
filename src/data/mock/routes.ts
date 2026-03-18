import type { RouteOption } from "@/lib/maps/types";
import {
  SAFE_ROUTE_FACILITIES,
  BALANCED_ROUTE_FACILITIES,
  FASTEST_ROUTE_FACILITIES,
} from "@/data/mock/facilities";
import {
  calculateRouteSafety,
  buildFacilityInfluences,
} from "@/domain/services/calculate-route-safety";

const safetyDetails = calculateRouteSafety({ facilities: SAFE_ROUTE_FACILITIES });
const balancedDetails = calculateRouteSafety({ facilities: BALANCED_ROUTE_FACILITIES });
const fastestDetails = calculateRouteSafety({
  facilities: FASTEST_ROUTE_FACILITIES,
  hasUnlitSegment: true,
});

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: "route-safe",
    name: "Safest Route",
    safetyLevel: safetyDetails.level,
    score: safetyDetails.score,
    distanceKm: 1.8,
    estimatedMinutes: 22,
    explanation:
      "Well-lit path with maximum CCTV coverage, a police station nearby, and no known danger zones. Recommended for late-night travel.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5548, lng: 126.924 } },
      { position: { lat: 37.5553, lng: 126.9228 } },
      { position: { lat: 37.556, lng: 126.9205 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails,
    facilityInfluences: buildFacilityInfluences(SAFE_ROUTE_FACILITIES),
  },
  {
    id: "route-balanced",
    name: "Balanced Route",
    safetyLevel: balancedDetails.level,
    score: balancedDetails.score,
    distanceKm: 1.4,
    estimatedMinutes: 17,
    explanation:
      "A good balance of safety and travel time. Passes several streetlights and CCTV cameras with moderate police coverage.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5549, lng: 126.9235 } },
      { position: { lat: 37.5555, lng: 126.922 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails: balancedDetails,
    facilityInfluences: buildFacilityInfluences(BALANCED_ROUTE_FACILITIES),
  },
  {
    id: "route-fast",
    name: "Fastest Route",
    safetyLevel: fastestDetails.level,
    score: fastestDetails.score,
    distanceKm: 1.1,
    estimatedMinutes: 13,
    explanation:
      "Shortest path but passes through a poorly-lit alley identified as a danger zone. Not recommended after dark.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5543, lng: 126.9215 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails: fastestDetails,
    facilityInfluences: buildFacilityInfluences(FASTEST_ROUTE_FACILITIES),
  },
];
