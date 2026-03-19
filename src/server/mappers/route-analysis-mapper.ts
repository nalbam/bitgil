import type { RouteSafetyAnalysis, RouteSummary } from "@/lib/maps/types";
import type {
  RouteAnalysisMetaItem,
  RouteAnalysisBySchoolItem,
  StoredRouteSummary,
} from "@/lib/dynamodb/types";
import { pk, sk } from "@/lib/dynamodb/keys";

const now = () => new Date().toISOString();

function toStoredSummaries(analysis: RouteSafetyAnalysis): StoredRouteSummary[] {
  return analysis.routes.map((r) => ({
    id: r.id,
    name: r.name,
    score: r.score,
    level: r.safetyLevel,
    distanceKm: r.distanceKm,
    estimatedMinutes: r.estimatedMinutes,
    explanation: r.explanation,
  }));
}

function storedSummariesToRouteSummaries(stored: StoredRouteSummary[]): RouteSummary[] {
  return stored.map((s) => ({
    routeId: s.id,
    name: s.name,
    score: s.score,
    level: s.level as RouteSummary["level"],
    distanceKm: s.distanceKm,
    estimatedMinutes: s.estimatedMinutes,
    explanation: s.explanation,
  }));
}

// ─── Meta item (primary record) ───────────────────────────────────────────────

export function toRouteAnalysisMetaItem(
  analysisId: string,
  analysis: RouteSafetyAnalysis,
): RouteAnalysisMetaItem {
  const ts = now();
  return {
    PK: pk.analysis(analysisId),
    SK: sk.meta(),
    _type: "ROUTE_ANALYSIS_META",
    id: analysisId,
    schoolId: analysis.schoolId,
    areaId: analysis.areaId,
    recommendedRouteId: analysis.recommendedRouteId,
    analyzedAt: analysis.analyzedAt,
    routes: toStoredSummaries(analysis),
    createdAt: ts,
    updatedAt: ts,
  };
}

export function fromRouteAnalysisMetaItem(item: RouteAnalysisMetaItem): {
  id: string;
  schoolId: string;
  areaId: string;
  recommendedRouteId: string;
  analyzedAt: string;
  routes: RouteSummary[];
} {
  return {
    id: item.id,
    schoolId: item.schoolId,
    areaId: item.areaId,
    recommendedRouteId: item.recommendedRouteId,
    analyzedAt: item.analyzedAt,
    routes: storedSummariesToRouteSummaries(item.routes),
  };
}

// ─── By-school item (for listing analyses per school) ─────────────────────────

export function toRouteAnalysisBySchoolItem(
  analysisId: string,
  analysis: RouteSafetyAnalysis,
): RouteAnalysisBySchoolItem {
  const ts = now();
  return {
    PK: pk.school(analysis.schoolId),
    SK: sk.analysis(analysisId),
    _type: "ROUTE_ANALYSIS_BY_SCHOOL",
    id: analysisId,
    schoolId: analysis.schoolId,
    areaId: analysis.areaId,
    recommendedRouteId: analysis.recommendedRouteId,
    analyzedAt: analysis.analyzedAt,
    routes: toStoredSummaries(analysis),
    createdAt: ts,
    updatedAt: ts,
  };
}

export function fromRouteAnalysisBySchoolItem(item: RouteAnalysisBySchoolItem): {
  id: string;
  schoolId: string;
  areaId: string;
  recommendedRouteId: string;
  analyzedAt: string;
  routes: RouteSummary[];
} {
  return {
    id: item.id,
    schoolId: item.schoolId,
    areaId: item.areaId,
    recommendedRouteId: item.recommendedRouteId,
    analyzedAt: item.analyzedAt,
    routes: storedSummariesToRouteSummaries(item.routes),
  };
}
