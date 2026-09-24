"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/admin/password";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/admin/session";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export type LoginState = { error?: string };

function isSafeNextPath(value: FormDataEntryValue | null): value is string {
  return typeof value === "string" && value.startsWith("/admin") && !value.startsWith("//");
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const nextField = formData.get("next");
  const nextPath = isSafeNextPath(nextField) ? nextField : "/admin/client-setup";

  const requestHeaders = await headers();
  const ip = clientIpFrom(requestHeaders);

  if (!checkRateLimit(`admin-login:${ip}`, 8, 10 * 60 * 1000)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Enter the admin password." };
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!storedHash || !sessionSecret) {
    console.error("[admin/login] ADMIN_PASSWORD_HASH or ADMIN_SESSION_SECRET is not configured.");
    return { error: "Admin login isn't configured yet." };
  }

  if (!verifyPassword(password, storedHash)) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken(sessionSecret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect(nextPath);
}

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
