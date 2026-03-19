import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbClient, getTableName } from "@/lib/dynamodb/client";
import { pk, sk } from "@/lib/dynamodb/keys";
import type { SchoolMetaItem, AreaMetaItem } from "@/lib/dynamodb/types";
import { fromSchoolMetaItem, fromAreaMetaItem } from "@/server/mappers/school-mapper";
import type { School, Area } from "@/lib/maps/types";
import { isDynamoDbConfigured } from "@/lib/env";
import { MOCK_SCHOOLS } from "@/data/mock/schools";
import { MOCK_AREAS } from "@/data/mock/areas";

export async function getSchoolById(schoolId: string): Promise<School | null> {
  if (!isDynamoDbConfigured()) {
    return MOCK_SCHOOLS.find((s) => s.id === schoolId) ?? null;
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { PK: pk.school(schoolId), SK: sk.meta() },
    }),
  );

  if (!result.Item) return null;
  return fromSchoolMetaItem(result.Item as SchoolMetaItem);
}

export async function getAreaById(areaId: string): Promise<Area | null> {
  if (!isDynamoDbConfigured()) {
    return MOCK_AREAS.find((a) => a.id === areaId) ?? null;
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { PK: pk.area(areaId), SK: sk.meta() },
    }),
  );

  if (!result.Item) return null;
  return fromAreaMetaItem(result.Item as AreaMetaItem);
}

export async function listSchools(): Promise<School[]> {
  if (!isDynamoDbConfigured()) {
    return MOCK_SCHOOLS;
  }

  // Listing all schools efficiently requires a GSI on _type (reserved for a
  // future step). For now, fall back to mock data even when DB is configured.
  return MOCK_SCHOOLS;
}
