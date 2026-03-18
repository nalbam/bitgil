import type { Facility, ExtendedFacilityType } from "@/lib/maps/types";

export interface DomainFacility extends Omit<Facility, "type"> {
  type: ExtendedFacilityType;
  name: string;
  description?: string;
}

export function createFacility(data: DomainFacility): DomainFacility {
  return { ...data };
}
