import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "SUPABASE_DATABASE_URL (or DATABASE_URL) must be set.",
  );
}

// Supabase requires SSL. rejectUnauthorized:false avoids cert errors on hosted platforms.
let sslConfig: { rejectUnauthorized: boolean } | undefined = { rejectUnauthorized: false };
try {
  const url = new URL(connectionString);
  if (url.searchParams.get("sslmode") === "disable") sslConfig = undefined;
} catch {
  // URL parse failed — keep default SSL config
}

export const pool = new Pool({
  connectionString,
  ssl: sslConfig,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  options: "-c search_path=public",
});
export const db = drizzle(pool, { schema });

export * from "./schema";
