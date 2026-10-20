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

function bookingUrl() {
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  if (calendly) return calendly;
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "263779297141").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent("Hi Kudzie, I'd like to book a call.")}`;
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
  title: "Kudziemuks | Helping Businesses Win More Customers",
  tagline: "Positioning that gets you chosen, systems that close the sale.",
  description:
    "I help businesses win more customers: positioning that gets you chosen, and lead capture, CRM and follow-up systems that turn enquiries into sales.",
  linkedinUrl: "https://www.linkedin.com/in/kmuks",
  facebookUrl: "https://www.facebook.com/prospermuks",
  instagramUrl: "https://www.instagram.com/prospermuks/",
  xUrl: "https://x.com/prospermuks",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
  // An empty env var must not win (that left "Book a call" linking nowhere), so `||`, not `??`.
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || "",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "263779297141").replace(/\D/g, ""),
  siteUrl: resolveSiteUrl(),
  /** "Book a call": Calendly when configured, otherwise a WhatsApp chat. */
  bookingUrl: bookingUrl(),
  /** Shown in copy ("Visit kudziemuks.co.zw"); fixed so local previews don't say "localhost". */
  domain: new URL(PRODUCTION_SITE_URL).hostname.replace(/^www\./, ""),
} as const;
