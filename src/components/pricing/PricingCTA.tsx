"use client";

import { trackCta } from "@/lib/track";
import { site } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function PricingCTA() {
  return (
    <div className="relative mt-24 overflow-hidden rounded-3xl bg-canvas px-6 py-14 text-center text-white sm:px-12 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-purple/30 blur-3xl"
      />
      <h3 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        your expertise already exists. <br className="hidden sm:block" />
        the next step is making it work harder for you.
      </h3>
      <p className="relative mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        choose the level that fits where you are now, or talk to us if you&rsquo;re
        unsure which engagement makes sense.
      </p>
      <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={site.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta("calendly")}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-purple px-6 text-sm font-semibold text-white transition hover:bg-violet"
        >
          find my starting point
        </a>
        <WhatsAppButton
          source="pricing-final-cta"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-canvas"
        >
          talk to kudziemuks
        </WhatsAppButton>
      </div>
    </div>
  );
}
