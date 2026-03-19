import type { School, Area } from "@/lib/maps/types";
import type { SchoolMetaItem, AreaMetaItem } from "@/lib/dynamodb/types";
import { pk, sk } from "@/lib/dynamodb/keys";

const now = () => new Date().toISOString();

// ─── School ───────────────────────────────────────────────────────────────────

export function toSchoolMetaItem(school: School): SchoolMetaItem {
  const ts = now();
  return {
    PK: pk.school(school.id),
    SK: sk.meta(),
    _type: "SCHOOL_META",
    id: school.id,
    name: school.name,
    address: school.address,
    lat: school.position.lat,
    lng: school.position.lng,
    areaId: school.areaId,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function fromSchoolMetaItem(item: SchoolMetaItem): School {
  return {
    id: item.id,
    name: item.name,
    address: item.address,
    position: { lat: item.lat, lng: item.lng },
    areaId: item.areaId,
  };
}

// ─── Area ─────────────────────────────────────────────────────────────────────

export function toAreaMetaItem(area: Area): AreaMetaItem {
  const ts = now();
  return {
    PK: pk.area(area.id),
    SK: sk.meta(),
    _type: "AREA_META",
    id: area.id,
    name: area.name,
    centerLat: area.center.lat,
    centerLng: area.center.lng,
    radiusKm: area.radiusKm,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function fromAreaMetaItem(item: AreaMetaItem): Area {
  return {
    id: item.id,
    name: item.name,
    center: { lat: item.centerLat, lng: item.centerLng },
    radiusKm: item.radiusKm,
  };
}
