import { readFileSync } from "fs";
import { join } from "path";

type CoordPair = [number, number];

let cached: CoordPair[] | null = null;

function loadCsv(): CoordPair[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "danger-zones.csv");
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
 * Get all danger zone coordinates from the CSV dataset (pre-filtered to 오산시/화성시).
 */
export function getAllDangerZones(): CoordPair[] {
  return loadCsv();
}
