# Bitgil Functional Page Redesign

**Date:** 2026-03-19
**Status:** Draft

---

## 1. Goal

Transform the current marketing landing page into a functional single-page application where users can search for a school and compare walking route safety scores on an interactive night-themed Google Map.

### Success Criteria

- User can search for a school by name and see autocomplete results
- Selecting a school displays routes on a dark-themed Google Map with 3D tilt
- Safety facilities emit glow effects on the map (matching the "bitgil" / "path of light" brand)
- Route comparison panel shows safety scores with per-factor contribution bars
- Clicking a route card highlights that route on the map
- Works on desktop and mobile (responsive)

---

## 2. Architecture

### Page Structure

Replace 6 marketing sections with 3 functional areas:

```
┌───────────────────────────────────────────────┐
│  Header (logo + tagline)                      │
├───────────────────────────────────────────────┤
│  Search bar (school name autocomplete)        │
├────────────────────────┬──────────────────────┤
│                        │                      │
│   Google Maps          │  Route Comparison    │
│   (dark night theme,   │  Panel               │
│    3D tilt,            │  - Route cards       │
│    facility glow,      │  - Safety score      │
│    route polylines)    │  - Factor breakdown  │
│                        │                      │
├────────────────────────┴──────────────────────┤
│  Footer                                       │
└───────────────────────────────────────────────┘
```

**Responsive behavior:**
- Desktop: map 2/3 width, panel 1/3 width (side by side)
- Mobile: map on top, panel below (vertical stack, scrollable)

### Data Flow

```
User types school name
  → debounced fetch GET /api/schools?q=...
  → autocomplete dropdown
  → user selects school
  → URL updates to /?schoolId=xxx
  → parallel fetch:
      GET /api/routes?schoolId=xxx
      GET /api/facilities?areaId=xxx
  → map centers on school, renders facilities + routes
  → panel displays route cards
  → user clicks route card
  → map highlights selected route, panel shows factor breakdown
```

### State Management

