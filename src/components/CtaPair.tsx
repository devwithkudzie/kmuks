"use client";

import { trackCta } from "@/lib/track";
import { site, whatsappHref } from "@/lib/site";

export function CtaPair({
  size = "lg",
  align = "start",
  invert = false,
}: {
  size?: "sm" | "lg";
  align?: "start" | "center";
  invert?: boolean;
}) {
  const pad = size === "lg" ? "min-h-14 px-5 text-base" : "min-h-11 px-4 text-sm";
  const wrap =
    align === "center"
      ? "justify-center"
      : "justify-stretch sm:justify-start";

  return (
    <div className={`flex w-full flex-col gap-3 sm:flex-row sm:items-stretch ${wrap}`}>
      <a
        href={site.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("calendly")}
        className={`${pad} inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-gold font-semibold tracking-wide text-night transition hover:bg-[#d4a84a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:flex-none sm:min-w-[240px]`}
      >
        Book a Strategy Call
      </a>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("whatsapp")}
        className={`${pad} inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-wa font-semibold tracking-wide text-night transition hover:bg-[#36e076] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa sm:flex-none sm:min-w-[240px] ${
          invert ? "shadow-[0_0_0_1px_rgba(247,242,232,0.12)]" : ""
        }`}
      >
        Chat Directly on WhatsApp
      </a>
    </div>
  );
}
