import { Router, Response } from "express";
import { db } from "@workspace/db";
import { usersTable, accountsTable, transactionsTable, auditLogsTable, notificationsTable } from "@workspace/db/schema";
import { eq, desc, count, sql, and, ilike, or } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/auth.js";
import { generateRefNumber, success } from "../lib/helpers.js";

const router = Router();
router.use(authenticate, requireAdmin);

// GET /api/admin/stats
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  try {
    const [[users], [accounts], [txns], [totalFunds]] = await Promise.all([
      db.select({ total: count(), active: sql<number>`SUM(CASE WHEN is_active THEN 1 ELSE 0 END)` }).from(usersTable),
      db.select({ total: count() }).from(accountsTable),
      db.select({ total: count() }).from(transactionsTable),
      db.select({ sum: sql<string>`COALESCE(SUM(balance), 0)` }).from(accountsTable),
    ]);
    res.json(success({
      users: { total: Number(users.total), active: String(users.active) },
      accounts: { total: Number(accounts.total) },
      transactions: { total: Number(txns.total) },
      totalFunds: totalFunds.sum,
    }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// GET /api/admin/users
router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = Math.min(parseInt(req.query["limit"] as string) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query["search"] as string;
    const where = search
      ? or(ilike(usersTable.email, `%${search}%`), ilike(usersTable.firstName, `%${search}%`), ilike(usersTable.lastName, `%${search}%`))
      : undefined;

    const [users, [{ total }]] = await Promise.all([
      db.select({
        id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName,
        email: usersTable.email, phone: usersTable.phone, role: usersTable.role,
        isEmailVerified: usersTable.isEmailVerified, isActive: usersTable.isActive,
        isSuspended: usersTable.isSuspended, kycStatus: usersTable.kycStatus,
        createdAt: usersTable.createdAt,
      }).from(usersTable).where(where).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(usersTable).where(where),
    ]);
    const t = Number(total);
    res.json(success({ items: users, pagination: { total: t, page, limit, totalPages: Math.ceil(t / limit) } }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params["id"]!);
    const [[user], accounts] = await Promise.all([
      db.select({ id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName, email: usersTable.email, phone: usersTable.phone, role: usersTable.role, isEmailVerified: usersTable.isEmailVerified, isActive: usersTable.isActive, isSuspended: usersTable.isSuspended, kycStatus: usersTable.kycStatus, createdAt: usersTable.createdAt }).from(usersTable).where(eq(usersTable.id, userId)).limit(1),
      db.select().from(accountsTable).where(eq(accountsTable.userId, userId)),
    ]);
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.json(success({ user, accounts }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// POST /api/admin/users/:id/suspend
router.post("/users/:id/suspend", async (req: AuthRequest, res: Response) => {
  try {
    await db.update(usersTable).set({ isSuspended: true, updatedAt: new Date() }).where(eq(usersTable.id, parseInt(req.params["id"]!)));
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "SUSPEND_USER", entity: "user", entityId: req.params["id"]!, ipAddress: req.ip || null });
    res.json(success(null, "User suspended"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to suspend user" });
  }
});

// POST /api/admin/users/:id/unsuspend
router.post("/users/:id/unsuspend", async (req: AuthRequest, res: Response) => {
  try {
    await db.update(usersTable).set({ isSuspended: false, updatedAt: new Date() }).where(eq(usersTable.id, parseInt(req.params["id"]!)));
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "UNSUSPEND_USER", entity: "user", entityId: req.params["id"]!, ipAddress: req.ip || null });
    res.json(success(null, "User unsuspended"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to unsuspend user" });
  }
});

// POST /api/admin/fund-account — credit an account
router.post("/fund-account", async (req: AuthRequest, res: Response) => {
  try {
    const { accountId, amount, description } = req.body;
    if (!accountId || !amount) { res.status(400).json({ success: false, message: "accountId and amount required" }); return; }
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) { res.status(400).json({ success: false, message: "Invalid amount" }); return; }

    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, accountId)).limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }

    const balanceBefore = parseFloat(account.balance);
    const balanceAfter = balanceBefore + fundAmount;

    await db.transaction(async (tx) => {
      await tx.update(accountsTable).set({ balance: balanceAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, accountId));
      await tx.insert(transactionsTable).values({
        accountId, userId: account.userId, refNumber: generateRefNumber(),
        type: "DEPOSIT", amount: fundAmount.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2), balanceAfter: balanceAfter.toFixed(2),
        description: description || "Admin credit", status: "COMPLETED", ipAddress: req.ip || null,
      });
      await tx.insert(notificationsTable).values({
        userId: account.userId, type: "TRANSACTION",
        title: "Account Credited",
        message: `Your account has been credited with $${fundAmount.toFixed(2)}.`,
      });
      await tx.insert(auditLogsTable).values({
        adminId: req.user!.id, action: "FUND_ACCOUNT", entity: "account",
        entityId: String(accountId), newValues: JSON.stringify({ amount: fundAmount }), ipAddress: req.ip || null,
      });
    });
    res.json(success({ newBalance: balanceAfter.toFixed(2) }, "Account funded successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fund account" });
  }
});

// POST /api/admin/debit-account
router.post("/debit-account", async (req: AuthRequest, res: Response) => {
  try {
    const { accountId, amount, description } = req.body;
    const debitAmount = parseFloat(amount);
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, accountId)).limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    if (parseFloat(account.balance) < debitAmount) { res.status(400).json({ success: false, message: "Insufficient balance" }); return; }

    const balanceBefore = parseFloat(account.balance);
    const balanceAfter = balanceBefore - debitAmount;

    await db.transaction(async (tx) => {
      await tx.update(accountsTable).set({ balance: balanceAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, accountId));
      await tx.insert(transactionsTable).values({
        accountId, userId: account.userId, refNumber: generateRefNumber(),
        type: "WITHDRAWAL", amount: debitAmount.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2), balanceAfter: balanceAfter.toFixed(2),
        description: description || "Admin debit", status: "COMPLETED", ipAddress: req.ip || null,
      });
    });
    res.json(success({ newBalance: balanceAfter.toFixed(2) }, "Account debited successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to debit account" });
  }
});

