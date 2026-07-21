import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        isActive: usersTable.isActive,
        isSuspended: usersTable.isSuspended,
      })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    if (!user.isActive || user.isSuspended) {
      res.status(403).json({ success: false, message: "Account suspended or inactive" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "SUPER_ADMIN") {
    res.status(403).json({ success: false, message: "Super admin access required" });
    return;
  }
  next();
}
