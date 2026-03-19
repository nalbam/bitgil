import { readFileSync } from "fs";
import { join } from "path";
import type { DomainFacility } from "@/domain/entities/facility";

interface CsvPoliceStation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

let cached: CsvPoliceStation[] | null = null;

function loadCsv(): CsvPoliceStation[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "police-stations.csv");
  const content = readFileSync(csvPath, "utf-8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxCity = header.indexOf("시군명");
  const idxName = header.indexOf("관서명");
  const idxAddress = header.indexOf("소재지도로명주소");
  const idxLat = header.indexOf("WGS84위도");
  const idxLng = header.indexOf("WGS84경도");

  const results: CsvPoliceStation[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.replace(/"/g, "").split(",");
    const city = cols[idxCity] ?? "";

    // Filter: only 오산시 or 화성시
    if (!city.includes("오산") && !city.includes("화성")) continue;

    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push({
      name: cols[idxName] ?? "",
      address: cols[idxAddress] ?? "",
      lat,
      lng,
    });
  }

  cached = results;
  return results;
}

function toDomainFacility(p: CsvPoliceStation, index: number): DomainFacility {
  return {
    id: `csv-police-${index}`,
    type: "police_station",
    name: p.name || `파출소 ${index}`,
    position: { lat: p.lat, lng: p.lng },
    description: p.address || undefined,
  };
}

/**
 * Get all police stations from the CSV dataset (filtered to 오산시/화성시).
 */
export function getAllPoliceStations(): DomainFacility[] {
  return loadCsv().map(toDomainFacility);
}
