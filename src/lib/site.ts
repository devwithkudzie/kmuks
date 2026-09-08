export const site = {
  name: "kudziemuks",
  handle: "kudziemuks",
  title: "expertise alone isn’t enough. stop relying on word-of-mouth.",
  description:
    "we build lightweight, mobile-optimized content engines and landing pages that turn local expertise into consistent client inquiries.",
  linkedinUrl: "https://www.linkedin.com/in/kmuks",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/kudziemuks/strategy-call",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263771234567").replace(
    /\D/g,
    "",
  ),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kudziemuks.com",
} as const;

export function whatsappHref(source = "landing-page") {
  const text = encodeURIComponent(
    `hi kudziemuks — lead from ${source} on kudziemuks.com. i want a profile audit.`,
  );
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
