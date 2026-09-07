export const site = {
  name: "Kudzaishe Mukungurutse",
  shortName: "Kudzaishe",
  handle: "kudziemuks",
  role: "B2B Personal Brand Strategist & Software Engineer",
  title: "Expertise Alone Isn’t Enough. Stop Relying on Word-of-Mouth.",
  description:
    "I help independent consultants, developers, and skilled professionals turn raw expertise into a predictable client-acquisition engine.",
  location: "Harare · Southern & Pan-African B2B",
  markets: ["Zimbabwe", "South Africa", "Zambia", "Kenya", "Nigeria"],
  linkedinUrl: "https://www.linkedin.com/in/kmuks",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/kudziemuks/strategy-call",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263771234567").replace(
    /\D/g,
    "",
  ),
  whatsappMessage:
    "Hi Kudzaishe — I want to turn my expertise into a client-acquisition engine. Can we talk?",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kudziemuks.com",
} as const;

export function whatsappHref() {
  const text = encodeURIComponent(site.whatsappMessage);
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
