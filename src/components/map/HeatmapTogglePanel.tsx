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
