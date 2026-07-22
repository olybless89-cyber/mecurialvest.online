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

// POST /api/admin/users/:id/reset-pin — clear a user's transaction PIN
router.post("/users/:id/reset-pin", async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params["id"]!);
    await db.update(usersTable).set({ pinHash: null, pinSet: false, updatedAt: new Date() }).where(eq(usersTable.id, userId));
    await db.insert(auditLogsTable).values({
      adminId: req.user!.id, action: "RESET_PIN", entity: "user",
      entityId: String(userId), ipAddress: req.ip || null,
    });
    res.json(success(null, "Transaction PIN reset. User must set a new PIN from their profile."));
  } catch {
    res.status(500).json({ success: false, message: "Failed to reset PIN" });
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

// POST /api/admin/send-payment — admin sends payment to any account, optionally held
router.post("/send-payment", async (req: AuthRequest, res: Response) => {
  try {
    const { accountId, amount, description, hold, holdReason, cotAmount, taxAmount, chargesNote } = req.body;
    if (!accountId || !amount) { res.status(400).json({ success: false, message: "accountId and amount required" }); return; }
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) { res.status(400).json({ success: false, message: "Invalid amount" }); return; }

    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, accountId)).limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }

    const balanceBefore = parseFloat(account.balance);
    // If held, balance does NOT change yet; if not held, credit immediately
    const balanceAfter = hold ? balanceBefore : balanceBefore + fundAmount;
    const txStatus = hold ? "HELD" : "COMPLETED";

    await db.transaction(async (tx) => {
      if (!hold) {
        await tx.update(accountsTable).set({ balance: balanceAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, accountId));
      }
      await tx.insert(transactionsTable).values({
        accountId, userId: account.userId, refNumber: generateRefNumber(),
        type: "ADMIN_CREDIT", amount: fundAmount.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2), balanceAfter: balanceAfter.toFixed(2),
        description: description || (hold ? "Admin payment (held)" : "Admin credit"),
        status: txStatus as never,
        heldBy: hold ? req.user!.id : null,
        holdReason: hold ? (holdReason || null) : null,
        cotAmount: cotAmount ? parseFloat(cotAmount).toFixed(2) : null,
        taxAmount: taxAmount ? parseFloat(taxAmount).toFixed(2) : null,
        chargesNote: chargesNote || null,
        ipAddress: req.ip || null,
      });
      await tx.insert(notificationsTable).values({
        userId: account.userId,
        type: "TRANSACTION",
        title: hold ? "Incoming Payment On Hold" : "Account Credited",
        message: hold
          ? `A payment of $${fundAmount.toFixed(2)} has been credited to your account but is currently on hold.${cotAmount ? ` COT fee: $${parseFloat(cotAmount).toFixed(2)}.` : ''}${taxAmount ? ` Tax: $${parseFloat(taxAmount).toFixed(2)}.` : ''} Contact support for details.`
          : `Your account has been credited with $${fundAmount.toFixed(2)}.`,
      });
      await tx.insert(auditLogsTable).values({
        adminId: req.user!.id, action: hold ? "SEND_PAYMENT_HELD" : "SEND_PAYMENT",
        entity: "account", entityId: String(accountId),
        newValues: JSON.stringify({ amount: fundAmount, hold, cotAmount, taxAmount }),
        ipAddress: req.ip || null,
      });
    });
    res.json(success({ status: txStatus }, hold ? "Payment sent and placed on hold" : "Payment sent successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to send payment" });
  }
});

// POST /api/admin/transactions/:id/hold
router.post("/transactions/:id/hold", async (req: AuthRequest, res: Response) => {
  try {
    const txnId = parseInt(req.params["id"]!);
    const { holdReason } = req.body;
    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txnId)).limit(1);
    if (!txn) { res.status(404).json({ success: false, message: "Transaction not found" }); return; }
    if (txn.status === "HELD") { res.status(400).json({ success: false, message: "Already on hold" }); return; }
    await db.update(transactionsTable).set({ status: "HELD" as never, heldBy: req.user!.id, holdReason: holdReason || null, updatedAt: new Date() }).where(eq(transactionsTable.id, txnId));
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "HOLD_TRANSACTION", entity: "transaction", entityId: String(txnId), ipAddress: req.ip || null });
    res.json(success(null, "Transaction placed on hold"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to hold transaction" });
  }
});

