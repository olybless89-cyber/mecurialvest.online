/**
 * Vercel-safe pino logger — no worker threads, no transports.
 * Pino's default (sync-friendly) mode works in serverless environments.
 */
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  // No transport block — avoids worker_threads which crash in Vercel serverless
});
