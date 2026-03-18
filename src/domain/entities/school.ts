import type { School } from "@/lib/maps/types";

export function createSchool(data: School): School {
  return { ...data };
}
