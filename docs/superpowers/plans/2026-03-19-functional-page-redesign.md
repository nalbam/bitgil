# Bitgil Functional Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the marketing landing page into a functional SPA with school search, Google Maps night-theme visualization with glow effects, and route safety comparison.

**Architecture:** Replace 6 marketing sections with 3 functional areas (search bar, Google Maps with dark theme + facility glow, route comparison panel). State is managed client-side with React hooks. Data comes from expanded mock data (5 schools) served via API routes.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, `@vis.gl/react-google-maps`, Google Maps JavaScript API (Vector Map for 3D).

**Spec:** `docs/superpowers/specs/2026-03-19-functional-page-redesign-design.md`

---

## Task 1: Install dependency and add environment variable

**Files:**
- Modify: `package.json`
- Modify: `.env.example`
- Modify: `src/lib/env/index.ts`
- Modify: `src/lib/maps/config.ts`

- [ ] **Step 1: Install @vis.gl/react-google-maps**

```bash
pnpm add @vis.gl/react-google-maps
```

- [ ] **Step 2: Add NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID to .env.example**

Add after `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`:
```
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

- [ ] **Step 3: Update src/lib/env/index.ts — add mapId to clientEnv**

```typescript
export const clientEnv = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "",
} as const;
```

- [ ] **Step 4: Update src/lib/maps/config.ts — add mapId**

```typescript
import { clientEnv } from "@/lib/env";

export const MAPS_CONFIG = {
  defaultCenter: {
    lat: 37.5665,
    lng: 126.978,
  },
  defaultZoom: 15,
  apiKey: clientEnv.googleMapsApiKey,
  mapId: clientEnv.googleMapsMapId || undefined,
} as const;

export type MapCenter = typeof MAPS_CONFIG.defaultCenter;
```

- [ ] **Step 5: Verify**

```bash
pnpm type-check
```

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example src/lib/env/index.ts src/lib/maps/config.ts
git commit -m "feat: add @vis.gl/react-google-maps and map ID env var"
```

---

## Task 2: Expand domain model — add areaId to School

**Files:**
- Modify: `src/lib/maps/types.ts` (School interface, line 42-47)
- Modify: `src/data/mock/schools.ts`

- [ ] **Step 1: Add areaId to School interface in src/lib/maps/types.ts**

Change the School interface (line 42-47) to:

```typescript
export interface School {
  id: string;
  name: string;
  position: GeoPoint;
  address: string;
  areaId: string;
}
```

- [ ] **Step 2: Update src/data/mock/schools.ts — add areaId to existing school**

```typescript
import type { School } from "@/lib/maps/types";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "school-1",
    name: "Mapo High School",
    address: "123 Mapo-daero, Mapo-gu, Seoul",
    position: { lat: 37.5545, lng: 126.9231 },
    areaId: "area-mapo",
  },
];

export const DEFAULT_SCHOOL = MOCK_SCHOOLS[0]!;
```

- [ ] **Step 3: Verify**

```bash
pnpm type-check
```

Fix any type errors in files referencing School (mappers, repositories).

- [ ] **Step 4: Commit**

```bash
git add src/lib/maps/types.ts src/data/mock/schools.ts
git commit -m "feat: add areaId field to School entity"
```

---

## Task 3: Expand mock data — 5 schools, areas, facilities, routes

**Files:**
- Modify: `src/data/mock/schools.ts`
- Modify: `src/data/mock/areas.ts`
- Modify: `src/data/mock/facilities.ts`
- Modify: `src/data/mock/routes.ts`
- Modify: `src/data/mock/analyses.ts`

This is the largest task. All data uses realistic Seoul coordinates.

- [ ] **Step 1: Replace src/data/mock/areas.ts**

```typescript
import type { Area } from "@/lib/maps/types";

export const MOCK_AREAS: Area[] = [
  {
    id: "area-mapo",
    name: "Mapo-gu School Zone",
    center: { lat: 37.5545, lng: 126.9231 },
    radiusKm: 1.5,
  },
  {
    id: "area-gangnam",
    name: "Gangnam-gu School Zone",
    center: { lat: 37.4979, lng: 127.0276 },
    radiusKm: 1.2,
  },
  {
    id: "area-jongno",
    name: "Jongno-gu School Zone",
    center: { lat: 37.5729, lng: 126.9794 },
    radiusKm: 1.0,
  },
  {
    id: "area-songpa",
    name: "Songpa-gu School Zone",
    center: { lat: 37.5145, lng: 127.1066 },
    radiusKm: 1.3,
  },
  {
    id: "area-yeongdeungpo",
    name: "Yeongdeungpo-gu School Zone",
    center: { lat: 37.5264, lng: 126.8963 },
    radiusKm: 1.1,
  },
];

export const DEFAULT_AREA = MOCK_AREAS[0]!;

export function findAreaById(areaId: string): Area | undefined {
  return MOCK_AREAS.find((a) => a.id === areaId);
}
```

- [ ] **Step 2: Replace src/data/mock/schools.ts — 5 schools**

