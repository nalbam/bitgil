import type { RouteSafetyAnalysis } from "@/lib/maps/types";
import { MOCK_ROUTES } from "@/data/mock/routes";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { DEFAULT_AREA } from "@/data/mock/areas";

export const MOCK_ANALYSIS: RouteSafetyAnalysis = {
  schoolId: DEFAULT_SCHOOL.id,
  areaId: DEFAULT_AREA.id,
  routes: MOCK_ROUTES,
  recommendedRouteId: "route-safe",
  analyzedAt: new Date().toISOString(),
};
