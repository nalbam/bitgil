# Google Directions API Safe Route Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock routes with real Google Directions walking routes, scored for safety using nearby facility data.

**Architecture:** Server-side API calls Google Directions, decodes polylines, builds spatial index of facilities for proximity queries, scores each route via existing `calculateRouteSafety`. Client adds origin input (Places Autocomplete + map click) and direction toggle.

**Tech Stack:** Google Directions API, Google Places Autocomplete, Next.js API routes, existing deck.gl PathLayer

**Spec:** `docs/superpowers/specs/2026-03-19-directions-api-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/lib/geo/haversine.ts` | Haversine distance utility |
| Create | `src/lib/geo/polyline.ts` | Google polyline decoder |
| Create | `src/lib/geo/spatial-index.ts` | Grid-based spatial index for fast proximity queries |
| Create | `src/lib/geo/sample-waypoints.ts` | Sample points along a polyline at intervals |
| Create | `src/server/services/facility-proximity-service.ts` | Load facilities, build spatial index, query nearby |
| Create | `src/server/services/directions-service.ts` | Call Google Directions API, score routes |
| Create | `src/app/api/routes/directions/route.ts` | POST endpoint for direction-based routes |
| Create | `src/components/search/OriginInput.tsx` | Places Autocomplete + clear button |
| Modify | `src/lib/env/index.ts` | Add `isDirectionsConfigured()` helper |
| Modify | `src/hooks/useSchoolData.ts` | Add origin state + directions API call |
| Modify | `src/components/map/BitgilMap.tsx` | Origin marker + map click handler |
| Modify | `src/app/page.tsx` | Wire OriginInput + origin state + direction toggle |
| Modify | `.env.example` | Add `GOOGLE_DIRECTIONS_API_KEY` |

---

### Task 1: Geo Utilities — Haversine, Polyline Decoder, Waypoint Sampler

**Files:**
- Create: `src/lib/geo/haversine.ts`
- Create: `src/lib/geo/polyline.ts`
- Create: `src/lib/geo/sample-waypoints.ts`

- [ ] **Step 1: Create haversine distance utility**

```typescript
// src/lib/geo/haversine.ts
const R = 6371; // Earth radius in km

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

- [ ] **Step 2: Create polyline decoder**

Google encoded polyline → coordinate array. Reference: https://developers.google.com/maps/documentation/utilities/polylinealgorithm

```typescript
// src/lib/geo/polyline.ts
type LatLng = { lat: number; lng: number };

export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}
```

- [ ] **Step 3: Create waypoint sampler**

Sample points along a decoded polyline at regular intervals.

```typescript
// src/lib/geo/sample-waypoints.ts
import { haversineKm } from "@/lib/geo/haversine";

type LatLng = { lat: number; lng: number };

export function sampleWaypoints(points: LatLng[], intervalKm: number = 0.05): LatLng[] {
  if (points.length === 0) return [];

  const sampled: LatLng[] = [points[0]!];
  let accumulated = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    accumulated += haversineKm(prev.lat, prev.lng, curr.lat, curr.lng);

    if (accumulated >= intervalKm) {
      sampled.push(curr);
      accumulated = 0;
    }
  }

  // Always include last point
  const last = points[points.length - 1]!;
  if (sampled[sampled.length - 1] !== last) {
    sampled.push(last);
  }

  return sampled;
}
```

- [ ] **Step 4: Verify type-check**

```bash
pnpm type-check
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/geo/
git commit -m "feat: add geo utilities — haversine, polyline decoder, waypoint sampler"
```

---

### Task 2: Spatial Index for Facility Proximity Queries

**Files:**
- Create: `src/lib/geo/spatial-index.ts`
- Create: `src/server/services/facility-proximity-service.ts`

- [ ] **Step 1: Create grid-based spatial index**

```typescript
// src/lib/geo/spatial-index.ts
import { haversineKm } from "@/lib/geo/haversine";

type CoordPair = [number, number]; // [lat, lng]

const CELL_SIZE = 0.001; // ~111m per cell

function cellKey(lat: number, lng: number): string {
  return `${Math.floor(lat / CELL_SIZE)},${Math.floor(lng / CELL_SIZE)}`;
}

