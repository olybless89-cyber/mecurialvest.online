import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";
import { signAccessToken } from "../lib/jwt.js";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Alias for Render health checks
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Diagnostic endpoint — checks DB + JWT
router.get("/diag", async (_req, res) => {
  const result: Record<string, string> = {};

  // DB check
  try {
    await pool.query("SELECT 1");
    result.db = "ok";
  } catch (e: any) {
    result.db = "FAIL: " + e.message;
  }

  // JWT check
  try {
    signAccessToken({ userId: "test", email: "t@t.com", role: "USER" });
    result.jwt = "ok";
  } catch (e: any) {
    result.jwt = "FAIL: " + e.message;
  }

  // Env check
  result.hasDbUrl = process.env.SUPABASE_DATABASE_URL ? "yes" : "NO";
  result.hasJwtSecret = process.env.JWT_SECRET ? "yes" : "NO";
  result.hasJwtRefresh = process.env.JWT_REFRESH_SECRET ? "yes" : "NO";

  const allOk = result.db === "ok" && result.jwt === "ok";
  res.status(allOk ? 200 : 500).json(result);
});

export default router;
