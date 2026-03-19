# Heatmap Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display streetlights, CCTV, and danger zones as heatmap layers on the map, with individual toggle controls in a floating panel.

**Architecture:** Add deck.gl `HeatmapLayer` from `@deck.gl/aggregation-layers` alongside existing `ScatterplotLayer`. A new `HeatmapTogglePanel` component provides per-facility toggle switches. When a heatmap layer is ON, the corresponding `ScatterplotLayer` is hidden.

**Tech Stack:** deck.gl HeatmapLayer, React state, Tailwind CSS

---

### Task 1: Add `@deck.gl/aggregation-layers` dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
pnpm add @deck.gl/aggregation-layers@^9.2.11
```

- [ ] **Step 2: Verify installation**

```bash
pnpm ls @deck.gl/aggregation-layers
```

Expected: Shows `@deck.gl/aggregation-layers 9.x.x`

- [ ] **Step 3: Verify build still works**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

---

### Task 2: Add heatmap configuration to `glow-config.ts`

**Files:**
- Modify: `src/lib/maps/glow-config.ts`

- [ ] **Step 1: Add heatmap config type and data**

Add the `HeatmapStyle` interface and `FACILITY_HEATMAP` config after the existing `FACILITY_GLOW`:

```typescript
export interface HeatmapStyle {
  colorRange: [number, number, number][];
  radiusPixels: number;
  intensity: number;
  threshold: number;
}

type HeatmapFacilityType = "streetlight" | "cctv" | "danger";

export const FACILITY_HEATMAP: Record<HeatmapFacilityType, HeatmapStyle> = {
  streetlight: {
    colorRange: [
      [255, 215, 0, 0],
      [255, 215, 0, 60],
      [255, 215, 0, 120],
      [255, 215, 0, 200],
      [255, 235, 59, 255],
      [255, 255, 150, 255],
    ],
    radiusPixels: 40,
    intensity: 1,
    threshold: 0.05,
  },
  cctv: {
    colorRange: [
      [79, 195, 247, 0],
      [79, 195, 247, 60],
      [79, 195, 247, 120],
      [79, 195, 247, 200],
      [100, 220, 255, 255],
      [180, 240, 255, 255],
    ],
    radiusPixels: 30,
    intensity: 1,
    threshold: 0.05,
  },
  danger: {
    colorRange: [
      [183, 28, 28, 0],
      [183, 28, 28, 60],
      [211, 47, 47, 120],
      [244, 67, 54, 200],
      [255, 82, 82, 255],
      [255, 138, 128, 255],
    ],
    radiusPixels: 50,
    intensity: 1.5,
    threshold: 0.03,
  },
};
```

- [ ] **Step 2: Verify type-check passes**

```bash
pnpm type-check
```

Expected: No errors.

---

### Task 3: Create `HeatmapTogglePanel` component

**Files:**
- Create: `src/components/map/HeatmapTogglePanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { FACILITY_GLOW } from "@/lib/maps/glow-config";

export type HeatmapVisibility = {
  streetlight: boolean;
  cctv: boolean;
  danger: boolean;
};

interface HeatmapTogglePanelProps {
  visibility: HeatmapVisibility;
  onToggle: (layer: keyof HeatmapVisibility) => void;
}

const TOGGLE_ITEMS: { key: keyof HeatmapVisibility; label: string }[] = [
  { key: "streetlight", label: FACILITY_GLOW.streetlight.label },
  { key: "cctv", label: FACILITY_GLOW.cctv.label },
  { key: "danger", label: FACILITY_GLOW.danger.label },
];

