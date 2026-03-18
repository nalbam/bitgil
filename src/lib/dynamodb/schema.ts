/**
 * Bitgil Single-Table Design — Key Patterns
 *
 * All domain entities live in one DynamoDB table.
 * Every item has PK (partition key) and SK (sort key).
 *
 * ┌───────────────────────────────────────────────────────────────────────────────┐
 * │ Access Pattern                         │ PK                │ SK              │
 * ├───────────────────────────────────────────────────────────────────────────────┤
 * │ Get school by ID                       │ SCHOOL#{schoolId} │ META            │
 * │ Get area by ID                         │ AREA#{areaId}     │ META            │
 * │ List facilities by area                │ AREA#{areaId}     │ FACILITY#*      │
 * │ List facilities by area + type         │ AREA#{areaId}     │ FACILITY#{type}#│
 * │ List facilities for school             │ SCHOOL#{schoolId} │ FACILITY#*      │
 * │ Get route analysis by ID               │ ANALYSIS#{id}     │ META            │
 * │ List route analyses for school         │ SCHOOL#{schoolId} │ ANALYSIS#*      │
 * └───────────────────────────────────────────────────────────────────────────────┘
 *
 * Duplication note:
 *   Facilities are written to both AREA# and SCHOOL# partitions on creation.
 *   This supports both "list by area" and "list by school" queries without
 *   requiring a scan or GSI. Duplication is intentional and acceptable in
 *   single-table design.
 */

export const TABLE_SCHEMA = {
  /** Table-level attribute names */
  PK: "PK",
  SK: "SK",

  /** GSI names (reserved for future use) */
  GSI: {
    byType: "GSI_TYPE",
  },
} as const;
