function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    "https://kudziemuks.com",
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

  return "https://kudziemuks.com";
}

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
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263779297141").replace(
    /\D/g,
    "",
  ),
  siteUrl: resolveSiteUrl(),
} as const;

export type SocialProfile = {
  platform: string;
  url: string;
};

export type WhatsAppAnswers = {
  name: string;
  businessName: string;
  businessDescription: string;
  onlineProfiles: SocialProfile[];
};

export function whatsappHref(source = "landing-page", answers?: WhatsAppAnswers) {
  if (!answers) {
    return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
      `Hi Kudziemuks — lead from ${source} on kudziemuks.com. I want a Free Customer Growth Review.`,
    )}`;
  }

  const onlineLines = answers.onlineProfiles
    .filter((profile) => profile.url.trim())
    .map((profile) => `${profile.platform}: ${profile.url.trim()}`);

  const text = [
    "Hi Kudziemuks — I want a Free Customer Growth Review.",
    "",
    `1. Name: ${answers.name}`,
    `2. Business: ${answers.businessName}`,
    `3. What we do: ${answers.businessDescription}`,
    `4. Online presence: ${onlineLines.length ? "" : "Not specified"}`,
    ...onlineLines.map((line) => `   - ${line}`),
    "",
    `(from ${source} on kudziemuks.com)`,
  ].join("\n");

  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
