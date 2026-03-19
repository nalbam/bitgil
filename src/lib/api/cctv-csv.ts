import { readFileSync } from "fs";
import { join } from "path";
import type { DomainFacility } from "@/domain/entities/facility";

interface CsvCctv {
  address: string;
  agency: string;
  lat: number;
  lng: number;
}

let cached: CsvCctv[] | null = null;

function loadCsv(): CsvCctv[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "cctv.csv");
  const content = readFileSync(csvPath, "utf-8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxAgency = header.indexOf("관리기관명");
  const idxAddress = header.indexOf("소재지도로명주소");
  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");

  const results: CsvCctv[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.replace(/"/g, "").split(",");
    const address = cols[idxAddress] ?? "";

    // Filter: only 오산시 or 화성시
    if (!address.includes("오산시") && !address.includes("화성시")) continue;

    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    results.push({
      address,
      agency: cols[idxAgency] ?? "",
      lat,
      lng,
    });
  }

  cached = results;
  return results;
}

function toDomainFacility(c: CsvCctv, index: number): DomainFacility {
  return {
    id: `csv-cctv-${index}`,
    type: "cctv",
    name: c.address || `CCTV ${index}`,
    position: { lat: c.lat, lng: c.lng },
    description: c.agency || undefined,
  };
}

/**
 * Get all CCTV facilities from the CSV dataset (filtered to 오산시/화성시).
 */
export function getAllCctv(): DomainFacility[] {
  return loadCsv().map(toDomainFacility);
}
