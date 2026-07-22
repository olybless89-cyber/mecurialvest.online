import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { success } from "../lib/helpers.js";

export async function verifyPin(userId: number, pin: string): Promise<boolean> {
  const [user] = await db.select({ pinHash: usersTable.pinHash, pinSet: usersTable.pinSet })
    .from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user || !user.pinSet || !user.pinHash) return false;
  return bcrypt.compare(pin, user.pinHash);
}

const router = Router();
router.use(authenticate);

// GET /api/profile
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db.select({
      id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName,
      middleName: usersTable.middleName, email: usersTable.email, phone: usersTable.phone,
      dateOfBirth: usersTable.dateOfBirth, address: usersTable.address, city: usersTable.city,
      state: usersTable.state, country: usersTable.country, zipCode: usersTable.zipCode,
      occupation: usersTable.occupation, avatarUrl: usersTable.avatarUrl, role: usersTable.role,
      isEmailVerified: usersTable.isEmailVerified, kycStatus: usersTable.kycStatus,
      twoFactorEnabled: usersTable.twoFactorEnabled, createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.json(success(user));
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// PATCH /api/profile
router.patch("/", async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, middleName, phone, dateOfBirth, address, city, state, country, zipCode, occupation } = req.body;
    const [user] = await db.update(usersTable).set({
      firstName, lastName, middleName: middleName || null, phone: phone || null,
      dateOfBirth: dateOfBirth || null, address: address || null, city: city || null,
      state: state || null, country: country || null, zipCode: zipCode || null,
      occupation: occupation || null, updatedAt: new Date(),
    }).where(eq(usersTable.id, req.user!.id)).returning({
      id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName,
      email: usersTable.email, phone: usersTable.phone, avatarUrl: usersTable.avatarUrl,
    });
    res.json(success(user, "Profile updated"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

// GET /api/profile/pin/status
router.get("/pin/status", async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db.select({ pinSet: usersTable.pinSet }).from(usersTable)
      .where(eq(usersTable.id, req.user!.id)).limit(1);
    res.json(success({ pinSet: user?.pinSet ?? false }));
  } catch {
    res.status(500).json({ success: false, message: "Failed to get PIN status" });
  }
});

// POST /api/profile/pin/set  — set PIN for first time (requires password) or change PIN (requires old PIN)
router.post("/pin/set", async (req: AuthRequest, res: Response) => {
  try {
    const { pin, confirmPin, password, oldPin } = req.body;
    if (!pin || !confirmPin) { res.status(400).json({ success: false, message: "PIN and confirmation required" }); return; }
    if (pin !== confirmPin) { res.status(400).json({ success: false, message: "PINs do not match" }); return; }
    if (!/^\d{4,6}$/.test(pin)) { res.status(400).json({ success: false, message: "PIN must be 4–6 digits" }); return; }

    const [user] = await db.select({ password: usersTable.password, pinHash: usersTable.pinHash, pinSet: usersTable.pinSet })
      .from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }

    if (!user.pinSet) {
      // First time: verify account password
      if (!password) { res.status(400).json({ success: false, message: "Account password required to set PIN" }); return; }
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ success: false, message: "Incorrect password" }); return;
      }
    } else {
      // Change: verify old PIN
      if (!oldPin) { res.status(400).json({ success: false, message: "Current PIN required to change PIN" }); return; }
      if (!user.pinHash || !(await bcrypt.compare(oldPin, user.pinHash))) {
        res.status(401).json({ success: false, message: "Incorrect current PIN" }); return;
      }
    }

    const pinHash = await bcrypt.hash(pin, 10);
    await db.update(usersTable).set({ pinHash, pinSet: true, updatedAt: new Date() }).where(eq(usersTable.id, req.user!.id));
    res.json(success(null, user.pinSet ? "PIN changed successfully" : "PIN set successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to set PIN" });
  }
});

// POST /api/profile/change-password
router.post("/change-password", async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Both passwords required" }); return;
    }
    const [user] = await db.select({ password: usersTable.password }).from(usersTable)
      .where(eq(usersTable.id, req.user!.id)).limit(1);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(401).json({ success: false, message: "Current password is incorrect" }); return;
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ password: hashed, updatedAt: new Date() }).where(eq(usersTable.id, req.user!.id));
    res.json(success(null, "Password changed successfully"));
  } catch {
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
});

export default router;
