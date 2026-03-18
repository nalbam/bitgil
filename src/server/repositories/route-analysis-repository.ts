import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbClient, getTableName } from "@/lib/dynamodb/client";
import { pk, sk } from "@/lib/dynamodb/keys";
import type { RouteAnalysisMetaItem, RouteAnalysisBySchoolItem } from "@/lib/dynamodb/types";
import {
  toRouteAnalysisMetaItem,
  toRouteAnalysisBySchoolItem,
  fromRouteAnalysisMetaItem,
  fromRouteAnalysisBySchoolItem,
} from "@/server/mappers/route-analysis-mapper";
import type { RouteSafetyAnalysis, RouteSummary } from "@/lib/maps/types";
import { isDynamoDbConfigured } from "@/lib/env";
import { MOCK_ANALYSIS } from "@/data/mock/analyses";

export async function saveRouteAnalysis(
  analysisId: string,
  analysis: RouteSafetyAnalysis,
): Promise<void> {
  if (!isDynamoDbConfigured()) {
    // No-op in mock mode
    return;
  }

  const client = getDynamoDbClient();
  const table = getTableName();

  const metaItem = toRouteAnalysisMetaItem(analysisId, analysis);
  const bySchoolItem = toRouteAnalysisBySchoolItem(analysisId, analysis);

  // Write both items (primary + school index) transactionally via two Puts.
  // A TransactWrite would be ideal for atomicity, but two sequential Puts are
  // acceptable here since this is a write path that doesn't need strict isolation.
  await Promise.all([
    client.send(new PutCommand({ TableName: table, Item: metaItem })),
    client.send(new PutCommand({ TableName: table, Item: bySchoolItem })),
  ]);
}

export async function getRouteAnalysisById(analysisId: string): Promise<{
  id: string;
  schoolId: string;
  areaId: string;
  recommendedRouteId: string;
  analyzedAt: string;
  routes: RouteSummary[];
} | null> {
  if (!isDynamoDbConfigured()) {
    const mock = MOCK_ANALYSIS;
    return {
      id: analysisId,
      schoolId: mock.schoolId,
      areaId: mock.areaId,
      recommendedRouteId: mock.recommendedRouteId,
      analyzedAt: mock.analyzedAt,
      routes: mock.routes.map((r) => ({
        routeId: r.id,
        name: r.name,
        score: r.score,
        level: r.safetyLevel,
        distanceKm: r.distanceKm,
        estimatedMinutes: r.estimatedMinutes,
        explanation: r.explanation,
      })),
    };
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { PK: pk.analysis(analysisId), SK: sk.meta() },
    }),
  );

  if (!result.Item) return null;
  return fromRouteAnalysisMetaItem(result.Item as RouteAnalysisMetaItem);
}

export async function listRouteAnalysesForSchool(schoolId: string): Promise<
  {
    id: string;
    schoolId: string;
    areaId: string;
    recommendedRouteId: string;
    analyzedAt: string;
    routes: RouteSummary[];
  }[]
> {
  if (!isDynamoDbConfigured()) {
    const mock = MOCK_ANALYSIS;
    return [
      {
        id: "mock-analysis-1",
        schoolId: mock.schoolId,
        areaId: mock.areaId,
        recommendedRouteId: mock.recommendedRouteId,
        analyzedAt: mock.analyzedAt,
        routes: mock.routes.map((r) => ({
          routeId: r.id,
          name: r.name,
          score: r.score,
          level: r.safetyLevel,
          distanceKm: r.distanceKm,
          estimatedMinutes: r.estimatedMinutes,
          explanation: r.explanation,
        })),
      },
    ];
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk.school(schoolId),
        ":prefix": sk.analysisPrefix(),
      },
    }),
  );

  return (result.Items ?? []).map((item) =>
    fromRouteAnalysisBySchoolItem(item as RouteAnalysisBySchoolItem),
  );
}
