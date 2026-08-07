"use server";

import { cookies } from "next/headers";

/**
 * Validates the admin password and writes a secure HTTP-Only cookie.
 */
export async function loginAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true, message: "Authentication successful." };
  }

  return { success: false, message: "Invalid password credentials." };
}

/**
 * Deletes the administrative session cookie to log out.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
