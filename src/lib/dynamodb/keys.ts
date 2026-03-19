/**
 * Key generation helpers for the Bitgil single-table design.
 *
 * Conventions:
 * - Entity prefixes are UPPER_SNAKE_CASE followed by #
 * - Composite sort keys use # as separator
 * - Prefixes serve as a built-in "type tag" for each item
 */

// ─── Partition Keys ───────────────────────────────────────────────────────────

export const pk = {
  school: (schoolId: string) => `SCHOOL#${schoolId}`,
  area: (areaId: string) => `AREA#${areaId}`,
  analysis: (analysisId: string) => `ANALYSIS#${analysisId}`,
} as const;

// ─── Sort Keys ────────────────────────────────────────────────────────────────

export const sk = {
  meta: () => "META",

  /**
   * Facility sort key — allows range queries on a facility type prefix.
   * e.g. begins_with("FACILITY#streetlight#") to filter by type.
   */
  facility: (facilityType: string, facilityId: string) =>
    `FACILITY#${facilityType}#${facilityId}`,

  /** Prefix for listing all facilities regardless of type */
  facilityPrefix: () => "FACILITY#",

  /** Prefix for listing facilities of a specific type */
  facilityTypePrefix: (facilityType: string) => `FACILITY#${facilityType}#`,

  /**
   * Route analysis sort key under a school partition.
   * Allows listing all analyses for a given school.
   */
  analysis: (analysisId: string) => `ANALYSIS#${analysisId}`,

  /** Prefix for listing all analyses under a school */
  analysisPrefix: () => "ANALYSIS#",
} as const;
