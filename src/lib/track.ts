"use client";

declare global {
  interface Window {
    lintrk?: (action: string, payload?: { conversion_id?: number }) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackCta(channel: "calendly" | "whatsapp") {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "cta_click", channel });
  window.lintrk?.("track");
}
