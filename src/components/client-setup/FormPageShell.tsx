import type { ReactNode } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Frame for client-facing form pages: centered logo bar, content, and a small
 * footer linking to the main website. Children decide their own width.
 */
export function FormPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-fog">
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-center px-5">
          <Link href="/" className="font-script text-3xl leading-none text-fog">
            Kudzie Muks
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-5 py-6 text-xs text-mist">
          <Link href="/" className="hover:text-fog">
            {site.handle}.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
