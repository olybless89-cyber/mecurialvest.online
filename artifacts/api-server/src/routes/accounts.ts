import { Router, Response } from "express";
import { db } from "@workspace/db";
import { accountsTable, transactionsTable } from "@workspace/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { generateAccountNumber, success } from "../lib/helpers.js";

const router = Router();
router.use(authenticate);

// GET /api/accounts — list user's accounts
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await db.select().from(accountsTable)
      .where(eq(accountsTable.userId, req.user!.id))
      .orderBy(desc(accountsTable.createdAt));
    res.json(success(accounts));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch accounts" });
  }
});

// GET /api/accounts/stats — balance stats
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db
      .select({ total: sql<string>`COALESCE(SUM(balance), 0)`, count: count() })
      .from(accountsTable)
      .where(and(eq(accountsTable.userId, req.user!.id), eq(accountsTable.status, "ACTIVE")));
    res.json(success({ totalBalance: row.total, accountCount: row.count }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// GET /api/accounts/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const [account] = await db.select().from(accountsTable)
      .where(and(eq(accountsTable.id, parseInt(req.params["id"]!)), eq(accountsTable.userId, req.user!.id)))
      .limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    res.json(success(account));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch account" });
  }
});

// POST /api/accounts — create account
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { accountType, currency, nickname } = req.body;
    const existing = await db.select({ id: accountsTable.id }).from(accountsTable).where(eq(accountsTable.userId, req.user!.id));
    if (existing.length >= 5) { res.status(400).json({ success: false, message: "Maximum 5 accounts allowed" }); return; }

    const accountNumber = generateAccountNumber();
    const [account] = await db.insert(accountsTable).values({
      userId: req.user!.id,
      accountNumber,
      accountType: accountType || "SAVINGS",
      currency: currency || "USD",
      nickname: nickname || null,
      balance: "0.00",
    }).returning();
    res.status(201).json(success(account, "Account created"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to create account" });
  }
});

// PATCH /api/accounts/:id — update nickname
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { nickname } = req.body;
    const [account] = await db.update(accountsTable)
      .set({ nickname, updatedAt: new Date() })
      .where(and(eq(accountsTable.id, parseInt(req.params["id"]!)), eq(accountsTable.userId, req.user!.id)))
      .returning();
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    res.json(success(account, "Account updated"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to update account" });
  }
});

// POST /api/accounts/:id/freeze
router.post("/:id/freeze", async (req: AuthRequest, res: Response) => {
  try {
    const [account] = await db.update(accountsTable)
      .set({ status: "FROZEN", updatedAt: new Date() })
      .where(and(eq(accountsTable.id, parseInt(req.params["id"]!)), eq(accountsTable.userId, req.user!.id)))
      .returning({ id: accountsTable.id, status: accountsTable.status });
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    res.json(success(account, "Account frozen"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to freeze account" });
  }
});

// POST /api/accounts/:id/unfreeze
router.post("/:id/unfreeze", async (req: AuthRequest, res: Response) => {
  try {
    const [account] = await db.update(accountsTable)
      .set({ status: "ACTIVE", updatedAt: new Date() })
      .where(and(eq(accountsTable.id, parseInt(req.params["id"]!)), eq(accountsTable.userId, req.user!.id)))
      .returning({ id: accountsTable.id, status: accountsTable.status });
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    res.json(success(account, "Account unfrozen"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to unfreeze account" });
  }
});

// GET /api/accounts/:id/transactions
router.get("/:id/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 20;
    const offset = (page - 1) * limit;

    const [acct] = await db.select({ id: accountsTable.id }).from(accountsTable)
      .where(and(eq(accountsTable.id, parseInt(req.params["id"]!)), eq(accountsTable.userId, req.user!.id))).limit(1);
    if (!acct) { res.status(404).json({ success: false, message: "Account not found" }); return; }

    const [txns, [{ total }]] = await Promise.all([
      db.select().from(transactionsTable).where(eq(transactionsTable.accountId, acct.id))
        .orderBy(desc(transactionsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(transactionsTable).where(eq(transactionsTable.accountId, acct.id)),
    ]);

    res.json(success({ items: txns, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

export default router;
