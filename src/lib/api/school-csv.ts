import { readFileSync } from "fs";
import { join } from "path";
import type { School } from "@/lib/maps/types";

interface CsvSchool {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

let cached: CsvSchool[] | null = null;

function loadCsv(): CsvSchool[] {
  if (cached) return cached;

  const csvPath = join(process.cwd(), "data", "schools.csv");
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxId = header.indexOf("학교ID");
  const idxName = header.indexOf("학교명");
  const idxStatus = header.indexOf("운영상태");
  const idxAddr = header.indexOf("소재지도로명주소");
  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");

  const seen = new Set<string>();
  const results: CsvSchool[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.split(",");

    // Filter: only 운영 status
    const status = cols[idxStatus] ?? "";
    if (status !== "운영") continue;

    // Filter: only 오산시 or 화성시
    const addr = cols[idxAddr] ?? "";
    if (!addr.includes("오산시") && !addr.includes("화성시")) continue;

    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    // Deduplicate by id
    const id = cols[idxId] ?? `school-${i}`;
    if (seen.has(id)) continue;
    seen.add(id);

    results.push({
      id,
      name: cols[idxName] ?? "",
      address: addr,
      lat,
      lng,
    });
  }

  cached = results;
  return results;
}

function toSchool(s: CsvSchool): School {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    position: { lat: s.lat, lng: s.lng },
    areaId: "area-osan",
  };
}

/**
 * Get all schools from the CSV dataset (filtered to 오산시/화성시, 운영 status).
 */
export function getAllSchools(): School[] {
  return loadCsv().map(toSchool);
}

/**
 * Search schools by name or address.
 */
export function searchSchools(query: string): School[] {
  const schools = getAllSchools();
  if (!query) return schools;
  const q = query.toLowerCase();
  return schools.filter(
    (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q),
  );
}

/**
 * Find a school by its ID.
 */
export function findSchoolById(schoolId: string): School | undefined {
  return loadCsv()
    .filter((s) => s.id === schoolId)
    .map(toSchool)[0];
}
