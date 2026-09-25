"use client";

import { trackCta } from "@/lib/track";
import { site } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function CtaPair({
  source = "hero",
  align = "start",
}: {
  source?: string;
  align?: "start" | "center";
}) {
  const wrap = align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex w-full flex-col gap-3 sm:flex-row ${wrap}`}>
      <WhatsAppButton
        source={source}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet"
      >
        work with me
      </WhatsAppButton>
      <a
        href={site.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("calendly")}
        className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-medium text-white transition hover:border-white hover:bg-white hover:text-canvas"
      >
        schedule call
      </a>
    </div>
  );
}