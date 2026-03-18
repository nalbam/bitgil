import { cn } from "@/lib/utils/cn";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import type { Route } from "@/lib/maps/types";

interface RouteCardProps {
  route: Route;
  selected?: boolean;
  className?: string;
}

const levelColor: Record<string, string> = {
  safe: "border-emerald-500/30 bg-emerald-500/5",
  moderate: "border-yellow-500/30 bg-yellow-500/5",
  caution: "border-red-500/30 bg-red-500/5",
};

export function RouteCard({ route, selected, className }: RouteCardProps) {
  return (
    <div className={cn("rounded-xl border p-5 transition-all", levelColor[route.safetyLevel], selected && "ring-2 ring-blue-500/50", className)}>
      <div className="mb-3 flex items-start justify-between">
        <h4 className="font-semibold text-white">{route.name}</h4>
        <ScoreBadge score={route.score} level={route.safetyLevel} />
      </div>
      <div className="flex gap-4 text-xs text-slate-400">
        <span>{route.distanceKm.toFixed(1)} km</span>
        <span>~{route.estimatedMinutes} min</span>
      </div>
    </div>
  );
}