```typescript
import type { School } from "@/lib/maps/types";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "school-1",
    name: "마포고등학교",
    address: "서울특별시 마포구 마포대로 123",
    position: { lat: 37.5545, lng: 126.9231 },
    areaId: "area-mapo",
  },
  {
    id: "school-gangnam",
    name: "강남중학교",
    address: "서울특별시 강남구 테헤란로 45",
    position: { lat: 37.4979, lng: 127.0276 },
    areaId: "area-gangnam",
  },
  {
    id: "school-jongno",
    name: "종로초등학교",
    address: "서울특별시 종로구 종로 67",
    position: { lat: 37.5729, lng: 126.9794 },
    areaId: "area-jongno",
  },
  {
    id: "school-songpa",
    name: "송파고등학교",
    address: "서울특별시 송파구 올림픽로 89",
    position: { lat: 37.5145, lng: 127.1066 },
    areaId: "area-songpa",
  },
  {
    id: "school-yeongdeungpo",
    name: "영등포중학교",
    address: "서울특별시 영등포구 영등포로 34",
    position: { lat: 37.5264, lng: 126.8963 },
    areaId: "area-yeongdeungpo",
  },
];

export const DEFAULT_SCHOOL = MOCK_SCHOOLS[0]!;

export function findSchoolById(schoolId: string): School | undefined {
  return MOCK_SCHOOLS.find((s) => s.id === schoolId);
}
```

- [ ] **Step 3: Replace src/data/mock/facilities.ts — facilities for all 5 schools**

Create facilities for each area. Each area should have 10-15 facilities of varied types. Tag each facility with an `areaId` field by adding it to the `DomainFacility` interface (or keep facilities grouped by school and use a lookup map).

**Approach:** Add a non-persistent `areaId` property to the mock array. Use a `Record<string, DomainFacility[]>` keyed by areaId for easy lookup.

