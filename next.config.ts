import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // "How I Work" now lives on the About page.
  async redirects() {
    return [
      { source: "/how-i-work", destination: "/about#how-i-work", permanent: true },
      // Projects were renamed to case studies.
      { source: "/projects", destination: "/case-studies", permanent: true },
      { source: "/projects/:slug", destination: "/case-studies/:slug", permanent: true },
      // Case studies renamed when the portfolio was restructured.
      { source: "/case-studies/client-campaign-setup-platform", destination: "/case-studies/victor-holdings-campaign-platform", permanent: true },
      { source: "/case-studies/campaign-lead-capture", destination: "/case-studies/kudziemuks-lead-capture", permanent: true },
    ];
  },
};

export default nextConfig;
