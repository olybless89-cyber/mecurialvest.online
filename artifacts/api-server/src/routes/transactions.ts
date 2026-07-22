import { Router, Response } from "express";
import { db } from "@workspace/db";
import { transactionsTable, accountsTable } from "@workspace/db/schema";
import { eq, and, desc, count, sql, gte, lte, ilike, or } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { success } from "../lib/helpers.js";

const router = Router();
router.use(authenticate);

// GET /api/transactions
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = Math.min(parseInt(req.query["limit"] as string) || 20, 100);
    const offset = (page - 1) * limit;
    const type = req.query["type"] as string;
    const status = req.query["status"] as string;
    const search = req.query["search"] as string;
    const from = req.query["from"] as string;
    const to = req.query["to"] as string;

    const conditions = [eq(transactionsTable.userId, req.user!.id)];
    if (type) conditions.push(eq(transactionsTable.type, type as never));
    if (status) conditions.push(eq(transactionsTable.status, status as never));
    if (search) conditions.push(or(
      ilike(transactionsTable.description, `%${search}%`),
      ilike(transactionsTable.refNumber, `%${search}%`),
    )!);
    if (from) conditions.push(gte(transactionsTable.createdAt, new Date(from)));
    if (to) conditions.push(lte(transactionsTable.createdAt, new Date(to)));

    const where = and(...conditions);
    const [txns, [{ total }]] = await Promise.all([
      db.select().from(transactionsTable).where(where)
        .orderBy(desc(transactionsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(transactionsTable).where(where),
    ]);

    const t = Number(total);
    res.json(success({ items: txns, pagination: { total: t, page, limit, totalPages: Math.ceil(t / limit) } }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

// GET /api/transactions/summary
router.get("/summary", async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db.select({
      totalIn: sql<string>`COALESCE(SUM(CASE WHEN type IN ('DEPOSIT','TRANSFER_IN','INTEREST') THEN amount ELSE 0 END), 0)`,
      totalOut: sql<string>`COALESCE(SUM(CASE WHEN type IN ('WITHDRAWAL','TRANSFER_OUT','FEE') THEN amount ELSE 0 END), 0)`,
      count: count(),
    }).from(transactionsTable).where(
      and(
        eq(transactionsTable.userId, req.user!.id),
        gte(transactionsTable.createdAt, new Date(new Date().setDate(1))),
      )
    );
    res.json(success({ monthlyIncome: row.totalIn, monthlyExpenses: row.totalOut, transactionCount: Number(row.count) }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch summary" });
  }
});

// GET /api/transactions/trend — last 6 months
router.get("/trend", async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select({
      month: sql<string>`TO_CHAR(created_at, 'Mon')`,
      year: sql<number>`EXTRACT(YEAR FROM created_at)`,
      income: sql<string>`COALESCE(SUM(CASE WHEN type IN ('DEPOSIT','TRANSFER_IN','INTEREST') THEN amount ELSE 0 END), 0)`,
      expenses: sql<string>`COALESCE(SUM(CASE WHEN type IN ('WITHDRAWAL','TRANSFER_OUT','FEE') THEN amount ELSE 0 END), 0)`,
    }).from(transactionsTable)
      .where(and(
        eq(transactionsTable.userId, req.user!.id),
        gte(transactionsTable.createdAt, new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)),
      ))
      .groupBy(sql`TO_CHAR(created_at, 'Mon'), EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)`)
      .orderBy(sql`EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)`);
    res.json(success(rows));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch trend" });
  }
});

// GET /api/transactions/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const [txn] = await db.select().from(transactionsTable)
      .where(and(eq(transactionsTable.id, parseInt(req.params["id"]!)), eq(transactionsTable.userId, req.user!.id)))
      .limit(1);
    if (!txn) { res.status(404).json({ success: false, message: "Transaction not found" }); return; }
    res.json(success(txn));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch transaction" });
  }
});

export default router;
