import type { Metadata } from "next";
import { Great_Vibes, Inter, Newsreader } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.handle} · digital authority for african founders`,
    template: `%s · ${site.handle}`,
  },
  description: site.description,
  keywords: [
    "african founders",
    "landing pages",
    "personal brand",
    "kudziemuks",
    "whatsapp leads",
    "zimbabwe web design",
  ],
  authors: [{ name: site.handle, url: site.linkedinUrl }],
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.siteUrl,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.handle,
  url: site.siteUrl,
  description: site.description,
  areaServed: ["ZW", "ZA", "ZM", "KE", "NG"],
  sameAs: [site.linkedinUrl],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <LinkedInInsight />
      </body>
    </html>
  );
}
