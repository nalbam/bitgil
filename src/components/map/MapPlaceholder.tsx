import { cn } from "@/lib/utils/cn";

interface Marker {
  x: number;
  y: number;
  type: "school" | "facility" | "route";
  color?: string;
  label?: string;
}

const MOCK_ROUTES = [
  { id: "safe", label: "Safest Route", color: "#34d399", points: "100,380 140,320 200,260 280,200 350,160 400,140" },
  { id: "moderate", label: "Balanced Route", color: "#fbbf24", points: "100,380 160,340 230,300 300,250 360,200 400,140" },
  { id: "fast", label: "Fastest Route", color: "#f87171", points: "100,380 120,300 170,240 250,190 330,160 400,140" },
];

const MARKERS: Marker[] = [
  { x: 400, y: 140, type: "school", label: "School" },
  { x: 100, y: 380, type: "facility", color: "#60a5fa", label: "Home" },
  { x: 220, y: 270, type: "facility", color: "#fbbf24", label: "💡" },
  { x: 160, y: 310, type: "facility", color: "#818cf8", label: "📷" },
  { x: 300, y: 200, type: "facility", color: "#34d399", label: "🚔" },
  { x: 350, y: 170, type: "facility", color: "#fbbf24", label: "💡" },
];

interface MapPlaceholderProps {
  className?: string;
}

export function MapPlaceholder({ className }: MapPlaceholderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d1528]", className)}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <svg viewBox="0 0 500 520" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {MOCK_ROUTES.map((route) => (
          <polyline key={route.id} points={route.points} fill="none" stroke={route.color} strokeWidth="2.5" strokeDasharray={route.id === "fast" ? "6,4" : "none"} opacity="0.7" />
        ))}
        {MARKERS.map((m, i) => (
          <g key={i} transform={`translate(${m.x}, ${m.y})`}>
            <circle r={m.type === "school" ? 10 : 7} fill={m.type === "school" ? "#3b82f6" : (m.color ?? "#64748b")} opacity="0.9" />
            {m.label && m.label.length <= 2 && (
              <text textAnchor="middle" dy="0.35em" fontSize={m.type === "school" ? "8" : "9"} fill="white">{m.label}</text>
            )}
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#0a0f1e]/80 p-4 backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Routes</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {MOCK_ROUTES.map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 rounded" style={{ backgroundColor: r.color }} />
              <span className="text-xs text-slate-300">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">Map Preview</span>
      </div>
    </div>
  );
}
