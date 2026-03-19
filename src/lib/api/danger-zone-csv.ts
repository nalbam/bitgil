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

  const results: CsvDangerZone[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    // Filter: only 오산 or 화성 (check entire line, not just one column)
    if (!line.includes("오산") && !line.includes("화성")) continue;

    // Lat/lng are always the last two comma-separated values (no quotes)
    // Use reverse parsing to handle quoted fields with commas
    const lastComma = line.lastIndexOf(",");
    const secondLastComma = line.lastIndexOf(",", lastComma - 1);

    const lng = parseFloat(line.substring(lastComma + 1));
    const lat = parseFloat(line.substring(secondLastComma + 1, lastComma));
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    // Extract accident type (1st column) and location (2nd column)
    const firstComma = line.indexOf(",");
    const accidentType = line.substring(0, firstComma);
    const secondComma = line.indexOf(",", firstComma + 1);
    const location = line.substring(firstComma + 1, secondComma).replace(/"/g, "");

    results.push({
      type: accidentType,
      location,
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
 * Get all danger zones from the CSV dataset (filtered to 오산시/화성시).
 */
export function getAllDangerZones(): DomainFacility[] {
  return loadCsv().map(toDomainFacility);
}