export class SpatialIndex {
  private grid = new Map<string, CoordPair[]>();

  constructor(points: CoordPair[]) {
    for (const p of points) {
      const key = cellKey(p[0], p[1]);
      const cell = this.grid.get(key);
      if (cell) {
        cell.push(p);
      } else {
        this.grid.set(key, [p]);
      }
    }
  }

  queryRadius(lat: number, lng: number, radiusKm: number): CoordPair[] {
    const cellSpan = Math.ceil(radiusKm / (CELL_SIZE * 111.32)) + 1;
    const centerCellLat = Math.floor(lat / CELL_SIZE);
    const centerCellLng = Math.floor(lng / CELL_SIZE);
    const results: CoordPair[] = [];

    for (let dlat = -cellSpan; dlat <= cellSpan; dlat++) {
      for (let dlng = -cellSpan; dlng <= cellSpan; dlng++) {
        const key = `${centerCellLat + dlat},${centerCellLng + dlng}`;
        const cell = this.grid.get(key);
        if (!cell) continue;
        for (const p of cell) {
          if (haversineKm(lat, lng, p[0], p[1]) <= radiusKm) {
            results.push(p);
          }
        }
      }
    }

    return results;
  }
}
```

- [ ] **Step 2: Create facility proximity service**

```typescript
// src/server/services/facility-proximity-service.ts
import { getAllStreetlights } from "@/lib/api/streetlight-csv";
import { getAllCctv } from "@/lib/api/cctv-csv";
import { getAllDangerZones } from "@/lib/api/danger-zone-csv";
import { SpatialIndex } from "@/lib/geo/spatial-index";
import type { DomainFacility } from "@/domain/entities/facility";

type CoordPair = [number, number];

interface FacilityIndices {
  streetlight: SpatialIndex;
  cctv: SpatialIndex;
  danger: SpatialIndex;
}

let cachedIndices: FacilityIndices | null = null;

function getIndices(): FacilityIndices {
  if (cachedIndices) return cachedIndices;
  cachedIndices = {
    streetlight: new SpatialIndex(getAllStreetlights()),
    cctv: new SpatialIndex(getAllCctv()),
    danger: new SpatialIndex(getAllDangerZones()),
  };
  return cachedIndices;
}

const RADIUS_KM = 0.1; // 100m

export function findNearbyFacilities(lat: number, lng: number): DomainFacility[] {
  const indices = getIndices();
  const facilities: DomainFacility[] = [];
  let id = 0;

  const toFacility = (coord: CoordPair, type: DomainFacility["type"], label: string): DomainFacility => ({
    id: `nearby-${type}-${id++}`,
    type,
    name: label,
    position: { lat: coord[0], lng: coord[1] },
  });

  for (const c of indices.streetlight.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "streetlight", "가로등"));
  }
  for (const c of indices.cctv.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "cctv", "CCTV"));
  }
  for (const c of indices.danger.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "danger", "위험구간"));
  }

  return facilities;
}

export function countStreetlightsNear(lat: number, lng: number): number {
  return getIndices().streetlight.queryRadius(lat, lng, RADIUS_KM).length;
}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/geo/spatial-index.ts src/server/services/facility-proximity-service.ts
git commit -m "feat: add spatial index and facility proximity service"
```

---

### Task 3: Directions Service — Google API + Safety Scoring

**Files:**
- Create: `src/server/services/directions-service.ts`
- Modify: `src/lib/env/index.ts`

- [ ] **Step 1: Add `isDirectionsConfigured()` to env helpers**

```typescript
// Add to src/lib/env/index.ts

export function isDirectionsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_DIRECTIONS_API_KEY);
}
```

- [ ] **Step 2: Create directions service**

```typescript
// src/server/services/directions-service.ts
import { decodePolyline } from "@/lib/geo/polyline";
import { sampleWaypoints } from "@/lib/geo/sample-waypoints";
import { haversineKm } from "@/lib/geo/haversine";
import { findNearbyFacilities, countStreetlightsNear } from "@/server/services/facility-proximity-service";
import {
  calculateRouteSafety,
  buildFacilityInfluences,
} from "@/domain/services/calculate-route-safety";
import type { RouteOption } from "@/lib/maps/types";

interface LatLng {
  lat: number;
  lng: number;
}

