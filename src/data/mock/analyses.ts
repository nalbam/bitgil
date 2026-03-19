import type { RouteSafetyAnalysis } from "@/lib/maps/types";
import { ROUTES_BY_SCHOOL } from "@/data/mock/routes";
import { MOCK_SCHOOLS } from "@/data/mock/schools";

export const MOCK_ANALYSES: RouteSafetyAnalysis[] = MOCK_SCHOOLS.map((school) => {
  const routes = ROUTES_BY_SCHOOL[school.id] ?? [];
  const recommended = routes.reduce(
    (best, r) => (r.score > (best?.score ?? 0) ? r : best),
    routes[0],
  );
  return {
    schoolId: school.id,
    areaId: school.areaId,
    routes,
    recommendedRouteId: recommended?.id ?? "",
    analyzedAt: new Date().toISOString(),
  };
});

export const MOCK_ANALYSIS = MOCK_ANALYSES[0]!;