```typescript
import type { DomainFacility } from "@/domain/entities/facility";

// ─── Mapo-gu (school-1) ──────────────────────────────────────────────────
const MAPO_FACILITIES: DomainFacility[] = [
  { id: "mapo-sl-1", type: "streetlight", name: "가로등 A", position: { lat: 37.5548, lng: 126.924 } },
  { id: "mapo-sl-2", type: "streetlight", name: "가로등 B", position: { lat: 37.5551, lng: 126.9225 } },
  { id: "mapo-sl-3", type: "streetlight", name: "가로등 C", position: { lat: 37.5558, lng: 126.921 } },
  { id: "mapo-sl-4", type: "streetlight", name: "가로등 D", position: { lat: 37.5562, lng: 126.9198 } },
  { id: "mapo-cctv-1", type: "cctv", name: "CCTV 1", position: { lat: 37.5549, lng: 126.9235 }, description: "교차로 시 CCTV" },
  { id: "mapo-cctv-2", type: "cctv", name: "CCTV 2", position: { lat: 37.5555, lng: 126.922 }, description: "편의점 CCTV" },
  { id: "mapo-cctv-3", type: "cctv", name: "CCTV 3", position: { lat: 37.556, lng: 126.9205 } },
  { id: "mapo-ps-1", type: "police_station", name: "마포 파출소", position: { lat: 37.5553, lng: 126.9228 }, description: "24시간 파출소" },
  { id: "mapo-cw-1", type: "crosswalk", name: "횡단보도 A", position: { lat: 37.555, lng: 126.9232 } },
  { id: "mapo-cw-2", type: "crosswalk", name: "횡단보도 B", position: { lat: 37.5546, lng: 126.9232 } },
  { id: "mapo-dz-1", type: "danger", name: "어두운 골목", position: { lat: 37.5543, lng: 126.9215 }, description: "시야가 좁은 어두운 골목" },
  { id: "mapo-eb-1", type: "emergency_bell", name: "비상벨", position: { lat: 37.5557, lng: 126.9218 }, description: "경찰 직통 비상벨" },
];

// ─── Gangnam-gu ──────────────────────────────────────────────────────────
const GANGNAM_FACILITIES: DomainFacility[] = [
  { id: "gn-sl-1", type: "streetlight", name: "가로등 1", position: { lat: 37.4982, lng: 127.028 } },
  { id: "gn-sl-2", type: "streetlight", name: "가로등 2", position: { lat: 37.4985, lng: 127.0265 } },
  { id: "gn-sl-3", type: "streetlight", name: "가로등 3", position: { lat: 37.499, lng: 127.025 } },
  { id: "gn-cctv-1", type: "cctv", name: "CCTV A", position: { lat: 37.4983, lng: 127.0275 } },
  { id: "gn-cctv-2", type: "cctv", name: "CCTV B", position: { lat: 37.4988, lng: 127.026 } },
  { id: "gn-cctv-3", type: "cctv", name: "CCTV C", position: { lat: 37.4993, lng: 127.0245 } },
  { id: "gn-cctv-4", type: "cctv", name: "CCTV D", position: { lat: 37.4975, lng: 127.029 } },
  { id: "gn-ps-1", type: "police_station", name: "강남 파출소", position: { lat: 37.4986, lng: 127.0268 } },
  { id: "gn-cw-1", type: "crosswalk", name: "횡단보도 1", position: { lat: 37.498, lng: 127.0278 } },
  { id: "gn-cw-2", type: "crosswalk", name: "횡단보도 2", position: { lat: 37.4992, lng: 127.0255 } },
  { id: "gn-eb-1", type: "emergency_bell", name: "비상벨", position: { lat: 37.4987, lng: 127.0262 } },
];

// ─── Jongno-gu ──────────────────────────────────────────────────────────
const JONGNO_FACILITIES: DomainFacility[] = [
  { id: "jn-sl-1", type: "streetlight", name: "가로등 1", position: { lat: 37.5732, lng: 126.98 } },
  { id: "jn-sl-2", type: "streetlight", name: "가로등 2", position: { lat: 37.5735, lng: 126.9785 } },
  { id: "jn-sl-3", type: "streetlight", name: "가로등 3", position: { lat: 37.574, lng: 126.977 } },
  { id: "jn-cctv-1", type: "cctv", name: "CCTV 1", position: { lat: 37.5733, lng: 126.9795 } },
  { id: "jn-cctv-2", type: "cctv", name: "CCTV 2", position: { lat: 37.5738, lng: 126.978 } },
  { id: "jn-ps-1", type: "police_station", name: "종로 파출소", position: { lat: 37.5736, lng: 126.979 } },
  { id: "jn-cw-1", type: "crosswalk", name: "횡단보도 1", position: { lat: 37.5731, lng: 126.9798 } },
  { id: "jn-dz-1", type: "danger", name: "좁은 골목", position: { lat: 37.5742, lng: 126.9775 }, description: "야간 통행 위험 구간" },
  { id: "jn-dz-2", type: "danger", name: "공사 구간", position: { lat: 37.5745, lng: 126.976 }, description: "도로 공사 중" },
  { id: "jn-eb-1", type: "emergency_bell", name: "비상벨", position: { lat: 37.5737, lng: 126.9788 } },
];

// ─── Songpa-gu ──────────────────────────────────────────────────────────
const SONGPA_FACILITIES: DomainFacility[] = [
  { id: "sp-sl-1", type: "streetlight", name: "가로등 1", position: { lat: 37.5148, lng: 127.107 } },
  { id: "sp-sl-2", type: "streetlight", name: "가로등 2", position: { lat: 37.5152, lng: 127.1055 } },
  { id: "sp-sl-3", type: "streetlight", name: "가로등 3", position: { lat: 37.5158, lng: 127.104 } },
  { id: "sp-sl-4", type: "streetlight", name: "가로등 4", position: { lat: 37.5162, lng: 127.1028 } },
  { id: "sp-sl-5", type: "streetlight", name: "가로등 5", position: { lat: 37.5155, lng: 127.1048 } },
  { id: "sp-cctv-1", type: "cctv", name: "CCTV 1", position: { lat: 37.5149, lng: 127.1068 } },
  { id: "sp-cctv-2", type: "cctv", name: "CCTV 2", position: { lat: 37.5156, lng: 127.1045 } },
  { id: "sp-ps-1", type: "police_station", name: "송파 파출소", position: { lat: 37.5153, lng: 127.1058 } },
  { id: "sp-cw-1", type: "crosswalk", name: "횡단보도 1", position: { lat: 37.5147, lng: 127.1065 } },
  { id: "sp-cw-2", type: "crosswalk", name: "횡단보도 2", position: { lat: 37.516, lng: 127.1035 } },
  { id: "sp-eb-1", type: "emergency_bell", name: "비상벨", position: { lat: 37.5154, lng: 127.1052 } },
];

// ─── Yeongdeungpo-gu ────────────────────────────────────────────────────
const YEONGDEUNGPO_FACILITIES: DomainFacility[] = [
  { id: "yd-sl-1", type: "streetlight", name: "가로등 1", position: { lat: 37.5267, lng: 126.897 } },
  { id: "yd-sl-2", type: "streetlight", name: "가로등 2", position: { lat: 37.527, lng: 126.8955 } },
  { id: "yd-sl-3", type: "streetlight", name: "가로등 3", position: { lat: 37.5275, lng: 126.894 } },
  { id: "yd-cctv-1", type: "cctv", name: "CCTV 1", position: { lat: 37.5268, lng: 126.8965 } },
  { id: "yd-cctv-2", type: "cctv", name: "CCTV 2", position: { lat: 37.5273, lng: 126.895 } },
  { id: "yd-ps-1", type: "police_station", name: "영등포 파출소", position: { lat: 37.5271, lng: 126.8958 } },
  { id: "yd-cw-1", type: "crosswalk", name: "횡단보도 1", position: { lat: 37.5266, lng: 126.8968 } },
  { id: "yd-dz-1", type: "danger", name: "어두운 골목", position: { lat: 37.5278, lng: 126.893 }, description: "가로등 없는 골목" },
  { id: "yd-eb-1", type: "emergency_bell", name: "비상벨", position: { lat: 37.5272, lng: 126.8952 } },
  { id: "yd-eb-2", type: "emergency_bell", name: "비상벨 2", position: { lat: 37.5265, lng: 126.8972 } },
];

// ─── Exports ────────────────────────────────────────────────────────────
export const FACILITIES_BY_AREA: Record<string, DomainFacility[]> = {
  "area-mapo": MAPO_FACILITIES,
  "area-gangnam": GANGNAM_FACILITIES,
  "area-jongno": JONGNO_FACILITIES,
  "area-songpa": SONGPA_FACILITIES,
  "area-yeongdeungpo": YEONGDEUNGPO_FACILITIES,
};

export const MOCK_FACILITIES: DomainFacility[] = Object.values(FACILITIES_BY_AREA).flat();

export function findFacilitiesByArea(areaId: string): DomainFacility[] {
  return FACILITIES_BY_AREA[areaId] ?? [];
}
```

