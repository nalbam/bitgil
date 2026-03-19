import { readFileSync } from "fs";
import { join } from "path";

type CoordPair = [number, number];

let cached: CoordPair[] | null = null;

function loadCsv(): CoordPair[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "streetlights.csv");
  const content = readFileSync(csvPath, "utf-8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");

  const results: CoordPair[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.split(",");
    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push([lat, lng]);
  }

  cached = results;
  return results;
}

/**
 * Get all streetlight coordinates from the CSV dataset.
 */
export function getAllStreetlights(): CoordPair[] {
  return loadCsv();
}

/**
 * Get streetlight coordinates within a given radius (km) from a center point.
 */
export function getStreetlightsNear(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  limit: number = 1000,
): CoordPair[] {
  const all = loadCsv();
  const cosLat = Math.cos((centerLat * Math.PI) / 180);

  const withDist = all.map((coord) => {
    const dLat = (coord[0] - centerLat) * 111.32;
    const dLng = (coord[1] - centerLng) * 111.32 * cosLat;
    return { coord, dist: Math.sqrt(dLat * dLat + dLng * dLng) };
  });

  withDist.sort((a, b) => a.dist - b.dist);

  return withDist
    .filter((x) => x.dist <= radiusKm)
    .slice(0, limit)
    .map(({ coord }) => coord);
}
