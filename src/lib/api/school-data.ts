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

let cachedSchools: School[] | null = null;

function loadCsv(): CsvSchool[] {
  const csvPath = join(process.cwd(), "data", "초․중등학교위치현황(제공표준).csv");
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n");
  const header = lines[0]!.split(",");

  const idxId = header.indexOf("학교ID");
  const idxName = header.indexOf("학교명");
  const idxStatus = header.indexOf("운영상태");
  const idxAddr = header.indexOf("소재지도로명주소");
  const idxLat = header.indexOf("위도");
  const idxLng = header.indexOf("경도");

  const results: CsvSchool[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = line.split(",");
    const status = cols[idxStatus] ?? "";
    if (status !== "운영") continue;

    const lat = parseFloat(cols[idxLat] ?? "");
    const lng = parseFloat(cols[idxLng] ?? "");
    if (isNaN(lat) || isNaN(lng) || lat === 0) continue;

    const addr = cols[idxAddr] ?? "";
    if (!addr.includes("오산시") && !addr.includes("화성시")) continue;

    results.push({
      id: cols[idxId] ?? `school-${i}`,
      name: cols[idxName] ?? "",
      address: addr,
      lat,
      lng,
    });
  }

  return results;
}

function loadSchools(): School[] {
  if (cachedSchools) return cachedSchools;

  const raw = loadCsv();
  const seen = new Set<string>();
  const schools: School[] = [];

  for (const r of raw) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);

    schools.push({
      id: r.id,
      name: r.name,
      address: r.address,
      position: { lat: r.lat, lng: r.lng },
      areaId: "area-osan",
    });
  }

  cachedSchools = schools;
  return schools;
}

export function getAllSchools(): School[] {
  return loadSchools();
}

export function searchSchools(query: string): School[] {
  const schools = loadSchools();
  if (!query) return schools;
  const q = query.toLowerCase();
  return schools.filter(
    (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q),
  );
}

export function findSchoolById(schoolId: string): School | undefined {
  return loadSchools().find((s) => s.id === schoolId);
}