Keep `SAFE_ROUTE_FACILITIES`, `BALANCED_ROUTE_FACILITIES`, `FASTEST_ROUTE_FACILITIES` but reference from the Mapo group:

```typescript
export const SAFE_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  !f.id.endsWith("dz-1"),
);
export const BALANCED_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  ["mapo-sl-1", "mapo-sl-2", "mapo-cctv-1", "mapo-cctv-2", "mapo-ps-1", "mapo-cw-1"].includes(f.id),
);
export const FASTEST_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  ["mapo-sl-1", "mapo-cctv-1", "mapo-dz-1"].includes(f.id),
);
```

- [ ] **Step 4: Replace src/data/mock/routes.ts — routes for all 5 schools**

Keep the existing Mapo routes, add 2-3 routes per new school. Each school's routes use `calculateRouteSafety()` with facilities from that school's area. Organize with `ROUTES_BY_SCHOOL: Record<string, RouteOption[]>`.

The implementer must:
1. Import `calculateRouteSafety` and `buildFacilityInfluences` (already used)
2. For each new school, select subsets of that school's facilities for safe/balanced/fast routes
3. Pre-calculate safety scores
4. Define route waypoints near the school position
5. Export `ROUTES_BY_SCHOOL` and `MOCK_ROUTES` (flat array)

- [ ] **Step 5: Update src/data/mock/analyses.ts**

Update to generate analyses for all 5 schools.

- [ ] **Step 6: Verify**

```bash
pnpm type-check && pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add src/data/mock/ src/lib/maps/types.ts
git commit -m "feat: expand mock data to 5 schools with facilities and routes"
```

---

## Task 4: Update API routes — schoolId filtering + schools endpoint

**Files:**
- Create: `src/app/api/schools/route.ts`
- Modify: `src/app/api/routes/route.ts`
- Modify: `src/app/api/facilities/route.ts`

- [ ] **Step 1: Create src/app/api/schools/route.ts**

```typescript
import { NextResponse } from "next/server";
import { MOCK_SCHOOLS } from "@/data/mock/schools";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const filtered = query
    ? MOCK_SCHOOLS.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query),
      )
    : MOCK_SCHOOLS;

  return NextResponse.json({
    ok: true,
    data: filtered,
    total: filtered.length,
  });
}
```

- [ ] **Step 2: Update src/app/api/routes/route.ts — filter by schoolId**

In the mock branch, use `ROUTES_BY_SCHOOL` to return only the routes for the requested school:

```typescript
import { NextResponse } from "next/server";
import { listRouteAnalysesForSchool } from "@/server/repositories/route-analysis-repository";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { ROUTES_BY_SCHOOL } from "@/data/mock/routes";
import { isDynamoDbConfigured } from "@/lib/env";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const schoolId = searchParams.get("schoolId") ?? DEFAULT_SCHOOL.id;

  if (!isDynamoDbConfigured()) {
    const routes = ROUTES_BY_SCHOOL[schoolId] ?? [];
    const recommended = routes.reduce(
      (best, r) => (r.score > (best?.score ?? 0) ? r : best),
      routes[0],
    );
    return NextResponse.json({
      ok: true,
      data: {
        routes,
        recommendedRouteId: recommended?.id ?? null,
        analyzedAt: new Date().toISOString(),
      },
      total: routes.length,
    });
  }

  const analyses = await listRouteAnalysesForSchool(schoolId);
  const latest = analyses[0] ?? null;

  return NextResponse.json({
    ok: true,
    data: latest
      ? {
          routes: latest.routes,
          recommendedRouteId: latest.recommendedRouteId,
          analyzedAt: latest.analyzedAt,
        }
      : null,
    total: latest?.routes.length ?? 0,
  });
}
```

- [ ] **Step 3: Update src/app/api/facilities/route.ts — use mock lookup**

The existing code already delegates to `listFacilitiesByArea()` which uses the repository. For mock mode, the repository falls back to mock data. Ensure the repository's mock fallback uses the new `findFacilitiesByArea()` helper. If the repository does NOT already filter by areaId in mock mode, update the mock fallback in `src/server/repositories/facility-repository.ts`:

```typescript
// In the mock fallback section of listFacilitiesByArea():
import { findFacilitiesByArea } from "@/data/mock/facilities";
// ...
if (!isDynamoDbConfigured()) {
  return findFacilitiesByArea(areaId);
}
```

- [ ] **Step 4: Verify all 3 APIs**

