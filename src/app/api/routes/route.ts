import { NextResponse } from "next/server";
import { listRouteAnalysesForSchool } from "@/server/repositories/route-analysis-repository";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { MOCK_ROUTES } from "@/data/mock/routes";
import { isDynamoDbConfigured } from "@/lib/env";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const schoolId = searchParams.get("schoolId") ?? DEFAULT_SCHOOL.id;

  if (!isDynamoDbConfigured()) {
    // Return full RouteOption objects from mock data for the demo UI
    return NextResponse.json({
      ok: true,
      data: {
        routes: MOCK_ROUTES,
        recommendedRouteId: "route-safe",
        analyzedAt: new Date().toISOString(),
      },
      total: MOCK_ROUTES.length,
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
