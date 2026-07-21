import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
  const status = (err as { status?: number }).status || 500;
  res.status(status).json({
    success: false,
    message: process.env["NODE_ENV"] === "production" ? "Internal server error" : err.message,
  });
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
}
