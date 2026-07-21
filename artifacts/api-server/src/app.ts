import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app: Express = express();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = (process.env["FRONTEND_URL"] || "http://localhost:3000").split(",");
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.trim()))) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Rate limiting
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: "Too many requests, slow down." } }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Logging
app.use(pinoHttp({
  logger,
  serializers: {
    req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
    res(res) { return { statusCode: res.statusCode }; },
  },
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

// 404 + error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
