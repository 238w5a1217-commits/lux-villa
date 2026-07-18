import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "villa-rental-jwt-secret-2025";

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    return null;
  }
}
