import type { Metadata } from "next";
import { Great_Vibes, Inter, Newsreader } from "next/font/google";
import { GoogleTag } from "@/components/GoogleTag";
import { LinkedInInsight } from "@/components/LinkedInInsight";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const signature = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

const news = Newsreader({
  subsets: ["latin"],
  variable: "--font-news",
  display: "swap",
});

const fallbackSiteUrl = "https://kudziemuks.com";

function absoluteUrl(value: string) {
  try {
    if (!value.trim()) return fallbackSiteUrl;
    return new URL(value).origin;
  } catch {
    try {
      return new URL(`https://${value}`).origin;
    } catch {
      return fallbackSiteUrl;
    }
  }
}

const siteUrl = absoluteUrl(site.siteUrl);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.fullName} (${site.handle}) — marketing that brings you customers`,
    template: `%s · ${site.fullName} (${site.handle})`,
  },
  description: site.description,
  keywords: [
    "Kudzaishe Prosper Mukungurutse",
    "Kudzie Mukungurutse",
    "Kudzai Mukungurutse",
    "Prosper Mukungurutse",
    "Kudziemuks",
    "Kudzie Muks",
    "customer growth review",
    "SME marketing Zimbabwe",
    "whatsapp leads",
  ],
  authors: [{ name: site.fullName, url: site.linkedinUrl }],
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    siteName: site.handle,
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.alternateNames,
  url: siteUrl,
  jobTitle: "Marketing Consultant",
  sameAs: [site.linkedinUrl, site.facebookUrl, site.instagramUrl, site.xUrl],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.handle,
  url: siteUrl,
  description: site.description,
  founder: { "@type": "Person", name: site.fullName },
  areaServed: ["ZW", "ZA", "ZM", "KE", "NG"],
  sameAs: [site.linkedinUrl, site.facebookUrl, site.instagramUrl, site.xUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${signature.variable} ${news.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-canvas">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-purple focus:px-3 focus:py-2 focus:text-white"
        >
          <span aria-hidden>{">"}</span> skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <GoogleTag />
        <LinkedInInsight />
      </body>
    </html>
  );
}
