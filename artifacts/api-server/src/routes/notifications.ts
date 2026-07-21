import { Router, Response } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { success } from "../lib/helpers.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(notificationsTable)
      .where(eq(notificationsTable.userId, req.user!.id))
      .orderBy(desc(notificationsTable.createdAt)).limit(50);
    res.json(success(rows));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

router.post("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    await db.update(notificationsTable).set({ isRead: true })
      .where(and(eq(notificationsTable.id, parseInt(req.params["id"]!)), eq(notificationsTable.userId, req.user!.id)));
    res.json(success(null, "Marked as read"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
});

router.post("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    await db.update(notificationsTable).set({ isRead: true })
      .where(eq(notificationsTable.userId, req.user!.id));
    res.json(success(null, "All marked as read"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to update notifications" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await db.delete(notificationsTable)
      .where(and(eq(notificationsTable.id, parseInt(req.params["id"]!)), eq(notificationsTable.userId, req.user!.id)));
    res.json(success(null, "Notification deleted"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
});

export default router;
