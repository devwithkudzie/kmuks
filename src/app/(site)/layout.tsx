import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

// Shared frame for the public marketing pages.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    // theme-light swaps the colour variables for the public site (see globals.css).
    <div className="theme-light flex min-h-full flex-col bg-canvas text-fog">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
