"use client";

import { trackCta } from "@/lib/track";
import { whatsappHref } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref("floating-button")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("whatsapp")}
      aria-label="chat on whatsapp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex min-h-12 items-center rounded-lg bg-purple px-5 text-sm font-medium text-white shadow-lg transition hover:bg-violet sm:right-6"
    >
      chat
    </a>
  );
}
