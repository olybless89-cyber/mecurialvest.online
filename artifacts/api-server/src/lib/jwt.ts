import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "mercurialvest-secret-change-in-production";
const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] || "7d";
const JWT_REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"] || "mercurialvest-refresh-secret";
const JWT_REFRESH_EXPIRES_IN = "30d";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
