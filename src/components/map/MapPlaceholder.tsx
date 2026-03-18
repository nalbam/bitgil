import { cn } from "@/lib/utils/cn";
import { MOCK_FACILITIES } from "@/data/mock/facilities";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { MOCK_ROUTES } from "@/data/mock/routes";
import type { ExtendedFacilityType } from "@/lib/maps/types";

const ROUTE_COLORS: Record<string, string> = {
  "route-safe": "#34d399",
  "route-balanced": "#fbbf24",
  "route-fast": "#f87171",
};

const ROUTE_DASH: Record<string, string> = {
  "route-safe": "none",
  "route-balanced": "none",
  "route-fast": "6,4",
};

const FACILITY_ICONS: Record<ExtendedFacilityType, string> = {
  streetlight: "💡",
  cctv: "📷",
  police: "🚔",
  police_station: "🚔",
  crosswalk: "🚶",
  danger: "⚠️",
  emergency_bell: "🔔",
};

const FACILITY_COLORS: Record<ExtendedFacilityType, string> = {
  streetlight: "#fbbf24",
  cctv: "#818cf8",
  police: "#34d399",
  police_station: "#34d399",
  crosswalk: "#60a5fa",
  danger: "#f87171",
  emergency_bell: "#e879f9",
};

function toSvgCoord(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
): { x: number; y: number } {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - 60) + 30;
  const y = height - 30 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (height - 60);
  return { x, y };
}

const BOUNDS = {
  minLat: 37.5535,
  maxLat: 37.5575,
  minLng: 126.918,
  maxLng: 126.926,
};

const W = 500;
const H = 520;

interface MapPlaceholderProps {
  className?: string;
}

export function MapPlaceholder({ className }: MapPlaceholderProps) {
  const schoolCoord = toSvgCoord(
    DEFAULT_SCHOOL.position.lat,
    DEFAULT_SCHOOL.position.lng,
    BOUNDS,
    W,
    H,
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d1528]",
        className,
      )}
    >
      {/* Grid overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Routes + markers */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Draw routes */}
        {MOCK_ROUTES.map((route) => {
          const pts = route.points
            .map((p) => {
              const c = toSvgCoord(p.position.lat, p.position.lng, BOUNDS, W, H);
              return `${c.x},${c.y}`;
            })
            .join(" ");
          return (
            <polyline
              key={route.id}
              points={pts}
              fill="none"
              stroke={ROUTE_COLORS[route.id] ?? "#64748b"}
              strokeWidth="2.5"
              strokeDasharray={ROUTE_DASH[route.id] ?? "none"}
              opacity="0.7"
            />
          );
        })}

        {/* Draw facilities */}
        {MOCK_FACILITIES.map((f) => {
          const c = toSvgCoord(f.position.lat, f.position.lng, BOUNDS, W, H);
          const color = FACILITY_COLORS[f.type] ?? "#64748b";
          const icon = FACILITY_ICONS[f.type] ?? "•";
          return (
            <g key={f.id} transform={`translate(${c.x}, ${c.y})`}>
              <circle r="7" fill={color} opacity="0.85" />
              <text textAnchor="middle" dy="0.35em" fontSize="9" fill="white">
                {icon}
              </text>
            </g>
          );
        })}

        {/* School marker */}
        <g transform={`translate(${schoolCoord.x}, ${schoolCoord.y})`}>
          <circle r="12" fill="#3b82f6" opacity="0.9" />
          <text textAnchor="middle" dy="0.35em" fontSize="9" fontWeight="bold" fill="white">
            🏫
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#0a0f1e]/80 p-4 backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Routes
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {MOCK_ROUTES.map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <span
                className="inline-block h-0.5 w-6 rounded"
                style={{ backgroundColor: ROUTE_COLORS[r.id] ?? "#64748b" }}
              />
              <span className="text-xs text-slate-300">{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge */}
      <div className="absolute right-4 top-4">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          Map Preview
        </span>
      </div>
    </div>
  );
}