```bash
pnpm dev &
# In another terminal:
curl http://localhost:3000/api/schools
curl http://localhost:3000/api/schools?q=마포
curl http://localhost:3000/api/routes?schoolId=school-1
curl http://localhost:3000/api/routes?schoolId=school-gangnam
curl http://localhost:3000/api/facilities?areaId=area-mapo
curl http://localhost:3000/api/facilities?areaId=area-gangnam
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ src/server/repositories/facility-repository.ts
git commit -m "feat: add schools search API and schoolId-based route filtering"
```

---

## Task 5: Create map config files — night style + glow config

**Files:**
- Create: `src/lib/maps/night-style.ts`
- Create: `src/lib/maps/glow-config.ts`

- [ ] **Step 1: Create src/lib/maps/night-style.ts**

Google Maps JSON style array for a dark night theme. All elements darkened, labels muted, minimal color.

```typescript
export const NIGHT_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0a0f1e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0f1e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a1f35" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212945" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e2540" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#080d1a" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1f35" }],
  },
];
```

- [ ] **Step 2: Create src/lib/maps/glow-config.ts**

```typescript
import type { ExtendedFacilityType } from "@/lib/maps/types";

export interface GlowStyle {
  color: string;
  radiusPx: number;
  iconSize: number;
  label: string;
}

export const FACILITY_GLOW: Record<ExtendedFacilityType, GlowStyle> = {
  streetlight: { color: "#FFD700", radiusPx: 40, iconSize: 8, label: "가로등" },
  cctv: { color: "#4FC3F7", radiusPx: 24, iconSize: 7, label: "CCTV" },
  police: { color: "#FFFFFF", radiusPx: 48, iconSize: 10, label: "경찰" },
  police_station: { color: "#FFFFFF", radiusPx: 48, iconSize: 10, label: "파출소" },
  crosswalk: { color: "#E0E0E0", radiusPx: 30, iconSize: 7, label: "횡단보도" },
  danger: { color: "#B71C1C", radiusPx: 32, iconSize: 9, label: "위험구간" },
  emergency_bell: { color: "#FF9800", radiusPx: 22, iconSize: 7, label: "비상벨" },
};

export const ROUTE_COLORS = {
  safe: { stroke: "#FFD700", opacity: 1, weight: 5, glowWeight: 12, glowOpacity: 0.3 },
  moderate: { stroke: "#FFC107", opacity: 0.8, weight: 4, glowWeight: 10, glowOpacity: 0.2 },
  caution: { stroke: "#616161", opacity: 0.5, weight: 3, glowWeight: 0, glowOpacity: 0 },
} as const;

export const ROUTE_SELECTED_MULTIPLIER = 1.5;
export const ROUTE_UNSELECTED_OPACITY = 0.3;
```

- [ ] **Step 3: Verify**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/maps/night-style.ts src/lib/maps/glow-config.ts
git commit -m "feat: add night map style and facility glow configuration"
```

---

## Task 6: Create map components — BitgilMap, FacilityGlowMarker, RoutePolyline

**Files:**
- Create: `src/components/map/BitgilMap.tsx`
- Create: `src/components/map/FacilityGlowMarker.tsx`
- Create: `src/components/map/RoutePolyline.tsx`

- [ ] **Step 1: Create src/components/map/FacilityGlowMarker.tsx**

A client component that renders a single facility as an `<AdvancedMarker>` with a glowing HTML div.

```tsx
"use client";

import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { DomainFacility } from "@/domain/entities/facility";
import { FACILITY_GLOW } from "@/lib/maps/glow-config";

interface FacilityGlowMarkerProps {
  facility: DomainFacility;
}

