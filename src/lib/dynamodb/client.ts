import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let _client: DynamoDBDocumentClient | null = null;

/**
 * Returns a singleton DynamoDB DocumentClient.
 * Must only be called server-side when DynamoDB is configured.
 */
export function getDynamoDbClient(): DynamoDBDocumentClient {
  if (_client) return _client;

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "DynamoDB client requires AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.",
    );
  }

  const base = new DynamoDBClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  _client = DynamoDBDocumentClient.from(base, {
    marshallOptions: { removeUndefinedValues: true },
  });

  return _client;
}

/** Returns the configured table name. Throws if not set. */
export function getTableName(): string {
  const name = process.env.DYNAMODB_TABLE_NAME;
  if (!name) throw new Error("Missing required environment variable: DYNAMODB_TABLE_NAME");
  return name;
}
