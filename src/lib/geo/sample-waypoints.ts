import { haversineKm } from "@/lib/geo/haversine";

type LatLng = { lat: number; lng: number };

export function sampleWaypoints(points: LatLng[], intervalKm: number = 0.05): LatLng[] {
  if (points.length === 0) return [];

  const sampled: LatLng[] = [points[0]!];
  let accumulated = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    accumulated += haversineKm(prev.lat, prev.lng, curr.lat, curr.lng);

    if (accumulated >= intervalKm) {
      sampled.push(curr);
      accumulated = 0;
    }
  }

  const last = points[points.length - 1]!;
  if (sampled[sampled.length - 1] !== last) {
    sampled.push(last);
  }

  return sampled;
}
