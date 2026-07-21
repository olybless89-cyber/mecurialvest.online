import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import accountsRouter from "./accounts.js";
import transactionsRouter from "./transactions.js";
import transfersRouter from "./transfers.js";
import beneficiariesRouter from "./beneficiaries.js";
import notificationsRouter from "./notifications.js";
import profileRouter from "./profile.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/accounts", accountsRouter);
router.use("/transactions", transactionsRouter);
router.use("/transfers", transfersRouter);
router.use("/beneficiaries", beneficiariesRouter);
router.use("/notifications", notificationsRouter);
router.use("/profile", profileRouter);
router.use("/admin", adminRouter);

export default router;
