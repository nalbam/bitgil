import { decodePolyline } from "@/lib/geo/polyline";
import { sampleWaypoints } from "@/lib/geo/sample-waypoints";
import { haversineKm } from "@/lib/geo/haversine";
import {
  findNearbyFacilities,
  countStreetlightsNear,
} from "@/server/services/facility-proximity-service";
import {
  calculateRouteSafety,
  buildFacilityInfluences,
} from "@/domain/services/calculate-route-safety";
import type { RouteOption } from "@/lib/maps/types";

interface LatLng {
  lat: number;
  lng: number;
}

interface DirectionsRequest {
  origin: LatLng;
  destination: LatLng;
}

interface DirectionsResult {
  routes: RouteOption[];
  recommendedRouteId: string;
}

const ROUTE_NAMES = ["안전 경로", "균형 경로", "빠른 경로"];
const UNLIT_CONSECUTIVE_THRESHOLD = 3;

export async function getDirectionsWithSafety(
  req: DirectionsRequest,
): Promise<DirectionsResult> {
  const apiKey = process.env.NEXT_GOOGLE_DIRECTIONS_API_KEY;
  if (!apiKey) throw new Error("NEXT_GOOGLE_DIRECTIONS_API_KEY not configured");

  const distKm = haversineKm(
    req.origin.lat,
    req.origin.lng,
    req.destination.lat,
    req.destination.lng,
  );
  if (distKm > 10) {
    throw new DirectionsError("출발지와 학교 간 거리가 너무 멉니다 (최대 10km)");
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${req.origin.lat},${req.origin.lng}`);
  url.searchParams.set("destination", `${req.destination.lat},${req.destination.lng}`);
  url.searchParams.set("mode", "walking");
  url.searchParams.set("alternatives", "true");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(5000),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Google Directions API HTTP error:", response.status, data);
    throw new DirectionsError("경로 서비스를 일시적으로 사용할 수 없습니다");
  }

  if (data.status === "ZERO_RESULTS") {
    throw new DirectionsError("도보 경로를 찾을 수 없습니다");
  }
  if (data.status !== "OK") {
    console.error("Google Directions API status:", data.status, data.error_message);
    throw new DirectionsError(
      data.status === "ZERO_RESULTS"
        ? "도보 경로를 찾을 수 없습니다"
        : `경로 서비스를 일시적으로 사용할 수 없습니다 (${data.status})`,
    );
  }

  const googleRoutes = data.routes as GoogleRoute[];
  const scoredRoutes: RouteOption[] = [];

  for (let i = 0; i < googleRoutes.length; i++) {
    const gr = googleRoutes[i]!;
    const leg = gr.legs[0]!;
    const polylinePoints = decodePolyline(gr.overview_polyline.points);
    const sampled = sampleWaypoints(polylinePoints, 0.05);

    const allFacilities = new Map<string, ReturnType<typeof findNearbyFacilities>[number]>();
    let unlitConsecutive = 0;
    let hasUnlitSegment = false;

    for (const wp of sampled) {
      const nearby = findNearbyFacilities(wp.lat, wp.lng);
      for (const f of nearby) {
        const key = `${f.type}-${f.position.lat.toFixed(6)}-${f.position.lng.toFixed(6)}`;
        allFacilities.set(key, f);
      }

      const streetlightCount = countStreetlightsNear(wp.lat, wp.lng);
      if (streetlightCount === 0) {
        unlitConsecutive++;
        if (unlitConsecutive >= UNLIT_CONSECUTIVE_THRESHOLD) {
          hasUnlitSegment = true;
        }
      } else {
        unlitConsecutive = 0;
      }
    }

    const facilities = Array.from(allFacilities.values());
    const safetyDetails = calculateRouteSafety({ facilities, hasUnlitSegment });
    const facilityInfluences = buildFacilityInfluences(facilities);

    const summary = gr.summary || "도보 경로";
    const facilityTypeCounts = countFacilityTypes(facilities);
    const explanation = buildExplanation(summary, facilityTypeCounts, hasUnlitSegment);

    const routePoints = polylinePoints.map((p) => ({
      position: { lat: p.lat, lng: p.lng },
    }));

    scoredRoutes.push({
      id: `directions-${i}`,
      name: "",
      safetyLevel: safetyDetails.level,
      points: routePoints,
      score: safetyDetails.score,
      estimatedMinutes: Math.round(leg.duration.value / 60),
      distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
      explanation,
      facilityInfluences,
      safetyDetails,
    });
  }

  scoredRoutes.sort((a, b) => b.score - a.score);

  for (let i = 0; i < scoredRoutes.length; i++) {
    scoredRoutes[i] = {
      ...scoredRoutes[i]!,
      name: scoredRoutes.length === 1 ? "추천 경로" : (ROUTE_NAMES[i] ?? `경로 ${i + 1}`),
    };
  }

  return {
    routes: scoredRoutes,
    recommendedRouteId: scoredRoutes[0]?.id ?? "",
  };
}

function countFacilityTypes(
  facilities: ReturnType<typeof findNearbyFacilities>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of facilities) {
    counts[f.type] = (counts[f.type] ?? 0) + 1;
  }
  return counts;
}

function buildExplanation(
  summary: string,
  counts: Record<string, number>,
  hasUnlit: boolean,
): string {
  const parts: string[] = [`${summary} 경유`];

  const positives: string[] = [];
  if (counts.cctv) positives.push(`CCTV ${counts.cctv}개`);
  if (counts.streetlight) positives.push(`가로등 ${counts.streetlight}개`);
  if (positives.length > 0) parts.push(`${positives.join(", ")} 확인`);

  if (counts.danger) parts.push(`위험구간 ${counts.danger}곳 주의`);
  if (hasUnlit) parts.push("일부 어두운 구간 있음");

  return parts.join(". ") + ".";
}

export class DirectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectionsError";
  }
}

interface GoogleRoute {
  summary: string;
  overview_polyline: { points: string };
  legs: {
    distance: { value: number; text: string };
    duration: { value: number; text: string };
  }[];
}
