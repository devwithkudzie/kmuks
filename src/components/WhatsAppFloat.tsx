"use client";

import { trackCta } from "@/lib/track";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function WhatsAppFloat() {
  return (
    <WhatsAppButton
      source="floating-button"
      aria-label="chat on whatsapp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex min-h-12 items-center rounded-lg bg-purple px-5 text-sm font-medium text-white shadow-lg transition hover:bg-violet sm:right-6"
    >
      chat
    </WhatsAppButton>
  );
}