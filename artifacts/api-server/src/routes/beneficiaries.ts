import { Router, Response } from "express";
import { db } from "@workspace/db";
import { beneficiariesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { success } from "../lib/helpers.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(beneficiariesTable)
      .where(eq(beneficiariesTable.userId, req.user!.id));
    res.json(success(rows));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch beneficiaries" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, accountNumber, routingNumber, bankName, email, phone, nickname } = req.body;
    if (!name || !accountNumber || !bankName) {
      res.status(400).json({ success: false, message: "name, accountNumber, bankName required" }); return;
    }
    const [ben] = await db.insert(beneficiariesTable).values({
      userId: req.user!.id, name, accountNumber, routingNumber: routingNumber || null,
      bankName, email: email || null, phone: phone || null, nickname: nickname || null,
    }).returning();
    res.status(201).json(success(ben, "Beneficiary added"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to add beneficiary" });
  }
});

router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { name, bankName, nickname, isFavorite } = req.body;
    const [ben] = await db.update(beneficiariesTable)
      .set({ name, bankName, nickname, isFavorite, updatedAt: new Date() })
      .where(and(eq(beneficiariesTable.id, parseInt(req.params["id"]!)), eq(beneficiariesTable.userId, req.user!.id)))
      .returning();
    if (!ben) { res.status(404).json({ success: false, message: "Beneficiary not found" }); return; }
    res.json(success(ben, "Beneficiary updated"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to update beneficiary" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const [deleted] = await db.delete(beneficiariesTable)
      .where(and(eq(beneficiariesTable.id, parseInt(req.params["id"]!)), eq(beneficiariesTable.userId, req.user!.id)))
      .returning({ id: beneficiariesTable.id });
    if (!deleted) { res.status(404).json({ success: false, message: "Beneficiary not found" }); return; }
    res.json(success(null, "Beneficiary deleted"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete beneficiary" });
  }
});

export default router;