export function FacilityGlowMarker({ facility }: FacilityGlowMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);
  const glow = FACILITY_GLOW[facility.type];

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={facility.position}
        onClick={() => setShowInfo(true)}
      >
        <div
          className="animate-pulse rounded-full"
          style={{
            width: glow.radiusPx,
            height: glow.radiusPx,
            background: `radial-gradient(circle, ${glow.color}60 0%, ${glow.color}20 40%, transparent 70%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: glow.iconSize,
              height: glow.iconSize,
              backgroundColor: glow.color,
              boxShadow: `0 0 ${glow.radiusPx / 2}px ${glow.color}`,
            }}
          />
        </div>
      </AdvancedMarker>
      {showInfo && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setShowInfo(false)}>
          <div className="p-1 text-sm text-gray-900">
            <p className="font-semibold">{facility.name}</p>
            <p className="text-xs text-gray-600">{glow.label}</p>
            {facility.description && (
              <p className="mt-1 text-xs text-gray-500">{facility.description}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
```

- [ ] **Step 2: Create src/components/map/RoutePolyline.tsx**

Renders a route as two overlapping `<Polyline>` elements (outer glow + inner line).

```tsx
"use client";

import { Polyline } from "@vis.gl/react-google-maps";
import type { RouteOption, SafetyLevel } from "@/lib/maps/types";
import { ROUTE_COLORS, ROUTE_SELECTED_MULTIPLIER, ROUTE_UNSELECTED_OPACITY } from "@/lib/maps/glow-config";

interface RoutePolylineProps {
  route: RouteOption;
  selected: boolean;
  onClick: () => void;
}

export function RoutePolyline({ route, selected, onClick }: RoutePolylineProps) {
  const level: SafetyLevel = route.safetyLevel;
  const config = ROUTE_COLORS[level];
  const multiplier = selected ? ROUTE_SELECTED_MULTIPLIER : 1;
  const opacity = selected ? config.opacity : ROUTE_UNSELECTED_OPACITY;
  const path = route.points.map((p) => p.position);

  return (
    <>
      {/* Outer glow line */}
      {config.glowWeight > 0 && (
        <Polyline
          path={path}
          strokeColor={config.stroke}
          strokeOpacity={selected ? config.glowOpacity : config.glowOpacity * 0.3}
          strokeWeight={config.glowWeight * multiplier}
          onClick={onClick}
        />
      )}
      {/* Inner solid line */}
      <Polyline
        path={path}
        strokeColor={config.stroke}
        strokeOpacity={opacity}
        strokeWeight={config.weight * multiplier}
        onClick={onClick}
      />
    </>
  );
}
```

- [ ] **Step 3: Create src/components/map/BitgilMap.tsx**

Main map component that wraps `<Map>` from `@vis.gl/react-google-maps` with night theme, tilt, facilities, and routes.

```tsx
"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MAPS_CONFIG } from "@/lib/maps/config";
import { NIGHT_MAP_STYLE } from "@/lib/maps/night-style";
import { FacilityGlowMarker } from "@/components/map/FacilityGlowMarker";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import type { DomainFacility } from "@/domain/entities/facility";
import type { RouteOption, GeoPoint } from "@/lib/maps/types";

interface BitgilMapProps {
  center: GeoPoint;
  facilities: DomainFacility[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
}

export function BitgilMap({
  center,
  facilities,
  routes,
  selectedRouteId,
  onRouteSelect,
}: BitgilMapProps) {
  if (!MAPS_CONFIG.apiKey) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0f1e] text-slate-500">
        <p>Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={MAPS_CONFIG.apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={MAPS_CONFIG.defaultZoom}
        mapId={MAPS_CONFIG.mapId}
        styles={MAPS_CONFIG.mapId ? undefined : NIGHT_MAP_STYLE}
        tilt={MAPS_CONFIG.mapId ? 45 : 0}
        heading={0}
        gestureHandling="greedy"
        disableDefaultUI={true}
        zoomControl={true}
        className="h-full w-full"
      >
        {facilities.map((f) => (
          <FacilityGlowMarker key={f.id} facility={f} />
        ))}
        {routes.map((r) => (
          <RoutePolyline
            key={r.id}
            route={r}
            selected={selectedRouteId === r.id}
            onClick={() => onRouteSelect(r.id)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
```

- [ ] **Step 4: Verify**

```bash
pnpm type-check
```

- [ ] **Step 5: Commit**

```bash
git add src/components/map/
git commit -m "feat: add BitgilMap with night theme, glow markers, and route polylines"
```

---

## Task 7: Create search component and hooks

**Files:**
- Create: `src/hooks/useSchoolSearch.ts`
- Create: `src/hooks/useSchoolData.ts`
- Create: `src/components/search/SchoolSearch.tsx`

- [ ] **Step 1: Create src/hooks/useSchoolSearch.ts**

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { School } from "@/lib/maps/types";

export function useSchoolSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isComposing = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/schools?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.ok) {
        setResults(json.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isComposing.current) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isComposing,
  };
}
```

- [ ] **Step 2: Create src/hooks/useSchoolData.ts**

```typescript
"use client";

import { useState, useEffect } from "react";
import type { School, RouteOption } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

interface SchoolData {
  routes: RouteOption[];
  facilities: DomainFacility[];
  isLoading: boolean;
}

