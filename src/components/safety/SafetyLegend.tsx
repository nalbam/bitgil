import { FacilityBadge } from "@/components/ui/FacilityBadge";
import type { FacilityType } from "@/lib/maps/types";

const FACILITY_TYPES: FacilityType[] = ["streetlight", "cctv", "police", "crosswalk", "danger"];

export function SafetyLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {FACILITY_TYPES.map((type) => (
        <FacilityBadge key={type} type={type} />
      ))}
    </div>
  );
}
