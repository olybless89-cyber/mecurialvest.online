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

// Supabase requires SSL. For direct connections (:5432) and pooler (:6543)
// rejectUnauthorized:false avoids cert errors on hosted platforms (Render, etc.)
const url = new URL(connectionString);
const sslConfig = url.searchParams.get("sslmode") === "disable"
  ? undefined
  : { rejectUnauthorized: false };

export const pool = new Pool({
  connectionString,
  ssl: sslConfig,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