Client-side React state (no external state library):
- `selectedSchoolId: string | null`
- `selectedRouteId: string | null`
- `schools: School[]` (search results)
- `routes: RouteOption[]` (for selected school)
- `facilities: DomainFacility[]` (for selected school's area)

---

## 3. "Bitgil" Night Map (Google Maps)

### Dark Theme

Apply Google Maps JSON styling to create a night atmosphere:
- All map elements darkened (roads, water, land, labels)
- Reduce label density
- Mute all colors except safety-related overlays

### 3D Tilt View

- `tilt: 45` and `heading: 0` for isometric perspective
- Requires **Vector Map** — a `mapId` must be created in Google Cloud Console
- Buildings appear in 3D at zoom level 17+ (enhancing the urban nightscape)
- Map type: `roadmap` with custom styling
- Graceful fallback: if `mapId` is not set, use flat 2D map with dark style

### Facility Glow Effects

Each facility type emits a distinct light on the dark map:

| Facility | Color | Glow Radius | Description |
|----------|-------|-------------|-------------|
| streetlight | Warm yellow `#FFD700` | Large | Broad warm light |
| cctv | Cool blue `#4FC3F7` | Small | Focused surveillance light |
| police_station / police | Bright white `#FFFFFF` | Largest | Bright security presence |
| crosswalk | Soft white `#E0E0E0` | Medium | Pedestrian crossing light |
| emergency_bell | Orange `#FF9800` | Small | Emergency beacon |
| danger | Dark red `#B71C1C` | Medium | Ominous dim red glow |

Both `police` and `police_station` use the same glow config (white, largest radius) since they share the same safety weight.

Implementation: `<AdvancedMarker>` from `@vis.gl/react-google-maps` with custom HTML content using CSS `radial-gradient` and `box-shadow` for glow. Each marker renders as a colored circle with animated glow pulse.

### Route Polylines

- **Safe route (score >= 70):** Bright golden polyline `#FFD700`, thick stroke
- **Moderate route (40-69):** Dim yellow `#FFC107`, medium stroke
- **Caution route (< 40):** Dark gray `#616161`, thin stroke

Glow effect on polylines: render two overlapping polylines — a wider semi-transparent outer line and a narrower opaque inner line — to simulate glow.

Selected route gets full brightness + wider stroke; unselected routes become semi-transparent.

### Interaction

- Click facility marker → InfoWindow with name, type, safety contribution
- Click route on map → select in panel, highlight route
- Map auto-zooms to fit all routes for the selected school

---

## 4. School Search

### New API Endpoint

```
GET /api/schools?q=<query>
→ Response: { ok: true, data: School[], total: number }
```

- Empty query returns all schools (for initial list)
- Filters by name substring match (case-insensitive, Korean)
- Returns id, name, address, coordinates

### Search Component

- Input with debounce (300ms)
- Korean IME compositionend handling
- Dropdown below input showing matching schools
- Each result shows: school name + address
- Click result → select school, close dropdown
- Escape or click outside → close dropdown

---

## 5. Route Comparison Panel

### Route Card (enhanced)

```
┌──────────────────────────────┐
│ 🟢 88  Safest Route          │
│ 1.2 km · 15 min             │
│ CCTV 3 · Streetlight 4      │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
└──────────────────────────────┘
```

- Score badge with color (green/yellow/red)
- Distance and estimated time
- Top facility counts as inline badges
- Selected state: bright border + expanded detail view

### Safety Factor Breakdown (expanded on selection)

Horizontal bar chart showing each factor's point contribution:

```
CCTV (3)          ████████████████████████████████  +30
Streetlight (4)   ████████████████████████████████████████  +32
Crosswalk (2)     ████████  +10
Police Station    ████████████████  +15
Danger Zone       ████████████████████████████  -25  (red bar, left)
────────────────────────────────────────────────
Base Score: 50 → Final: 88 (Safe)
```

- Positive factors: blue/green bars extending right
- Negative factors: red bars extending left
- Base score labeled
- Final score with level badge

---

## 6. Mock Data Expansion

### 5 Schools in Seoul

| ID | Name | Area | District |
|----|------|------|----------|
| school-1 | Mapo High School | Mapo-gu | (existing, keep current ID) |
| school-gangnam | Gangnam Middle School | Gangnam-gu | New |
| school-jongno | Jongno Elementary | Jongno-gu | New |
| school-songpa | Songpa High School | Songpa-gu | New |
| school-yeongdeungpo | Yeongdeungpo Middle School | Yeongdeungpo-gu | New |

Each school has:
- 1 Area with realistic center coordinates and radius (School entity gets an `areaId` field)
- 10-15 facilities with varied types and realistic coordinates
- 2-3 route options with pre-calculated safety scores
- Routes scored using the existing `calculateRouteSafety()` algorithm

### Data Model Additions

- **School** entity: add `areaId: string` field to link school → area
- **Mock data structure**: organize as `Record<schoolId, { school, area, facilities, routes }>` internally, then flatten to arrays for export
- Existing mock files (`schools.ts`, `facilities.ts`, `routes.ts`) are directly replaced with expanded data (no separate `*-expanded.ts` files)

### Data Generation Approach

Write mock data generators that:
1. Define school + area center coordinates
2. Scatter facilities within the area radius
3. Define route waypoints passing through/near facilities
4. Run `calculateRouteSafety()` to produce scores
5. Export as static arrays (same pattern as existing mock data)

---

## 7. File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/app/api/schools/route.ts` | School search API endpoint |
| `src/components/search/SchoolSearch.tsx` | Autocomplete search component |
| `src/components/map/BitgilMap.tsx` | Google Maps with night theme + glow |
| `src/components/map/FacilityGlowMarker.tsx` | Custom glow marker overlay |
| `src/components/map/RoutePolyline.tsx` | Route polyline with glow |
| `src/components/route/SafetyBreakdown.tsx` | Factor contribution bar chart |
| `src/hooks/useSchoolSearch.ts` | Search debounce + fetch hook |
| `src/hooks/useSchoolData.ts` | Fetch routes + facilities for school |
| `src/lib/maps/night-style.ts` | Google Maps dark theme JSON |
| `src/lib/maps/glow-config.ts` | Facility glow colors and sizes |
| `src/data/mock/areas.ts` | Expand with 5 areas (replace existing) |

### Modified Files

| File | Change |
|------|--------|
| `src/app/page.tsx` | Replace marketing sections with search + map + panel layout |
| `src/app/layout.tsx` | Add Google Maps script tag |
| `src/components/route/RouteComparisonPanel.tsx` | Enhance with selection callback + breakdown |
| `src/components/ui/RouteCard.tsx` | Add facility count badges |
| `src/components/ui/ScoreBadge.tsx` | Add glow styling for night theme |
| `src/components/layout/Header.tsx` | Simplify (remove non-functional buttons) |
| `src/data/mock/schools.ts` | Replace with 5 schools (add areaId field) |
| `src/data/mock/facilities.ts` | Replace with facilities for all 5 schools |
| `src/data/mock/routes.ts` | Replace with routes for all 5 schools |
| `src/app/api/routes/route.ts` | Add schoolId-based filtering in mock mode |
| `src/app/api/facilities/route.ts` | Add areaId-based filtering in mock mode |
| `src/domain/entities/school.ts` | Add areaId field to School type |
| `package.json` | Add `@vis.gl/react-google-maps` dependency |

### Removed Files

| File | Reason |
|------|--------|
| `src/features/landing/HeroSection.tsx` | Marketing content replaced |
| `src/features/landing/OverviewSection.tsx` | Marketing content replaced |
| `src/features/landing/SafetyFactorsSection.tsx` | Marketing content replaced |
| `src/features/landing/AiSection.tsx` | "Coming Soon" placeholder removed |
| `src/features/landing/MapPreviewSection.tsx` | Replaced by BitgilMap |
| `src/features/landing/RouteComparisonSection.tsx` | Replaced by inline panel |
| `src/components/map/MapPlaceholder.tsx` | Replaced by BitgilMap |
| `src/components/ui/FeatureCard.tsx` | Only used by removed OverviewSection |
| `src/components/ui/SectionTitle.tsx` | Only used by removed landing sections |

---

## 8. Dependencies

### New

| Package | Purpose |
|---------|---------|
| `@vis.gl/react-google-maps` | React wrapper for Google Maps JavaScript API |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Already in `.env.example` |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Optional | Required for 3D tilt (Vector Map). Falls back to 2D if not set. |

---

## 9. Testing Strategy

Testing framework setup is out of scope for this iteration. Verification is manual:
- Verify safety scores in mock data match `calculateRouteSafety()` output
- Verify `/api/schools`, `/api/routes`, `/api/facilities` return correct filtered data
- Verify map rendering and glow effects in browser
- Verify responsive layout on mobile viewport
- Run `pnpm lint` and `pnpm type-check` to ensure no regressions

---

## 10. Out of Scope

- Authentication / user accounts
- Real DynamoDB data (mock only)
- Google Directions API (routes use pre-defined coordinates)
- Public data API integration
- LLM-powered route explanations
- Push notifications
