"use client";

declare global {
  interface Window {
    lintrk?: (action: string, payload?: { conversion_id?: number }) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackCta(channel: "calendly" | "project-enquiry") {
  if (typeof window === "undefined") return;
  // Analytics must never break the action it's measuring (e.g. a blocked or broken tracker).
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "cta_click", channel });
    window.lintrk?.("track");
  } catch (error) {
    console.warn("[track] analytics call failed:", error);
  }
}
