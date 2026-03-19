import { getAllStreetlights } from "@/lib/api/streetlight-csv";
import { getAllCctv } from "@/lib/api/cctv-csv";
import { getAllDangerZones } from "@/lib/api/danger-zone-csv";
import { SpatialIndex } from "@/lib/geo/spatial-index";
import type { DomainFacility } from "@/domain/entities/facility";

type CoordPair = [number, number];

interface FacilityIndices {
  streetlight: SpatialIndex;
  cctv: SpatialIndex;
  danger: SpatialIndex;
}

let cachedIndices: FacilityIndices | null = null;

function getIndices(): FacilityIndices {
  if (cachedIndices) return cachedIndices;
  cachedIndices = {
    streetlight: new SpatialIndex(getAllStreetlights()),
    cctv: new SpatialIndex(getAllCctv()),
    danger: new SpatialIndex(getAllDangerZones()),
  };
  return cachedIndices;
}

const RADIUS_KM = 0.1;

export function findNearbyFacilities(lat: number, lng: number): DomainFacility[] {
  const indices = getIndices();
  const facilities: DomainFacility[] = [];
  let id = 0;

  const toFacility = (
    coord: CoordPair,
    type: DomainFacility["type"],
    label: string,
  ): DomainFacility => ({
    id: `nearby-${type}-${id++}`,
    type,
    name: label,
    position: { lat: coord[0], lng: coord[1] },
  });

  for (const c of indices.streetlight.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "streetlight", "가로등"));
  }
  for (const c of indices.cctv.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "cctv", "CCTV"));
  }
  for (const c of indices.danger.queryRadius(lat, lng, RADIUS_KM)) {
    facilities.push(toFacility(c, "danger", "위험구간"));
  }

  return facilities;
}

export function countStreetlightsNear(lat: number, lng: number): number {
  return getIndices().streetlight.queryRadius(lat, lng, RADIUS_KM).length;
}
