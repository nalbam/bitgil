# Google Directions API Safe Route Navigation Design

## Overview

Replace hardcoded mock routes with real walking directions from Google Directions API. Each route is scored for safety based on nearby facilities (streetlights, CCTV, danger zones) using the existing `calculateRouteSafety` service.

## User Flow

1. Select a school (existing flow)
2. Set origin: address search (Google Places Autocomplete) OR map click
3. Server fetches 1-3 walking routes via Google Directions API (origin→school)
4. Each route's waypoints are analyzed for nearby safety facilities
5. Routes scored, sorted by safety, displayed in existing `RouteComparisonPanel`
6. User can swap origin/destination with a toggle button (school→origin for 하교길)

## Data Flow

```
Origin (Places/click) + School coordinates
    ↓
POST /api/routes/directions { origin, destination }
    ↓
Google Directions API (mode=walking, alternatives=true)
    ↓
Decode polyline → coordinate arrays per route
    ↓
For each waypoint: query nearby facilities from CSV data
    ↓
calculateRouteSafety → safety score per route
    ↓
Return RouteOption[] (same shape as existing mock data)
    ↓
Existing RouteComparisonPanel + BitgilMap PathLayer
```

## Components

### 1. Server: Route Directions Service

**File:** `src/server/services/directions-service.ts`

Responsibilities:
- Call Google Directions API with origin/destination coordinates
- Decode polyline strings into coordinate arrays
- For each route, sample waypoints at regular intervals (~50m)
- Query nearby facilities within radius (~100m) of each waypoint
- Run `calculateRouteSafety` to score each route
- Map results to `RouteOption` type

**Google Directions API call:**
```
GET https://maps.googleapis.com/maps/api/directions/json
  ?origin={lat},{lng}
  &destination={lat},{lng}
  &mode=walking
  &alternatives=true
  &key={GOOGLE_DIRECTIONS_API_KEY}
```

**Polyline decoding:** Implement the algorithm directly (~30 lines, no external dependency).

**Route naming:** Based on safety score rank:
- Highest score → "안전 경로"
- Middle → "균형 경로"
- Lowest → "빠른 경로"
- If only 1 route: "추천 경로"

**Explanation generation:** Template-based using safety factors:
- Format: "{주요 도로명} 경유. {긍정 요인}. {부정 요인 있으면 경고}."
- Example: "세마역로 경유. CCTV 12개, 가로등 45개 확인. 위험구간 1곳 주의."
- `summary` field from Google Directions API provides the road name.

**Unlit segment detection:** If 3+ consecutive sampled waypoints (~150m+) have zero streetlights within 100m radius → `hasUnlitSegment = true` → applies -10 penalty.

### 2. Server: API Endpoint

**File:** `src/app/api/routes/directions/route.ts`

```
POST /api/routes/directions
Body: { origin: { lat, lng }, destination: { lat, lng } }
Response: { ok: true, data: { routes: RouteOption[], recommendedRouteId: string } }
```

- Validates input coordinates:
  - lat: -90 to 90, lng: -180 to 180
  - Origin-destination distance ≤ 10km (walking limit)
  - Origin ≠ destination
- Calls directions service
- Returns scored routes sorted by safety (highest first)
- `recommendedRouteId` = highest safety score route

**Error handling:**
- Google API ZERO_RESULTS → `{ ok: false, error: "도보 경로를 찾을 수 없습니다" }`
- Google API key invalid / quota exceeded → `{ ok: false, error: "경로 서비스를 일시적으로 사용할 수 없습니다" }`
- Distance > 10km → `{ ok: false, error: "출발지와 학교 간 거리가 너무 멉니다 (최대 10km)" }`
- Network timeout (5s) → `{ ok: false, error: "경로 조회 시간이 초과되었습니다" }`

**Rate limiting:** Simple in-memory rate limiter — max 30 requests per minute per IP. Also cache responses by origin/destination pair (rounded to ~50m grid) with 5-minute TTL.

### 3. Server: Facility Proximity Query

**File:** `src/server/services/facility-proximity-service.ts`

Responsibilities:
- Load all facility data (streetlights, CCTV, danger zones) from existing CSV loaders
- Cache in memory on first load
- **Spatial indexing:** Build a grid index (0.001° cells ≈ 111m) on first load. For a given coordinate + radius, check only cells within bounding box, then refine with Haversine. This reduces O(N×M) brute force to O(N×k) where k is nearby cells.
- Given a coordinate + radius, return nearby facilities
- Used by directions service to analyze each route waypoint

### 4. Client: Origin Input Component

**File:** `src/components/search/OriginInput.tsx`

Responsibilities:
- Google Places Autocomplete for address/place search
- On select: set origin coordinates, show marker on map
- Clear button to reset origin

### 5. Client: Map Click for Origin

**Changes to:** `src/components/map/BitgilMap.tsx`

- When school is selected and origin is not set: map click sets origin
- Show origin marker (draggable) on map
- Visual hint: "지도를 클릭하여 출발지를 선택하세요"

### 6. Client: Hook Updates

**Changes to:** `src/hooks/useSchoolData.ts`

- Add `origin` state
- When both school and origin are set: call `POST /api/routes/directions`
- When origin is cleared: clear routes
- Fallback: if no origin set, show nothing (prompt user to set origin)
- If `GOOGLE_DIRECTIONS_API_KEY` is not configured, fall back to existing mock routes via `GET /api/routes?schoolId=...`

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `GOOGLE_DIRECTIONS_API_KEY` | Server | API key with Directions API enabled |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client | Existing key, needs Places API enabled |

Note: The existing `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` may already work for Places Autocomplete on the client side. The Directions API call happens server-side and needs a separate (or same) key with Directions API enabled.

## Safety Scoring Integration

Reuse existing `calculateRouteSafety` from `src/domain/services/calculate-route-safety.ts`:

1. For each route, sample waypoints every ~50m along the decoded polyline
2. For each waypoint, find facilities within ~100m radius
3. Build `FacilityInfluence[]` from nearby facilities
4. Pass to `calculateRouteSafety` → get `SafetyScore`
5. Map safety level: safe (≥70), moderate (≥40), caution (<40)

## Existing Code Reused (No Changes)

- `RouteOption` type — route data shape unchanged
- `RouteComparisonPanel` — displays routes as-is
- `BitgilMap` PathLayer — renders route polylines as-is
- `calculateRouteSafety` — scoring algorithm unchanged
- CSV data loaders — facility data source unchanged

## API Cost

- Directions API: $0.005 per request (200 free/month with $200 credit)
- Places Autocomplete: $0.017 per session

## Files Summary

| Action | File |
|--------|------|
| Create | `src/server/services/directions-service.ts` |
| Create | `src/server/services/facility-proximity-service.ts` |
| Create | `src/app/api/routes/directions/route.ts` |
| Create | `src/components/search/OriginInput.tsx` |
| Modify | `src/components/map/BitgilMap.tsx` — origin marker + click handler |
| Modify | `src/hooks/useSchoolData.ts` — origin state + directions API call |
| Modify | `src/app/page.tsx` — wire OriginInput + origin state |
| Modify | `.env.example` — add GOOGLE_DIRECTIONS_API_KEY |
