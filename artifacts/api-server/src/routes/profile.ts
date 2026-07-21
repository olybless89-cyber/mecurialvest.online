import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";
import { success } from "../lib/helpers.js";

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