interface DirectionsRequest {
  origin: LatLng;
  destination: LatLng;
}

interface DirectionsResult {
  routes: RouteOption[];
  recommendedRouteId: string;
}

const ROUTE_NAMES = ["안전 경로", "균형 경로", "빠른 경로"];
const UNLIT_CONSECUTIVE_THRESHOLD = 3;

export async function getDirectionsWithSafety(
  req: DirectionsRequest,
): Promise<DirectionsResult> {
  const apiKey = process.env.GOOGLE_DIRECTIONS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_DIRECTIONS_API_KEY not configured");

  // Validate distance
  const distKm = haversineKm(
    req.origin.lat,
    req.origin.lng,
    req.destination.lat,
    req.destination.lng,
  );
  if (distKm > 10) {
    throw new DirectionsError("출발지와 학교 간 거리가 너무 멉니다 (최대 10km)");
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${req.origin.lat},${req.origin.lng}`);
  url.searchParams.set("destination", `${req.destination.lat},${req.destination.lng}`);
  url.searchParams.set("mode", "walking");
  url.searchParams.set("alternatives", "true");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new DirectionsError("경로 서비스를 일시적으로 사용할 수 없습니다");
  }

  const data = await response.json();

  if (data.status === "ZERO_RESULTS") {
    throw new DirectionsError("도보 경로를 찾을 수 없습니다");
  }
  if (data.status !== "OK") {
    throw new DirectionsError("경로 서비스를 일시적으로 사용할 수 없습니다");
  }

  const googleRoutes = data.routes as GoogleRoute[];
  const scoredRoutes: RouteOption[] = [];

  for (let i = 0; i < googleRoutes.length; i++) {
    const gr = googleRoutes[i]!;
    const leg = gr.legs[0]!;
    const polylinePoints = decodePolyline(gr.overview_polyline.points);
    const sampled = sampleWaypoints(polylinePoints, 0.05);

    // Collect all facilities near waypoints
    const allFacilities = new Map<string, ReturnType<typeof findNearbyFacilities>[number]>();
    let unlitConsecutive = 0;
    let hasUnlitSegment = false;

    for (const wp of sampled) {
      const nearby = findNearbyFacilities(wp.lat, wp.lng);
      for (const f of nearby) {
        const key = `${f.type}-${f.position.lat.toFixed(6)}-${f.position.lng.toFixed(6)}`;
        allFacilities.set(key, f);
      }

      // Check unlit segment
      const streetlightCount = countStreetlightsNear(wp.lat, wp.lng);
      if (streetlightCount === 0) {
        unlitConsecutive++;
        if (unlitConsecutive >= UNLIT_CONSECUTIVE_THRESHOLD) {
          hasUnlitSegment = true;
        }
      } else {
        unlitConsecutive = 0;
      }
    }

    const facilities = Array.from(allFacilities.values());
    const safetyDetails = calculateRouteSafety({ facilities, hasUnlitSegment });
    const facilityInfluences = buildFacilityInfluences(facilities);

    // Build explanation
    const summary = gr.summary || "도보 경로";
    const facilityTypeCounts = countFacilityTypes(facilities);
    const explanation = buildExplanation(summary, facilityTypeCounts, hasUnlitSegment);

    const routePoints = polylinePoints.map((p) => ({
      position: { lat: p.lat, lng: p.lng },
    }));

    scoredRoutes.push({
      id: `directions-${i}`,
      name: "", // Named after sorting
      safetyLevel: safetyDetails.level,
      points: routePoints,
      score: safetyDetails.score,
      estimatedMinutes: Math.round(leg.duration.value / 60),
      distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
      explanation,
      facilityInfluences,
      safetyDetails,
    });
  }

  // Sort by safety score descending
  scoredRoutes.sort((a, b) => b.score - a.score);

  // Assign names based on rank
  for (let i = 0; i < scoredRoutes.length; i++) {
    scoredRoutes[i] = {
      ...scoredRoutes[i]!,
      name: scoredRoutes.length === 1 ? "추천 경로" : (ROUTE_NAMES[i] ?? `경로 ${i + 1}`),
    };
  }

  return {
    routes: scoredRoutes,
    recommendedRouteId: scoredRoutes[0]?.id ?? "",
  };
}

function countFacilityTypes(
  facilities: ReturnType<typeof findNearbyFacilities>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of facilities) {
    counts[f.type] = (counts[f.type] ?? 0) + 1;
  }
  return counts;
}

function buildExplanation(
  summary: string,
  counts: Record<string, number>,
  hasUnlit: boolean,
): string {
  const parts: string[] = [`${summary} 경유`];

  const positives: string[] = [];
  if (counts.cctv) positives.push(`CCTV ${counts.cctv}개`);
  if (counts.streetlight) positives.push(`가로등 ${counts.streetlight}개`);
  if (positives.length > 0) parts.push(`${positives.join(", ")} 확인`);

  if (counts.danger) parts.push(`위험구간 ${counts.danger}곳 주의`);
  if (hasUnlit) parts.push("일부 어두운 구간 있음");

  return parts.join(". ") + ".";
}

export class DirectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectionsError";
  }
}

// Google Directions API response types (minimal)
interface GoogleRoute {
  summary: string;
  overview_polyline: { points: string };
  legs: {
    distance: { value: number; text: string };
    duration: { value: number; text: string };
  }[];
}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/server/services/directions-service.ts src/lib/env/index.ts
git commit -m "feat: add directions service with safety scoring"
```

---

### Task 4: API Endpoint — POST /api/routes/directions

**Files:**
- Create: `src/app/api/routes/directions/route.ts`

- [ ] **Step 1: Create the endpoint**

```typescript
// src/app/api/routes/directions/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDirectionsWithSafety,
  DirectionsError,
} from "@/server/services/directions-service";

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

// Simple response cache
const responseCache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(originLat: number, originLng: number, destLat: number, destLng: number): string {
  // Round to ~50m grid
  const round = (n: number) => Math.round(n * 2000) / 2000;
  return `${round(originLat)},${round(originLng)}-${round(destLat)},${round(destLng)}`;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  // Parse body
  let body: { origin?: { lat?: number; lng?: number }; destination?: { lat?: number; lng?: number } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청 형식입니다" }, { status: 400 });
  }

  const { origin, destination } = body;

  // Validate coordinates
  if (
    !origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng ||
    Math.abs(origin.lat) > 90 || Math.abs(destination.lat) > 90 ||
    Math.abs(origin.lng) > 180 || Math.abs(destination.lng) > 180
  ) {
    return NextResponse.json({ ok: false, error: "유효하지 않은 좌표입니다" }, { status: 400 });
  }

  if (origin.lat === destination.lat && origin.lng === destination.lng) {
    return NextResponse.json(
      { ok: false, error: "출발지와 도착지가 같습니다" },
      { status: 400 },
    );
  }

  // Check cache
  const key = cacheKey(origin.lat, origin.lng, destination.lat, destination.lng);
  const cached = responseCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json({ ok: true, data: cached.data });
  }

  try {
    const result = await getDirectionsWithSafety({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
    });

    // Cache result
    responseCache.set(key, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    if (err instanceof DirectionsError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    console.error("Directions API error:", err);
    return NextResponse.json(
      { ok: false, error: "경로 서비스를 일시적으로 사용할 수 없습니다" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Update `.env.example`**

Add to `.env.example`:

```
# Google Directions API (server-only - never expose to browser)
GOOGLE_DIRECTIONS_API_KEY=
```

- [ ] **Step 3: Verify type-check and lint**

```bash
pnpm type-check && pnpm lint
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/routes/directions/ .env.example
git commit -m "feat: add POST /api/routes/directions endpoint"
```

---

### Task 5: Client — Origin Input with Places Autocomplete

**Files:**
- Create: `src/components/search/OriginInput.tsx`

- [ ] **Step 1: Create OriginInput component**

Uses Google Places Autocomplete via the existing `@vis.gl/react-google-maps` provider (already wrapping the app via `BitgilMap`). This component is placed outside the Map, so it uses the standalone `useMapsLibrary` hook.

```tsx
// src/components/search/OriginInput.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface OriginInputProps {
  origin: { lat: number; lng: number } | null;
  onOriginChange: (origin: { lat: number; lng: number } | null) => void;
}

export function OriginInput({ origin, onOriginChange }: OriginInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    if (autocompleteRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "kr" },
      fields: ["geometry", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onOriginChange({ lat, lng });
        setInputValue(place.formatted_address ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [places, onOriginChange]);

  const handleClear = useCallback(() => {
    onOriginChange(null);
    setInputValue("");
    inputRef.current?.focus();
  }, [onOriginChange]);

  // Update display when origin set from map click
  useEffect(() => {
    if (origin && !inputValue) {
      setInputValue(`${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`);
    }
    if (!origin) {
      setInputValue("");
    }
  }, [origin, inputValue]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="출발지 검색 또는 지도 클릭..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 pr-10 text-white placeholder-slate-500 outline-none ring-blue-500/50 transition-all focus:border-blue-500/30 focus:ring-2"
      />
      {origin && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/search/OriginInput.tsx
git commit -m "feat: add OriginInput with Places Autocomplete"
```

---

### Task 6: Client — Update useSchoolData Hook

**Files:**
- Modify: `src/hooks/useSchoolData.ts`

- [ ] **Step 1: Add origin + directions support**

Replace the entire hook with:

```typescript
// src/hooks/useSchoolData.ts
"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { School, RouteOption, GeoPoint } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

interface SchoolData {
  routes: RouteOption[];
  facilities: DomainFacility[];
  isLoading: boolean;
  origin: GeoPoint | null;
  setOrigin: (origin: GeoPoint | null) => void;
  loadSchool: (school: School) => void;
  loadDirections: (school: School, origin: GeoPoint) => void;
  clear: () => void;
}

export function useSchoolData(): SchoolData {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [facilities, setFacilities] = useState<DomainFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadSchool = useCallback((school: School) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    Promise.all([
      fetch(`/api/routes?schoolId=${school.id}`, { signal: controller.signal }).then((r) =>
        r.json(),
      ),
      fetch(`/api/facilities?areaId=${school.areaId}`, { signal: controller.signal }).then((r) =>
        r.json(),
      ),
    ])
      .then(([routesRes, facilitiesRes]) => {
        setRoutes(routesRes.data?.routes ?? []);
        setFacilities(facilitiesRes.data ?? []);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, []);

  const loadDirections = useCallback((school: School, orig: GeoPoint) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    fetch("/api/routes/directions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: { lat: orig.lat, lng: orig.lng },
        destination: { lat: school.position.lat, lng: school.position.lng },
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setRoutes(json.data.routes ?? []);
        } else {
          console.error("Directions error:", json.error);
          setRoutes([]);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setRoutes([]);
    setFacilities([]);
    setOrigin(null);
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({ routes, facilities, isLoading, origin, setOrigin, loadSchool, loadDirections, clear }),
    [routes, facilities, isLoading, origin, loadSchool, loadDirections, clear],
  );
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSchoolData.ts
git commit -m "feat: add origin state and directions loading to useSchoolData"
```

---

### Task 7: Client — Origin Marker on Map + Click Handler

**Files:**
- Modify: `src/components/map/BitgilMap.tsx`

- [ ] **Step 1: Add origin props to BitgilMapProps**

Add to the interface:

```typescript
origin: GeoPoint | null;
onOriginChange: (origin: GeoPoint | null) => void;
```

- [ ] **Step 2: Add origin click handler and marker in MapContent**

Inside `MapContent`, add a click handler for origin selection and an `AdvancedMarker` for the origin:

```typescript
import { AdvancedMarker } from "@vis.gl/react-google-maps";

// Inside MapContent, after existing useEffect for map click:
useEffect(() => {
  if (!map || !selectedSchoolId) return;
  const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onOriginChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  });
  return () => listener.remove();
}, [map, selectedSchoolId, onOriginChange]);
```

Note: This replaces the existing "Close InfoWindow on map click" effect. Merge them:

```typescript
useEffect(() => {
  if (!map) return;
  const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
    setInfoSchoolId(null);
    setInfoPoliceId(null);
    if (selectedSchoolId && e.latLng) {
      onOriginChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  });
  return () => listener.remove();
}, [map, selectedSchoolId, onOriginChange]);
```

Add origin marker in the JSX return:

```tsx
{origin && (
  <AdvancedMarker position={origin}>
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm font-bold text-white shadow-lg">
      출
    </div>
  </AdvancedMarker>
)}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/map/BitgilMap.tsx
git commit -m "feat: add origin marker and click handler to BitgilMap"
```

---

### Task 8: Client — Wire Everything in page.tsx + Direction Toggle

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add OriginInput, direction toggle, and wire origin state**

Key changes to `page.tsx`:
- Import `OriginInput` and `APIProvider`
- Add `isReversed` state for direction toggle
- Call `loadDirections` when origin is set
- Wrap `OriginInput` in `APIProvider` so Places Autocomplete works
- Pass `origin` and `onOriginChange` to `BitgilMap`

```tsx
// Add to imports
import { OriginInput } from "@/components/search/OriginInput";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MAPS_CONFIG } from "@/lib/maps/config";
```

Add state:
```tsx
const [isReversed, setIsReversed] = useState(false);
```

Update `useSchoolData` destructuring:
```tsx
const { routes, isLoading, origin, setOrigin, loadSchool, loadDirections } = useSchoolData();
```

Add effect to load directions when origin changes:
```tsx
useEffect(() => {
  if (selectedSchool && origin) {
    if (isReversed) {
      loadDirections(
        { ...selectedSchool, position: origin } as School,
        selectedSchool.position,
      );
    } else {
      loadDirections(selectedSchool, origin);
    }
  }
}, [selectedSchool, origin, isReversed, loadDirections]);
```

Update the search bar section to include OriginInput and direction toggle:

```tsx
<div className="border-b border-white/5 px-4 py-3">
  <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
    <SchoolSearch onSelect={handleSchoolSelect} selectedSchool={selectedSchool} />
    {selectedSchool && (
      <div className="flex items-center gap-2">
        <OriginInput origin={origin} onOriginChange={setOrigin} />
        <button
          type="button"
          onClick={() => setIsReversed((prev) => !prev)}
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          title={isReversed ? "하교 (학교→집)" : "등교 (집→학교)"}
        >
          {isReversed ? "하교" : "등교"}
        </button>
      </div>
    )}
  </div>
</div>
```

Note: `OriginInput` uses `useMapsLibrary("places")` which requires being inside an `APIProvider`. Since `BitgilMap` already renders `APIProvider`, `OriginInput` needs to be either inside `BitgilMap` or we need a shared `APIProvider` wrapping both. The simplest approach is to move the `APIProvider` up to wrap the entire page content that needs Maps APIs. Update `page.tsx` to wrap the content area:

```tsx
// In the return, wrap the main layout with APIProvider
{MAPS_CONFIG.apiKey && (
  <APIProvider apiKey={MAPS_CONFIG.apiKey} libraries={["places"]}>
    {/* existing layout */}
  </APIProvider>
)}
```

And update `BitgilMap` to not render its own `APIProvider` when it's already wrapped (or simply remove the redundant wrapper — the nested `APIProvider` should be harmless but wasteful).

Pass origin props to BitgilMap:
```tsx
<BitgilMap
  {...existingProps}
  origin={origin}
  onOriginChange={setOrigin}
/>
```

- [ ] **Step 2: Verify type-check and lint**

```bash
pnpm type-check && pnpm lint
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire origin input, direction toggle, and directions API in page"
```

---

### Task 9: Manual Verification

- [ ] **Step 1: Set GOOGLE_DIRECTIONS_API_KEY in .env**

```bash
# .env
GOOGLE_DIRECTIONS_API_KEY=your-api-key-here
```

Make sure the API key has Directions API enabled in Google Cloud Console.

- [ ] **Step 2: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 3: Verification checklist**

Open browser at `http://localhost:3000`:
1. Select a school → OriginInput appears below school search
2. Type address in OriginInput → Places Autocomplete dropdown appears
3. Select address → origin marker appears on map
4. Routes load with safety scores in RouteComparisonPanel
5. Click map → origin marker moves, routes reload
6. Toggle 등교/하교 → routes reload with swapped direction
7. Clear origin → routes disappear, prompt returns
8. Without `GOOGLE_DIRECTIONS_API_KEY` → falls back to mock routes

- [ ] **Step 4: Verify lint**

```bash
pnpm lint
```

Expected: No errors.
