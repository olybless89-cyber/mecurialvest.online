import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, accountsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email.js";
import { generateAccountNumber, generateToken, success } from "../lib/helpers.js";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }
    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = generateToken();

    const [user] = await db.insert(usersTable).values({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || null,
      emailVerifyToken: verifyToken,
    }).returning({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      role: usersTable.role,
    });

    // Create default checking account
    const accountNumber = generateAccountNumber();
    await db.insert(accountsTable).values({
      userId: user.id,
      accountNumber,
      accountType: "CHECKING",
      balance: "0.00",
      currency: "USD",
      isPrimary: true,
    });

    // Send emails (non-blocking)
    sendVerificationEmail(user.email, user.firstName, verifyToken).catch(() => {});
    sendWelcomeEmail(user.email, user.firstName, accountNumber).catch(() => {});

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json(success({ user, accessToken, refreshToken }, "Account created successfully"));
  } catch (err: any) {
    console.error("[REGISTER ERROR]", err?.message, err?.code, err?.stack?.split("\n")[1]);
    res.status(500).json({ success: false, message: "Registration failed", detail: err?.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }
    if (user.isSuspended) {
      res.status(403).json({ success: false, message: "Account suspended. Contact support." });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    await db.update(usersTable).set({
      lastLoginAt: new Date(),
      lastLoginIp: req.ip || null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const { password: _pw, emailVerifyToken: _evk, resetPasswordToken: _rpt, twoFactorSecret: _tfs, ...safeUser } = user;
    res.json(success({ user: safeUser, accessToken, refreshToken }, "Login successful"));
  } catch {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) { res.status(401).json({ success: false, message: "Refresh token required" }); return; }
    const payload = verifyRefreshToken(refreshToken);
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role })
      .from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) { res.status(401).json({ success: false, message: "User not found" }); return; }
    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    res.json(success({ accessToken }));
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db.select({
      id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName,
      email: usersTable.email, phone: usersTable.phone, role: usersTable.role,
      isEmailVerified: usersTable.isEmailVerified, kycStatus: usersTable.kycStatus,
      avatarUrl: usersTable.avatarUrl, address: usersTable.address, city: usersTable.city,
      state: usersTable.state, country: usersTable.country, createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    res.json(success(user));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) { res.status(400).json({ success: false, message: "Token required" }); return; }
    const [user] = await db.select({ id: usersTable.id })
      .from(usersTable).where(eq(usersTable.emailVerifyToken, token)).limit(1);
    if (!user) { res.status(400).json({ success: false, message: "Invalid or expired token" }); return; }
    await db.update(usersTable).set({ isEmailVerified: true, emailVerifyToken: null, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));
    res.json(success(null, "Email verified successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ success: false, message: "Email required" }); return; }
    const [user] = await db.select({ id: usersTable.id, firstName: usersTable.firstName, email: usersTable.email })
      .from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    // Always respond OK to prevent enumeration
    if (user) {
      const token = generateToken();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await db.update(usersTable).set({ resetPasswordToken: token, resetPasswordExpires: expires, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));
      sendPasswordResetEmail(user.email, user.firstName, token).catch(() => {});
    }
    res.json(success(null, "If that email exists, a reset link has been sent"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to process request" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) { res.status(400).json({ success: false, message: "Token and password required" }); return; }
    const [user] = await db.select({ id: usersTable.id, resetPasswordExpires: usersTable.resetPasswordExpires })
      .from(usersTable).where(eq(usersTable.resetPasswordToken, token)).limit(1);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      res.status(400).json({ success: false, message: "Invalid or expired token" }); return;
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ password: hashed, resetPasswordToken: null, resetPasswordExpires: null, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));
    res.json(success(null, "Password reset successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

export default router;
