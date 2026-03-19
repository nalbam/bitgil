/**
 * Environment variable helpers.
 * Client-safe vars use NEXT_PUBLIC_ prefix.
 * Server-only vars must never be exposed to the browser.
 */

// ─── Client-safe (NEXT_PUBLIC_) ─────────────────────────────────────────────

export const clientEnv = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "",
} as const;

// ─── Server-only ─────────────────────────────────────────────────────────────

function requireServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }
  return value;
}

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must only be called on the server side.");
  }
  return {
    awsRegion: requireServerEnv("AWS_REGION"),
    awsAccessKeyId: requireServerEnv("AWS_ACCESS_KEY_ID"),
    awsSecretAccessKey: requireServerEnv("AWS_SECRET_ACCESS_KEY"),
    dynamoDbTableName: requireServerEnv("DYNAMODB_TABLE_NAME"),
  };
}

/**
 * Returns true when all required DynamoDB environment variables are present.
 * Use this to decide between real DB access and mock fallback.
 */
export function isDynamoDbConfigured(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.DYNAMODB_TABLE_NAME,
  );
}
