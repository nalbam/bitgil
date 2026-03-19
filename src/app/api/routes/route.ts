import { NextResponse } from "next/server";
import { listRouteAnalysesForSchool } from "@/server/repositories/route-analysis-repository";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { ROUTES_BY_SCHOOL } from "@/data/mock/routes";
import { isDynamoDbConfigured } from "@/lib/env";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const schoolId = searchParams.get("schoolId") ?? DEFAULT_SCHOOL.id;

  if (!isDynamoDbConfigured()) {
    const routes = ROUTES_BY_SCHOOL[schoolId] ?? [];
    const recommended = routes.reduce(
      (best, r) => (r.score > (best?.score ?? 0) ? r : best),
      routes[0],
    );
    return NextResponse.json({
      ok: true,
      data: {
        routes,
        recommendedRouteId: recommended?.id ?? null,
        analyzedAt: new Date().toISOString(),
      },
      total: routes.length,
    });
  }

  const analyses = await listRouteAnalysesForSchool(schoolId);
  const latest = analyses[0] ?? null;

  return NextResponse.json({
    ok: true,
    data: latest
      ? {
          routes: latest.routes,
          recommendedRouteId: latest.recommendedRouteId,
          analyzedAt: latest.analyzedAt,
        }
      : null,
    total: latest?.routes.length ?? 0,
  });
}
