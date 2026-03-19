# Heatmap Visualization Design

## Overview

Add heatmap visualization for streetlights, CCTV, and danger zones using deck.gl `HeatmapLayer`, with individual layer toggle controls in a floating panel on the map.

## Approach

- **Library:** deck.gl `HeatmapLayer` from `@deck.gl/aggregation-layers`
- **Display:** 3 independent heatmap layers, each toggleable
- **UI:** Floating panel at top-right of map with toggle switches
- **Integration:** Existing `ScatterplotLayer` (point) hidden when corresponding heatmap is ON

## Data Flow

Existing data pipeline unchanged:
1. CSV → API (`/api/facilities?type=streetlight|cctv|danger`) → `CoordPair[]`
2. `CoordPair` (`[lat, lng]`) converted to deck.gl `[lng, lat]` via existing `getCoordPosition`
3. Same data feeds both `ScatterplotLayer` and `HeatmapLayer`

## Heatmap Configuration

Each facility type gets its own heatmap config in `glow-config.ts`:

| Property | Streetlight | CCTV | Danger |
|----------|------------|------|--------|
| Color | `#FFD700` | `#4FC3F7` | `#B71C1C` |
| radiusPixels | 40 | 30 | 50 |
| intensity | 1 | 1 | 1.5 |
| threshold | 0.05 | 0.05 | 0.03 |

## Components

### HeatmapTogglePanel (`src/components/map/HeatmapTogglePanel.tsx`)
- Floating panel positioned top-right over map
- 3 toggle switches with facility color indicators
- Glass-morphism style matching dark map theme
- Props: `layers` state object + `onToggle` callback

### BitgilMap changes (`src/components/map/BitgilMap.tsx`)
- Add `heatmapVisibility` state: `{ streetlight: boolean, cctv: boolean, danger: boolean }`
- Create `HeatmapLayer` instances conditionally based on toggle state
- Hide corresponding `ScatterplotLayer` when heatmap is ON
- Render `HeatmapTogglePanel` inside map container

### Config changes (`src/lib/maps/glow-config.ts`)
- Add `FACILITY_HEATMAP` config object with per-facility heatmap settings

## Dependencies

- Add `@deck.gl/aggregation-layers@^9.2.11` (matches existing deck.gl version)

## Files Changed

1. `package.json` — add dependency
2. `src/lib/maps/glow-config.ts` — add heatmap config
3. `src/components/map/BitgilMap.tsx` — add HeatmapLayer + toggle state
4. `src/components/map/HeatmapTogglePanel.tsx` — new component
