import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbClient, getTableName } from "@/lib/dynamodb/client";
import { pk, sk } from "@/lib/dynamodb/keys";
import type { FacilityByAreaItem, FacilityBySchoolItem } from "@/lib/dynamodb/types";
import {
  fromFacilityByAreaItem,
  fromFacilityBySchoolItem,
} from "@/server/mappers/facility-mapper";
import type { DomainFacility } from "@/domain/entities/facility";
import { isDynamoDbConfigured } from "@/lib/env";
import { MOCK_FACILITIES } from "@/data/mock/facilities";

export async function listFacilitiesByArea(areaId: string): Promise<DomainFacility[]> {
  if (!isDynamoDbConfigured()) {
    return MOCK_FACILITIES;
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk.area(areaId),
        ":prefix": sk.facilityPrefix(),
      },
    }),
  );

  return (result.Items ?? []).map((item) => fromFacilityByAreaItem(item as FacilityByAreaItem));
}

export async function listFacilitiesByTypeInArea(
  areaId: string,
  facilityType: string,
): Promise<DomainFacility[]> {
  if (!isDynamoDbConfigured()) {
    return MOCK_FACILITIES.filter((f) => f.type === facilityType);
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk.area(areaId),
        ":prefix": sk.facilityTypePrefix(facilityType),
      },
    }),
  );

  return (result.Items ?? []).map((item) => fromFacilityByAreaItem(item as FacilityByAreaItem));
}

export async function listFacilitiesForSchool(schoolId: string): Promise<DomainFacility[]> {
  if (!isDynamoDbConfigured()) {
    return MOCK_FACILITIES;
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk.school(schoolId),
        ":prefix": sk.facilityPrefix(),
      },
    }),
  );

  return (result.Items ?? []).map((item) =>
    fromFacilityBySchoolItem(item as FacilityBySchoolItem),
  );
}

export async function getFacilityById(
  areaId: string,
  facilityType: string,
  facilityId: string,
): Promise<DomainFacility | null> {
  if (!isDynamoDbConfigured()) {
    return MOCK_FACILITIES.find((f) => f.id === facilityId) ?? null;
  }

  const client = getDynamoDbClient();
  const result = await client.send(
    new GetCommand({
      TableName: getTableName(),
      Key: {
        PK: pk.area(areaId),
        SK: sk.facility(facilityType, facilityId),
      },
    }),
  );

  if (!result.Item) return null;
  return fromFacilityByAreaItem(result.Item as FacilityByAreaItem);
}
