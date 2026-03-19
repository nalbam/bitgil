import { readFileSync } from "fs";
import { join } from "path";
import type { DomainFacility } from "@/domain/entities/facility";

interface CsvDangerZone {
  type: string;
  location: string;
  lat: number;
  lng: number;
}

let cached: CsvDangerZone[] | null = null;

function loadCsv(): CsvDangerZone[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "danger-zones.csv");
  const content = readFileSync(csvPath, "utf-8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxType = header.indexOf("사고유형");
  const idxLocation = header.indexOf("사고위치(지번)");
  const idxLat = header.indexOf("정제WGS84위도");
  const idxLng = header.indexOf("정제WGS84경도");

  const results: CsvDangerZone[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.replace(/"/g, "").split(",");

    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push({
      type: cols[idxType] ?? "",
      location: cols[idxLocation] ?? "",
      lat,
      lng,
    });
  }

  cached = results;
  return results;
}

function toDomainFacility(d: CsvDangerZone, index: number): DomainFacility {
  return {
    id: `csv-danger-${index}`,
    type: "danger",
    name: d.location || `위험지역 ${index}`,
    position: { lat: d.lat, lng: d.lng },
    description: d.type || undefined,
  };
}

/**
 * Get all danger zones from the CSV dataset (pre-filtered to 오산시/화성시).
 */
export function getAllDangerZones(): DomainFacility[] {
  return loadCsv().map(toDomainFacility);
}
