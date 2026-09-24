import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * Independently verifies the admin session — used inside server
 * components/actions/route handlers so protection never relies solely on
 * `middleware.ts` (defense in depth for sensitive server-side operations).
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret);
}

/** For use at the top of protected server components. */
export async function requireAdminOrRedirect(nextPath: string): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
}