export function HeatmapTogglePanel({ visibility, onToggle }: HeatmapTogglePanelProps) {
  return (
    <div className="absolute right-3 top-3 z-10 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-500">
        히트맵
      </div>
      <div className="flex flex-col gap-2">
        {TOGGLE_ITEMS.map(({ key, label }) => {
          const active = visibility[key];
          const color = FACILITY_GLOW[key].color;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              className="flex items-center gap-2 text-sm text-slate-300 transition-opacity hover:opacity-80"
            >
              <span
                className="inline-block h-4 w-8 rounded-full transition-colors"
                style={{
                  background: active ? color : "#444",
                }}
              >
                <span
                  className="block h-3 w-3 translate-y-0.5 rounded-full bg-white transition-transform"
                  style={{
                    transform: active ? "translate(18px, 2px)" : "translate(2px, 2px)",
                  }}
                />
              </span>
              <span className={active ? "text-slate-200" : "text-slate-500"}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

```bash
pnpm type-check
```

Expected: No errors.

---

### Task 4: Integrate HeatmapLayer and toggle into BitgilMap

**Files:**
- Modify: `src/components/map/BitgilMap.tsx`

- [ ] **Step 1: Add imports**

Add at the top of the file:

```typescript
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { FACILITY_HEATMAP } from "@/lib/maps/glow-config";
import { HeatmapTogglePanel, type HeatmapVisibility } from "@/components/map/HeatmapTogglePanel";
```

- [ ] **Step 2: Add heatmap state to `MapContent`**

Inside `MapContent`, after the existing `useState` calls, add:

```typescript
const [heatmapVisibility, setHeatmapVisibility] = useState<HeatmapVisibility>({
  streetlight: false,
  cctv: false,
  danger: false,
});

const handleHeatmapToggle = useCallback((layer: keyof HeatmapVisibility) => {
  setHeatmapVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
}, []);
```

- [ ] **Step 3: Update the `layers` useMemo**

Replace the existing facility layers section to conditionally show ScatterplotLayer OR HeatmapLayer. Inside the `useMemo`, after the color variable declarations and `getCoordPosition`:

```typescript
const result: Layer[] = [];

// Streetlight layers
if (heatmapVisibility.streetlight) {
  const hm = FACILITY_HEATMAP.streetlight;
  result.push(
    new HeatmapLayer({
      id: "streetlights-heatmap",
      data: streetlights,
      getPosition: getCoordPosition,
      getWeight: 1,
      radiusPixels: hm.radiusPixels,
      intensity: hm.intensity,
      threshold: hm.threshold,
      colorRange: hm.colorRange,
      aggregation: "SUM",
    }),
  );
} else {
  result.push(
    new ScatterplotLayer({
      id: "streetlights-glow",
      data: streetlights,
      getPosition: getCoordPosition,
      getFillColor: slGlowColor,
      getRadius: 12,
      radiusMinPixels: 6,
      radiusMaxPixels: 20,
      opacity: 0.6,
      antialiasing: true,
    }),
    new ScatterplotLayer({
      id: "streetlights-core",
      data: streetlights,
      getPosition: getCoordPosition,
      getFillColor: slCoreColor,
      getRadius: 4,
      radiusMinPixels: 1.5,
      radiusMaxPixels: 6,
      opacity: 0.9,
      antialiasing: true,
    }),
  );
}

// CCTV layers
if (heatmapVisibility.cctv) {
  const hm = FACILITY_HEATMAP.cctv;
  result.push(
    new HeatmapLayer({
      id: "cctv-heatmap",
      data: cctv,
      getPosition: getCoordPosition,
      getWeight: 1,
      radiusPixels: hm.radiusPixels,
      intensity: hm.intensity,
      threshold: hm.threshold,
      colorRange: hm.colorRange,
      aggregation: "SUM",
    }),
  );
} else {
  result.push(
    new ScatterplotLayer({
      id: "cctv-glow",
      data: cctv,
      getPosition: getCoordPosition,
      getFillColor: cctvGlowColor,
      getRadius: 12,
      radiusMinPixels: 6,
      radiusMaxPixels: 20,
      opacity: 0.6,
      antialiasing: true,
    }),
    new ScatterplotLayer({
      id: "cctv-core",
      data: cctv,
      getPosition: getCoordPosition,
      getFillColor: cctvCoreColor,
      getRadius: 4,
      radiusMinPixels: 1.5,
      radiusMaxPixels: 6,
      opacity: 0.9,
      antialiasing: true,
    }),
  );
}

// Danger zone layers
if (heatmapVisibility.danger) {
  const hm = FACILITY_HEATMAP.danger;
  result.push(
    new HeatmapLayer({
      id: "danger-zones-heatmap",
      data: dangerZones,
      getPosition: getCoordPosition,
      getWeight: 1,
      radiusPixels: hm.radiusPixels,
      intensity: hm.intensity,
      threshold: hm.threshold,
      colorRange: hm.colorRange,
      aggregation: "SUM",
    }),
  );
} else {
  result.push(
    new ScatterplotLayer({
      id: "danger-zones-glow",
      data: dangerZones,
      getPosition: getCoordPosition,
      getFillColor: dzGlowColor,
      getRadius: 15,
      radiusMinPixels: 7,
      radiusMaxPixels: 22,
      opacity: 0.6,
      antialiasing: true,
    }),
    new ScatterplotLayer({
      id: "danger-zones-core",
      data: dangerZones,
      getPosition: getCoordPosition,
      getFillColor: dzCoreColor,
      getRadius: 5,
      radiusMinPixels: 2.5,
      radiusMaxPixels: 7,
      opacity: 0.9,
      antialiasing: true,
    }),
  );
}
```

Add `heatmapVisibility` to the `useMemo` dependency array:

```typescript
}, [streetlights, cctv, dangerZones, routes, selectedRouteId, onRouteSelect, heatmapVisibility]);
```

- [ ] **Step 4: Add the toggle panel to the JSX**

In `MapContent`'s return JSX, add the panel before `DeckGLOverlay`:

```tsx
return (
  <>
    <HeatmapTogglePanel visibility={heatmapVisibility} onToggle={handleHeatmapToggle} />
    <DeckGLOverlay layers={layers} />
    {/* ...existing markers... */}
  </>
);
```

- [ ] **Step 5: Verify type-check and build**

```bash
pnpm type-check && pnpm build
```

Expected: Both pass with no errors.

---

### Task 5: Verify in dev server

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Manual verification checklist**

Open browser at `http://localhost:3000`:
1. Map loads with existing point layers (ScatterplotLayer)
2. Floating "히트맵" panel visible at top-right
3. Toggle "가로등" ON → yellow heatmap appears, point dots disappear
4. Toggle "CCTV" ON → blue heatmap appears, point dots disappear
5. Toggle "위험구간" ON → red heatmap appears, point dots disappear
6. Toggle each OFF → point dots return
7. Multiple heatmaps can be ON simultaneously
8. Routes and school/police markers unaffected

- [ ] **Step 3: Verify lint passes**

```bash
pnpm lint
```

Expected: No errors.
