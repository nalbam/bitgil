import { readFileSync } from "fs";
import { join } from "path";
import type { DomainFacility } from "@/domain/entities/facility";

interface CsvStreetlight {
  id: string;
  district: string;
  roadAddress: string;
  lat: number;
  lng: number;
}

let cached: CsvStreetlight[] | null = null;

function loadCsv(): CsvStreetlight[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "streetlights.csv");
  const content = readFileSync(csvPath, "utf-8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxId = header.indexOf("관리번호");
  const idxDistrict = header.indexOf("읍면동명");
  const idxRoad = header.indexOf("도로명주소");
  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");

  const results: CsvStreetlight[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.replace(/"/g, "").split(",");
    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push({
      id: cols[idxId] ?? `sl-${i}`,
      district: cols[idxDistrict] ?? "",
      roadAddress: cols[idxRoad] ?? "",
      lat,
      lng,
    });
  }

  cached = results;
  return results;
}

function toDomainFacility(s: CsvStreetlight): DomainFacility {
  return {
    id: `csv-sl-${s.id}`,
    type: "streetlight",
    name: s.roadAddress || `가로등 ${s.id}`,
    position: { lat: s.lat, lng: s.lng },
    description: s.district || undefined,
  };
}

/**
 * Get all streetlights from the CSV dataset.
 */
export function getAllStreetlights(): DomainFacility[] {
  return loadCsv().map(toDomainFacility);
}

/**
 * Get streetlights within a given radius (km) from a center point.
 */
export function getStreetlightsNear(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  limit: number = 1000,
): DomainFacility[] {
  const all = loadCsv();
  const cosLat = Math.cos((centerLat * Math.PI) / 180);

  const withDist = all.map((s) => {
    const dLat = (s.lat - centerLat) * 111.32;
    const dLng = (s.lng - centerLng) * 111.32 * cosLat;
    return { s, dist: Math.sqrt(dLat * dLat + dLng * dLng) };
  });

  withDist.sort((a, b) => a.dist - b.dist);

  return withDist
    .filter((x) => x.dist <= radiusKm)
    .slice(0, limit)
    .map(({ s }) => toDomainFacility(s));
}
