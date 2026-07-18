import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getAdminFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
