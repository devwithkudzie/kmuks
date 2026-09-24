import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

// Every /admin/* route reads the session cookie and must be evaluated
// per-request. Without this, Next.js can prerender a page's cookie-less
// build-time result (e.g. the "not logged in" redirect) as static output
// and keep serving it to every visitor regardless of their real session.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-canvas text-fog">{children}</div>;
}
