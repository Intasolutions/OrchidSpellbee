"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/config";

export async function loginAction(username: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return { success: true };
    }
    
    return { success: false, error: data.error || "Incorrect username or password" };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Could not connect to the authentication server." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}