// POST /api/admin/transactions/:id/release
router.post("/transactions/:id/release", async (req: AuthRequest, res: Response) => {
  try {
    const txnId = parseInt(req.params["id"]!);
    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txnId)).limit(1);
    if (!txn) { res.status(404).json({ success: false, message: "Transaction not found" }); return; }
    if (txn.status !== "HELD") { res.status(400).json({ success: false, message: "Transaction is not on hold" }); return; }

    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, txn.accountId)).limit(1);
    if (!account) { res.status(404).json({ success: false, message: "Account not found" }); return; }

    // Credit the held amount to the account balance
    const currentBalance = parseFloat(account.balance);
    const heldAmount = parseFloat(txn.amount);
    const newBalance = currentBalance + heldAmount;

    await db.transaction(async (tx) => {
      await tx.update(accountsTable).set({ balance: newBalance.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, txn.accountId));
      await tx.update(transactionsTable).set({
        status: "COMPLETED" as never,
        releasedBy: req.user!.id,
        releasedAt: new Date(),
        balanceAfter: newBalance.toFixed(2),
        updatedAt: new Date(),
      }).where(eq(transactionsTable.id, txnId));
      await tx.insert(notificationsTable).values({
        userId: txn.userId, type: "TRANSACTION",
        title: "Funds Released",
        message: `Your held payment of $${heldAmount.toFixed(2)} has been released and is now available in your account.`,
      });
      await tx.insert(auditLogsTable).values({ adminId: req.user!.id, action: "RELEASE_TRANSACTION", entity: "transaction", entityId: String(txnId), ipAddress: req.ip || null });
    });
    res.json(success(null, "Transaction released successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to release transaction" });
  }
});

// POST /api/admin/transactions/:id/set-charges — set COT / TAX amounts
router.post("/transactions/:id/set-charges", async (req: AuthRequest, res: Response) => {
  try {
    const txnId = parseInt(req.params["id"]!);
    const { cotAmount, taxAmount, chargesNote, cotPaid, taxPaid } = req.body;
    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txnId)).limit(1);
    if (!txn) { res.status(404).json({ success: false, message: "Transaction not found" }); return; }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (cotAmount !== undefined) updates.cotAmount = cotAmount !== null ? parseFloat(cotAmount).toFixed(2) : null;
    if (taxAmount !== undefined) updates.taxAmount = taxAmount !== null ? parseFloat(taxAmount).toFixed(2) : null;
    if (chargesNote !== undefined) updates.chargesNote = chargesNote || null;
    if (cotPaid !== undefined) updates.cotPaid = !!cotPaid;
    if (taxPaid !== undefined) updates.taxPaid = !!taxPaid;

    await db.update(transactionsTable).set(updates as never).where(eq(transactionsTable.id, txnId));

    // Notify user if charges were set
    if ((cotAmount || taxAmount) && txn.status === "HELD") {
      await db.insert(notificationsTable).values({
        userId: txn.userId, type: "TRANSACTION",
        title: "Charges Required to Release Funds",
        message: `To release your held payment of $${parseFloat(txn.amount).toFixed(2)}, the following charges must be settled:${cotAmount ? ` COT: $${parseFloat(cotAmount).toFixed(2)}` : ''}${taxAmount ? ` Tax: $${parseFloat(taxAmount).toFixed(2)}` : ''}. ${chargesNote || 'Contact support for payment instructions.'}`,
      });
    }
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "SET_CHARGES", entity: "transaction", entityId: String(txnId), newValues: JSON.stringify({ cotAmount, taxAmount }), ipAddress: req.ip || null });
    res.json(success(null, "Charges updated"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to set charges" });
  }
});

// POST /api/admin/accounts/:id/suspend
router.post("/accounts/:id/suspend", async (req: AuthRequest, res: Response) => {
  try {
    const accountId = parseInt(req.params["id"]!);
    await db.update(accountsTable).set({ status: "FROZEN" as never, updatedAt: new Date() }).where(eq(accountsTable.id, accountId));
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "SUSPEND_ACCOUNT", entity: "account", entityId: String(accountId), ipAddress: req.ip || null });
    res.json(success(null, "Account suspended"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to suspend account" });
  }
});

// POST /api/admin/accounts/:id/unsuspend
router.post("/accounts/:id/unsuspend", async (req: AuthRequest, res: Response) => {
  try {
    const accountId = parseInt(req.params["id"]!);
    await db.update(accountsTable).set({ status: "ACTIVE" as never, updatedAt: new Date() }).where(eq(accountsTable.id, accountId));
    await db.insert(auditLogsTable).values({ adminId: req.user!.id, action: "UNSUSPEND_ACCOUNT", entity: "account", entityId: String(accountId), ipAddress: req.ip || null });
    res.json(success(null, "Account unsuspended"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to unsuspend account" });
  }
});

// GET /api/admin/held-transactions
router.get("/held-transactions", async (_req: AuthRequest, res: Response) => {
  try {
    const txns = await db.select().from(transactionsTable).where(eq(transactionsTable.status, "HELD" as never)).orderBy(desc(transactionsTable.createdAt));
    res.json(success(txns));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch held transactions" });
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
