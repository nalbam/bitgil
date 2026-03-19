import { readFileSync } from "fs";
import { join } from "path";
import type { DomainFacility } from "@/domain/entities/facility";

interface CsvStreetlight {
  id: string;
  district: string;
  roadAddress: string;
  lotAddress: string;
  lat: number;
  lng: number;
  installYear: string;
  poleType: string;
  lightType: string;
}

let cachedStreetlights: CsvStreetlight[] | null = null;

function loadCsv(): CsvStreetlight[] {
  if (cachedStreetlights) return cachedStreetlights;

  const csvPath = join(
    process.cwd(),
    "data",
    "경기도 화성시 가로등 현황.csv",
  );
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxId = header.indexOf("관리번호");
  const idxDistrict = header.indexOf("읍면동명");
  const idxRoad = header.indexOf("도로명주소");
  const idxLot = header.indexOf("지번주소");
  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");
  const idxYear = header.indexOf("설치연도");
  const idxPole = header.indexOf("지주형식");
  const idxLight = header.indexOf("광원종류");

  const results: CsvStreetlight[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    // Simple CSV parse (handles quoted fields)
    const cols = line.replace(/"/g, "").split(",");
    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");

    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push({
      id: cols[idxId] ?? `sl-${i}`,
      district: cols[idxDistrict] ?? "",
      roadAddress: cols[idxRoad] ?? "",
      lotAddress: cols[idxLot] ?? "",
      lat,
      lng,
      installYear: cols[idxYear] ?? "",
      poleType: cols[idxPole] ?? "",
      lightType: cols[idxLight] ?? "",
    });
  }

  cachedStreetlights = results;
  return results;
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
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    return { s, dist };
  });

  withDist.sort((a, b) => a.dist - b.dist);

  return withDist
    .filter((x) => x.dist <= radiusKm)
    .slice(0, limit)
    .map(({ s }) => ({
      id: `csv-sl-${s.id}`,
      type: "streetlight" as const,
      name: s.roadAddress || `가로등 ${s.id}`,
      position: { lat: s.lat, lng: s.lng },
      description: [s.district, s.lightType, s.installYear ? `${s.installYear}년 설치` : ""]
        .filter(Boolean)
        .join(" · "),
    }));
}
