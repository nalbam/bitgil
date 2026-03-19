import { readFileSync } from "fs";
import { join } from "path";
import type { School } from "@/lib/maps/types";

interface RawSchool {
  SCHOOL_ID: string;
  SCHOOL_NM: string;
  SCHOOL_RK_DIV_NM: string;
  OPERT_STATE_NM: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_WGS84_LAT: string;
  REFINE_WGS84_LOGT: string;
}

let cachedSchools: School[] | null = null;

function loadSchools(): School[] {
  if (cachedSchools) return cachedSchools;

  const files = [
    "경기도 학교 - 오산.json",
    "경기도 학교 - 운천.json",
    "경기도 학교 - 동탄.json",
    "경기도 학교 - 화성.json",
  ];

  const allRaw: RawSchool[] = [];
  for (const file of files) {
    const filePath = join(process.cwd(), "data", file);
    try {
      const content = readFileSync(filePath, "utf-8");
      const data: RawSchool[] = JSON.parse(content);
      allRaw.push(...data);
    } catch {
      // File not found — skip
    }
  }

  const seen = new Set<string>();
  const schools: School[] = [];

  for (const raw of allRaw) {
    if (raw.OPERT_STATE_NM !== "운영") continue;

    const lat = parseFloat(raw.REFINE_WGS84_LAT);
    const lng = parseFloat(raw.REFINE_WGS84_LOGT);
    if (isNaN(lat) || isNaN(lng)) continue;

    const addr = raw.REFINE_ROADNM_ADDR ?? "";
    // Only include 오산시 and 화성시 (동탄) schools
    if (!addr.includes("오산시") && !addr.includes("화성시")) continue;

    // Deduplicate by school ID
    if (seen.has(raw.SCHOOL_ID)) continue;
    seen.add(raw.SCHOOL_ID);

    schools.push({
      id: raw.SCHOOL_ID,
      name: raw.SCHOOL_NM,
      address: addr,
      position: { lat, lng },
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
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q),
  );
}

export function findSchoolById(schoolId: string): School | undefined {
  return loadSchools().find((s) => s.id === schoolId);
}