// GET /api/admin/transactions
router.get("/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = Math.min(parseInt(req.query["limit"] as string) || 20, 100);
    const offset = (page - 1) * limit;
    const [txns, [{ total }]] = await Promise.all([
      db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(transactionsTable),
    ]);
    const t = Number(total);
    res.json(success({ items: txns, pagination: { total: t, page, limit, totalPages: Math.ceil(t / limit) } }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

// POST /api/admin/transactions/:id/reverse
router.post("/transactions/:id/reverse", async (req: AuthRequest, res: Response) => {
  try {
    const txnId = parseInt(req.params["id"]!);
    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txnId)).limit(1);
    if (!txn) { res.status(404).json({ success: false, message: "Transaction not found" }); return; }
    if (txn.status !== "COMPLETED") { res.status(400).json({ success: false, message: "Only completed transactions can be reversed" }); return; }

    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, txn.accountId)).limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }

    const currentBalance = parseFloat(account.balance);
    const txnAmount = parseFloat(txn.amount);
    // Reverse: if it was a debit, credit back; if credit, debit back
    const isDebit = ["WITHDRAWAL","TRANSFER_OUT","FEE"].includes(txn.type);
    const newBalance = isDebit ? currentBalance + txnAmount : currentBalance - txnAmount;

    await db.transaction(async (tx) => {
      await tx.update(transactionsTable).set({ status: "REVERSED", reversedAt: new Date(), reversedBy: req.user!.id, updatedAt: new Date() }).where(eq(transactionsTable.id, txnId));
      await tx.update(accountsTable).set({ balance: newBalance.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, account.id));
      await tx.insert(transactionsTable).values({
        accountId: txn.accountId, userId: txn.userId, refNumber: generateRefNumber(),
        type: "REVERSAL", amount: txnAmount.toFixed(2),
        balanceBefore: currentBalance.toFixed(2), balanceAfter: newBalance.toFixed(2),
        description: `Reversal of ${txn.refNumber}`, status: "COMPLETED",
      });
      await tx.insert(auditLogsTable).values({ adminId: req.user!.id, action: "REVERSE_TRANSACTION", entity: "transaction", entityId: String(txnId), ipAddress: req.ip || null });
    });
    res.json(success(null, "Transaction reversed"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to reverse transaction" });
  }
});

// GET /api/admin/audit-logs
router.get("/audit-logs", async (_req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(_req.query["page"] as string) || 1;
    const limit = Math.min(parseInt(_req.query["limit"] as string) || 20, 100);
    const offset = (page - 1) * limit;
    const [logs, [{ total }]] = await Promise.all([
      db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(auditLogsTable),
    ]);
    const t = Number(total);
    res.json(success({ items: logs, pagination: { total: t, page, limit, totalPages: Math.ceil(t / limit) } }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
});

export default router;