export function useSchoolData(school: School | null): SchoolData {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [facilities, setFacilities] = useState<DomainFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!school) {
      setRoutes([]);
      setFacilities([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      fetch(`/api/routes?schoolId=${school.id}`).then((r) => r.json()),
      fetch(`/api/facilities?areaId=${school.areaId}`).then((r) => r.json()),
    ])
      .then(([routesRes, facilitiesRes]) => {
        if (cancelled) return;
        setRoutes(routesRes.data?.routes ?? []);
        setFacilities(facilitiesRes.data ?? []);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [school]);

  return { routes, facilities, isLoading };
}
```

- [ ] **Step 3: Create src/components/search/SchoolSearch.tsx**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import type { School } from "@/lib/maps/types";

interface SchoolSearchProps {
  onSelect: (school: School) => void;
  selectedSchool: School | null;
}

export function SchoolSearch({ onSelect, selectedSchool }: SchoolSearchProps) {
  const { query, setQuery, results, isComposing } = useSchoolSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(school: School) {
    onSelect(school);
    setQuery(school.name);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={selectedSchool && !isOpen ? selectedSchool.name : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={(e) => {
          isComposing.current = false;
          setQuery(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        placeholder="학교 이름으로 검색..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-slate-500 outline-none ring-blue-500/50 transition-all focus:border-blue-500/30 focus:ring-2"
      />
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl">
          {results.map((school) => (
            <li key={school.id}>
              <button
                className="w-full px-5 py-3 text-left transition-colors hover:bg-white/5"
                onClick={() => handleSelect(school)}
              >
                <span className="block text-sm font-medium text-white">{school.name}</span>
                <span className="block text-xs text-slate-500">{school.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
pnpm type-check
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSchoolSearch.ts src/hooks/useSchoolData.ts src/components/search/SchoolSearch.tsx
git commit -m "feat: add school search with autocomplete and data hooks"
```

---

## Task 8: Create SafetyBreakdown component

**Files:**
- Create: `src/components/route/SafetyBreakdown.tsx`

- [ ] **Step 1: Create src/components/route/SafetyBreakdown.tsx**

Horizontal bar chart showing each safety factor's point contribution.

```tsx
import { cn } from "@/lib/utils/cn";
import type { SafetyFactor, SafetyLevel } from "@/lib/maps/types";

interface SafetyBreakdownProps {
  factors: SafetyFactor[];
  score: number;
  level: SafetyLevel;
}

const BASE_SCORE = 50;
const MAX_BAR = 40; // max single factor impact for scaling

const levelLabel: Record<SafetyLevel, string> = {
  safe: "Safe",
  moderate: "Moderate",
  caution: "Caution",
};

const levelColor: Record<SafetyLevel, string> = {
  safe: "text-emerald-400",
  moderate: "text-yellow-400",
  caution: "text-red-400",
};

export function SafetyBreakdown({ factors, score, level }: SafetyBreakdownProps) {
  return (
    <div className="space-y-2 pt-3">
      {factors.map((factor) => {
        const isNegative = factor.impact < 0;
        const barWidth = Math.min(Math.abs(factor.impact) / MAX_BAR, 1) * 100;

        return (
          <div key={factor.type} className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 truncate text-slate-400">{factor.label}</span>
            <div className="relative h-3 flex-1 rounded-full bg-white/5">
              <div
                className={cn(
                  "absolute top-0 h-3 rounded-full",
                  isNegative ? "right-1/2 bg-red-500/60" : "left-1/2 bg-emerald-500/60",
                )}
                style={{ width: `${barWidth / 2}%` }}
              />
            </div>
            <span
              className={cn(
                "w-10 shrink-0 text-right font-mono",
                isNegative ? "text-red-400" : "text-emerald-400",
              )}
            >
              {isNegative ? "" : "+"}{factor.impact}
            </span>
          </div>
        );
      })}
      <div className="mt-3 border-t border-white/5 pt-2 text-xs text-slate-400">
        Base {BASE_SCORE} → Final{" "}
        <span className={cn("font-bold", levelColor[level])}>{score}</span>{" "}
        <span className={cn(levelColor[level])}>({levelLabel[level]})</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/route/SafetyBreakdown.tsx
git commit -m "feat: add SafetyBreakdown component with factor bars"
```

---

## Task 9: Enhance RouteComparisonPanel and RouteCard

**Files:**
- Modify: `src/components/route/RouteComparisonPanel.tsx`
- Modify: `src/components/ui/RouteCard.tsx`

- [ ] **Step 1: Update RouteComparisonPanel — accept external state + show breakdown**

```tsx
"use client";

import { RouteCard } from "@/components/ui/RouteCard";
import { SafetyBreakdown } from "@/components/route/SafetyBreakdown";
import type { RouteOption } from "@/lib/maps/types";

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
}

export function RouteComparisonPanel({
  routes,
  selectedRouteId,
  onRouteSelect,
}: RouteComparisonPanelProps) {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <button
          key={route.id}
          className="w-full text-left"
          onClick={() => onRouteSelect(route.id)}
        >
          <RouteCard route={route} selected={selectedRouteId === route.id} />
        </button>
      ))}
      {selectedRoute && (
        <SafetyBreakdown
          factors={selectedRoute.safetyDetails.factors}
          score={selectedRoute.safetyDetails.score}
          level={selectedRoute.safetyDetails.level}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update RouteCard — add facility count badges**

Add a row of inline badges showing facility type counts from `facilityInfluences`:

Add between distance/time row and explanation:

```tsx
{/* Facility count badges */}
<div className="mb-2 flex flex-wrap gap-1.5">
  {Object.entries(
    route.facilityInfluences.reduce<Record<string, number>>(
      (acc, fi) => ({ ...acc, [fi.facilityType]: (acc[fi.facilityType] ?? 0) + 1 }),
      {},
    ),
  ).map(([type, count]) => (
    <span
      key={type}
      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
    >
      {type} {count}
    </span>
  ))}
</div>
```

- [ ] **Step 3: Verify**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/route/RouteComparisonPanel.tsx src/components/ui/RouteCard.tsx
git commit -m "feat: enhance route panel with safety breakdown and facility badges"
```

---

## Task 10: Simplify Header and update Footer

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Simplify Header — remove non-functional nav and buttons**

```tsx
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            {SITE_NAME}
          </span>
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
            Beta
          </span>
        </Link>
      </div>
    </header>
  );
}
```

Key changes: `fixed` → `sticky`, smaller height, remove nav links, remove login/get-started buttons.

- [ ] **Step 2: Simplify Footer**

Remove the "Product" and "Resources" link columns. Keep only the logo/description and copyright.

```tsx
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-[#080d1a] py-6">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-xs text-slate-600">
          &copy; {year} {SITE_NAME} — {SITE_DESCRIPTION}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "refactor: simplify Header and Footer for functional page"
```

---

## Task 11: Rewrite main page — search + map + panel layout

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

This is the core integration task. The page becomes a client component that orchestrates search, map, and panel.

- [ ] **Step 1: Rewrite src/app/page.tsx**

```tsx
"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolSearch } from "@/components/search/SchoolSearch";
import { BitgilMap } from "@/components/map/BitgilMap";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import { useSchoolData } from "@/hooks/useSchoolData";
import type { School } from "@/lib/maps/types";

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { routes, facilities, isLoading } = useSchoolData(selectedSchool);

  const handleSchoolSelect = useCallback((school: School) => {
    setSelectedSchool(school);
    setSelectedRouteId(null);
  }, []);

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
  }, []);

  // Auto-select first route when routes load
  const effectiveRouteId = selectedRouteId ?? routes[0]?.id ?? null;

  return (
    <div className="flex h-screen flex-col bg-[#0a0f1e] text-slate-100">
      <Header />

      {/* Search bar */}
      <div className="border-b border-white/5 px-4 py-3">
        <SchoolSearch onSelect={handleSchoolSelect} selectedSchool={selectedSchool} />
      </div>

      {/* Main content: map + panel */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Map */}
        <div className="relative h-[50vh] lg:h-auto lg:flex-[2]">
          {selectedSchool ? (
            <BitgilMap
              center={selectedSchool.position}
              facilities={facilities}
              routes={routes}
              selectedRouteId={effectiveRouteId}
              onRouteSelect={handleRouteSelect}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <div className="text-center">
                <p className="text-lg font-medium">학교를 검색하세요</p>
                <p className="mt-1 text-sm">안전한 통학로를 찾아드립니다</p>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1e]/60">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Route panel */}
        <div className="flex-1 overflow-y-auto border-t border-white/5 p-4 lg:max-w-sm lg:border-l lg:border-t-0">
          {routes.length > 0 ? (
            <RouteComparisonPanel
              routes={routes}
              selectedRouteId={effectiveRouteId}
              onRouteSelect={handleRouteSelect}
            />
          ) : selectedSchool ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              <p className="text-sm">경로 데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <p className="text-sm">학교를 선택하면 경로가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Update globals.css — add glow animation keyframe**

Add after existing content:

```css
/* Glow pulse animation for facility markers */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm type-check && pnpm lint
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat: rewrite main page with search, map, and route panel"
```

---

## Task 12: Remove landing page files and unused components

**Files:**
- Remove: `src/features/landing/HeroSection.tsx`
- Remove: `src/features/landing/OverviewSection.tsx`
- Remove: `src/features/landing/SafetyFactorsSection.tsx`
- Remove: `src/features/landing/AiSection.tsx`
- Remove: `src/features/landing/MapPreviewSection.tsx`
- Remove: `src/features/landing/RouteComparisonSection.tsx`
- Remove: `src/components/map/MapPlaceholder.tsx`
- Remove: `src/components/ui/FeatureCard.tsx`
- Remove: `src/components/ui/SectionTitle.tsx`

- [ ] **Step 1: Remove files**

```bash
rm src/features/landing/HeroSection.tsx
rm src/features/landing/OverviewSection.tsx
rm src/features/landing/SafetyFactorsSection.tsx
rm src/features/landing/AiSection.tsx
rm src/features/landing/MapPreviewSection.tsx
rm src/features/landing/RouteComparisonSection.tsx
rm src/components/map/MapPlaceholder.tsx
rm src/components/ui/FeatureCard.tsx
rm src/components/ui/SectionTitle.tsx
```

- [ ] **Step 2: Check for remaining references**

```bash
grep -r "features/landing" src/ --include="*.ts" --include="*.tsx"
grep -r "MapPlaceholder" src/ --include="*.ts" --include="*.tsx"
grep -r "FeatureCard" src/ --include="*.ts" --include="*.tsx"
grep -r "SectionTitle" src/ --include="*.ts" --include="*.tsx"
```

All should return empty. If any references remain, remove them.

- [ ] **Step 3: Remove empty features/landing directory**

```bash
rmdir src/features/landing
rmdir src/features  # if empty
```

- [ ] **Step 4: Verify**

```bash
pnpm type-check && pnpm lint
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove landing page sections and unused components"
```

---

## Task 13: Final verification and cleanup

- [ ] **Step 1: Run full checks**

```bash
pnpm type-check && pnpm lint && pnpm build
```

- [ ] **Step 2: Manual browser test**

```bash
pnpm dev
```

Open `http://localhost:3000` and verify:
1. Search bar is visible and focused
2. Typing "마포" shows autocomplete with 마포고등학교
3. Selecting a school loads the map with dark theme
4. Facilities show glow effects
5. Routes display as colored polylines
6. Clicking a route card highlights it on the map
7. Safety breakdown shows factor bars
8. Responsive: test on narrow viewport

- [ ] **Step 3: Clean up any remaining issues**

Fix lint warnings, type errors, or visual issues found during testing.

- [ ] **Step 4: Update .env.example if needed**

Ensure `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` is documented.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
