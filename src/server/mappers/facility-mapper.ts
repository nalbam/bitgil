import type { DomainFacility } from "@/domain/entities/facility";
import type { FacilityByAreaItem, FacilityBySchoolItem } from "@/lib/dynamodb/types";
import { pk, sk } from "@/lib/dynamodb/keys";

const now = () => new Date().toISOString();

function facilityBase(
  facility: DomainFacility,
): Omit<FacilityByAreaItem, "PK" | "SK" | "areaId"> {
  const ts = now();
  return {
    _type: "FACILITY",
    id: facility.id,
    facilityType: facility.type,
    name: facility.name,
    lat: facility.position.lat,
    lng: facility.position.lng,
    description: facility.description,
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─── By Area ──────────────────────────────────────────────────────────────────

export function toFacilityByAreaItem(
  facility: DomainFacility,
  areaId: string,
): FacilityByAreaItem {
  return {
    PK: pk.area(areaId),
    SK: sk.facility(facility.type, facility.id),
    areaId,
    ...facilityBase(facility),
  };
}

export function fromFacilityByAreaItem(item: FacilityByAreaItem): DomainFacility {
  return {
    id: item.id,
    type: item.facilityType as DomainFacility["type"],
    name: item.name,
    position: { lat: item.lat, lng: item.lng },
    description: item.description,
  };
}

// ─── By School ────────────────────────────────────────────────────────────────

export function toFacilityBySchoolItem(
  facility: DomainFacility,
  schoolId: string,
): FacilityBySchoolItem {
  return {
    PK: pk.school(schoolId),
    SK: sk.facility(facility.type, facility.id),
    schoolId,
    ...facilityBase(facility),
  };
}

export function fromFacilityBySchoolItem(item: FacilityBySchoolItem): DomainFacility {
  return {
    id: item.id,
    type: item.facilityType as DomainFacility["type"],
    name: item.name,
    position: { lat: item.lat, lng: item.lng },
    description: item.description,
  };
}
