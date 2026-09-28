import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WhatsAppIntakeProvider } from "@/components/WhatsAppIntake";
import { Logo } from "@/components/Logo";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <WhatsAppIntakeProvider>
      <div className="flex min-h-full flex-col">
        <div className="relative overflow-hidden bg-[#0F0F11]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_38%,rgba(0,0,0,0.35)_100%)]"
          />
          <div className="relative flex items-center justify-center px-5 py-3.5 sm:py-4">
            <Link
              href="/"
              className="inline-flex py-1.5"
            >
              <Logo className="h-7 sm:h-8" preload />
            </Link>
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </WhatsAppIntakeProvider>
  );
}
