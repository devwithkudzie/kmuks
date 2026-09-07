"use client";

import { trackCta } from "@/lib/track";
import { WhatsAppIcon } from "@/components/icons";
import { site, whatsappHref } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("whatsapp")}
      aria-label="Chat directly on WhatsApp"
      className="wa-pulse fixed right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 inline-flex items-center gap-2 rounded-full bg-wa px-3.5 py-3 font-semibold text-night shadow-lg shadow-black/30 transition hover:scale-[1.03] hover:bg-[#36e076] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden pr-1 text-sm sm:inline">WhatsApp {site.shortName}</span>
    </a>
  );
}
