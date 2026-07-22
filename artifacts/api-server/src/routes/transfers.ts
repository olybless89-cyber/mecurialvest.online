import { Router, Response } from "express";
import { db } from "@workspace/db";
import { accountsTable, transactionsTable, notificationsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { generateRefNumber, success } from "../lib/helpers.js";
import { sendTransactionNotificationEmail } from "../lib/email.js";
import { verifyPin } from "./profile.js";

const router = Router();
router.use(authenticate);

// POST /api/transfers/internal — transfer between own accounts
router.post("/internal", async (req: AuthRequest, res: Response) => {
  try {
    const { fromAccountId, toAccountId, amount, note, pin } = req.body;
    if (!fromAccountId || !toAccountId || !amount) {
      res.status(400).json({ success: false, message: "fromAccountId, toAccountId, and amount required" }); return;
    }
    // PIN check
    const [userPin] = await db.select({ pinSet: usersTable.pinSet }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (userPin?.pinSet) {
      if (!pin) { res.status(400).json({ success: false, message: "Transaction PIN required" }); return; }
      if (!(await verifyPin(req.user!.id, pin))) { res.status(401).json({ success: false, message: "Incorrect transaction PIN" }); return; }
    }
    if (fromAccountId === toAccountId) {
      res.status(400).json({ success: false, message: "Cannot transfer to the same account" }); return;
    }
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      res.status(400).json({ success: false, message: "Invalid amount" }); return;
    }

    const [fromAccount] = await db.select().from(accountsTable)
      .where(and(eq(accountsTable.id, fromAccountId), eq(accountsTable.userId, req.user!.id))).limit(1);
    const [toAccount] = await db.select().from(accountsTable)
      .where(and(eq(accountsTable.id, toAccountId), eq(accountsTable.userId, req.user!.id))).limit(1);

    if (!fromAccount || !toAccount) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    if (fromAccount.status !== "ACTIVE") { res.status(400).json({ success: false, message: "Source account is not active" }); return; }
    if (parseFloat(fromAccount.balance) < transferAmount) {
      res.status(400).json({ success: false, message: "Insufficient balance" }); return;
    }

    const refNumber = generateRefNumber();
    const fromBefore = parseFloat(fromAccount.balance);
    const fromAfter = fromBefore - transferAmount;
    const toBefore = parseFloat(toAccount.balance);
    const toAfter = toBefore + transferAmount;

    await db.transaction(async (tx) => {
      await tx.update(accountsTable).set({ balance: fromAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, fromAccountId));
      await tx.update(accountsTable).set({ balance: toAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, toAccountId));
      await tx.insert(transactionsTable).values([
        {
          accountId: fromAccountId, userId: req.user!.id, refNumber: refNumber + "_OUT",
          type: "TRANSFER_OUT", amount: transferAmount.toFixed(2),
          balanceBefore: fromBefore.toFixed(2), balanceAfter: fromAfter.toFixed(2),
          description: `Transfer to ${toAccount.accountNumber}`, note: note || null,
          status: "COMPLETED", counterpartAccountId: toAccountId,
          counterpartAccountNumber: toAccount.accountNumber, counterpartName: "Own Account",
        },
        {
          accountId: toAccountId, userId: req.user!.id, refNumber: refNumber + "_IN",
          type: "TRANSFER_IN", amount: transferAmount.toFixed(2),
          balanceBefore: toBefore.toFixed(2), balanceAfter: toAfter.toFixed(2),
          description: `Transfer from ${fromAccount.accountNumber}`, note: note || null,
          status: "COMPLETED", counterpartAccountId: fromAccountId,
          counterpartAccountNumber: fromAccount.accountNumber, counterpartName: "Own Account",
        },
      ]);
      await tx.insert(notificationsTable).values({
        userId: req.user!.id, type: "TRANSACTION",
        title: "Internal Transfer Completed",
        message: `$${transferAmount.toFixed(2)} transferred successfully between your accounts.`,
      });
    });

    const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName })
      .from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (user) {
      sendTransactionNotificationEmail(user.email, user.firstName, "TRANSFER_OUT", transferAmount.toFixed(2), fromAfter.toFixed(2), `Transfer to ${toAccount.accountNumber}`).catch(() => {});
    }

    res.json(success({ refNumber }, "Transfer completed successfully"));
  } catch (err) {
    res.status(500).json({ success: false, message: "Transfer failed" });
  }
});

// POST /api/transfers/external — transfer to external account/beneficiary
router.post("/external", async (req: AuthRequest, res: Response) => {
  try {
    const { fromAccountId, recipientName, recipientBank, recipientAccountNumber, routingNumber, amount, note, pin } = req.body;
    if (!fromAccountId || !recipientName || !recipientAccountNumber || !amount) {
      res.status(400).json({ success: false, message: "Missing required fields" }); return;
    }
    // PIN check
    const [userPin] = await db.select({ pinSet: usersTable.pinSet }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (userPin?.pinSet) {
      if (!pin) { res.status(400).json({ success: false, message: "Transaction PIN required" }); return; }
      if (!(await verifyPin(req.user!.id, pin))) { res.status(401).json({ success: false, message: "Incorrect transaction PIN" }); return; }
    }
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      res.status(400).json({ success: false, message: "Invalid amount" }); return;
    }

    const [fromAccount] = await db.select().from(accountsTable)
      .where(and(eq(accountsTable.id, fromAccountId), eq(accountsTable.userId, req.user!.id))).limit(1);
    if (!fromAccount) { res.status(404).json({ success: false, message: "Account not found" }); return; }
    if (fromAccount.status !== "ACTIVE") { res.status(400).json({ success: false, message: "Account is not active" }); return; }
    if (parseFloat(fromAccount.balance) < transferAmount) {
      res.status(400).json({ success: false, message: "Insufficient balance" }); return;
    }

    const refNumber = generateRefNumber();
    const balanceBefore = parseFloat(fromAccount.balance);
    const balanceAfter = balanceBefore - transferAmount;

    await db.transaction(async (tx) => {
      await tx.update(accountsTable).set({ balance: balanceAfter.toFixed(2), updatedAt: new Date() }).where(eq(accountsTable.id, fromAccountId));
      await tx.insert(transactionsTable).values({
        accountId: fromAccountId, userId: req.user!.id, refNumber,
        type: "TRANSFER_OUT", amount: transferAmount.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2), balanceAfter: balanceAfter.toFixed(2),
        currency: fromAccount.currency,
        description: `Wire transfer to ${recipientName} at ${recipientBank || "External Bank"}`,
        note: note || null, status: "COMPLETED",
        counterpartName: recipientName, counterpartBank: recipientBank || null,
        counterpartAccountNumber: recipientAccountNumber, ipAddress: req.ip || null,
      });
      await tx.insert(notificationsTable).values({
        userId: req.user!.id, type: "TRANSACTION",
        title: "Wire Transfer Sent",
        message: `$${transferAmount.toFixed(2)} sent to ${recipientName}.`,
      });
    });

    const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName })
      .from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (user) {
      sendTransactionNotificationEmail(user.email, user.firstName, "TRANSFER_OUT", transferAmount.toFixed(2), balanceAfter.toFixed(2), `Wire transfer to ${recipientName}`).catch(() => {});
    }

    res.json(success({ refNumber }, "Wire transfer submitted successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Transfer failed" });
  }
});

export default router;
