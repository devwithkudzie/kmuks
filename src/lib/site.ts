/** The live site. Used when no site URL is configured, and for the domain shown to visitors. */
export const PRODUCTION_SITE_URL = "https://www.kudziemuks.co.zw";

function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    PRODUCTION_SITE_URL,
  ];

  for (const value of candidates) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    try {
      return new URL(trimmed).origin;
    } catch {
      try {
        return new URL(`https://${trimmed}`).origin;
      } catch {
        continue;
      }
    }
  }

  return PRODUCTION_SITE_URL;
}

export const site = {
  name: "kudziemuks",
  handle: "kudziemuks",
  fullName: "Kudzaishe Prosper Mukungurutse",
  alternateNames: [
    "Kudzie Mukungurutse",
    "Kudzai Mukungurutse",
    "Prosper Mukungurutse",
    "Kudzie",
    "Kudzi",
    "Kudzai",
    "Kudziemuks",
    "Kudzie Muks",
  ],
  title: "Kudziemuks | AI-Powered Software Engineering",
  description:
    "I build AI-powered software and customer acquisition systems to help businesses capture leads, manage prospects and improve conversion processes.",
  linkedinUrl: "https://www.linkedin.com/in/kmuks",
  facebookUrl: "https://www.facebook.com/prospermuks",
  instagramUrl: "https://www.instagram.com/prospermuks/",
  xUrl: "https://x.com/prospermuks",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/kudziemuks/strategy-call",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263779297141").replace(
    /\D/g,
    "",
  ),
  siteUrl: resolveSiteUrl(),
  /** Shown in copy ("Visit kudziemuks.co.zw"); fixed so local previews don't say "localhost". */
  domain: new URL(PRODUCTION_SITE_URL).hostname.replace(/^www\./, ""),
} as const;
