/**
 * Typed DynamoDB item shapes.
 *
 * These represent the raw structure stored in DynamoDB, not domain entities.
 * Mappers in src/server/mappers/ convert between these and domain types.
 *
 * All items share PK/SK. Additional attributes are entity-specific.
 */

interface BaseItem {
  PK: string;
  SK: string;
  /** ISO timestamp — set on creation */
  createdAt: string;
  /** ISO timestamp — updated on every write */
  updatedAt: string;
}

// ─── School ───────────────────────────────────────────────────────────────────

/** PK=SCHOOL#{id}, SK=META */
export interface SchoolMetaItem extends BaseItem {
  _type: "SCHOOL_META";
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  areaId: string;
}

// ─── Area ─────────────────────────────────────────────────────────────────────

/** PK=AREA#{id}, SK=META */
export interface AreaMetaItem extends BaseItem {
  _type: "AREA_META";
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

// ─── Facility ─────────────────────────────────────────────────────────────────

interface FacilityItemBase extends BaseItem {
  _type: "FACILITY";
  id: string;
  facilityType: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

/** PK=AREA#{areaId}, SK=FACILITY#{type}#{id} */
export interface FacilityByAreaItem extends FacilityItemBase {
  areaId: string;
}

/** PK=SCHOOL#{schoolId}, SK=FACILITY#{type}#{id} */
export interface FacilityBySchoolItem extends FacilityItemBase {
  schoolId: string;
}

// ─── Route Analysis ───────────────────────────────────────────────────────────

/** Compact route summary stored inside a route analysis item */
export interface StoredRouteSummary {
  id: string;
  name: string;
  score: number;
  level: string;
  distanceKm: number;
  estimatedMinutes: number;
  explanation: string;
}

/** PK=ANALYSIS#{id}, SK=META */
export interface RouteAnalysisMetaItem extends BaseItem {
  _type: "ROUTE_ANALYSIS_META";
  id: string;
  schoolId: string;
  areaId: string;
  recommendedRouteId: string;
  analyzedAt: string;
  routes: StoredRouteSummary[];
}

/** PK=SCHOOL#{schoolId}, SK=ANALYSIS#{analysisId} — for listing analyses by school */
export interface RouteAnalysisBySchoolItem extends BaseItem {
  _type: "ROUTE_ANALYSIS_BY_SCHOOL";
  id: string;
  schoolId: string;
  areaId: string;
  recommendedRouteId: string;
  analyzedAt: string;
  routes: StoredRouteSummary[];
}
