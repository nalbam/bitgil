import { cn } from "@/lib/utils/cn";
import type { FacilityType } from "@/lib/maps/types";

interface FacilityBadgeProps {
  type: FacilityType;
  count?: number;
  className?: string;
}

const facilityConfig: Record<FacilityType, { label: string; icon: string; color: string }> = {
  streetlight: { label: "Streetlights", icon: "💡", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  cctv: { label: "CCTV", icon: "📷", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  police: { label: "Police", icon: "🚔", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  crosswalk: { label: "Crosswalks", icon: "🚶", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  danger: { label: "Danger Zones", icon: "⚠️", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export function FacilityBadge({ type, count, className }: FacilityBadgeProps) {
  const { label, icon, color } = facilityConfig[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", color, className)}>
      <span>{icon}</span>
      <span>{label}</span>
      {count !== undefined && <span className="opacity-70">×{count}</span>}
    </span>
  );
}
