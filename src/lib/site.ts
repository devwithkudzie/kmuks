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
  fullName: "Kudzaishe Prosper Mukungurutse",
  alternateNames: [
    "Kudzie Mukungurutse",
    "Kudzai Mukungurutse",
    "Prosper Mukungurutse",
    "Kudzie",
    "Kudzai",
    "Kudziemuks",
    "Kudzie Muks",
  ],
  title:
    "Kudzaishe Prosper Mukungurutse (Kudziemuks) — marketing that brings you customers",
  description:
    "Kudzaishe Prosper Mukungurutse — known as Kudzie or Kudzai — helps SMEs find the right message, create content around it, and turn attention into customers.",
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
    .map((profile) => `• ${profile.platform}: ${profile.url.trim()}`);

  const text = [
    "*New Customer Growth Review Request*",
    "",
    `*Name:* ${answers.name}`,
    `*Business:* ${answers.businessName}`,
    `*What they do:* ${answers.businessDescription}`,
    "",
    "*Online presence:*",
    ...(onlineLines.length ? onlineLines : ["Not specified"]),
    "",
    `_Submitted from ${source} on kudziemuks.com_`,
  ].join("\n");

  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
