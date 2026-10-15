import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // "How I Work" now lives on the About page.
  async redirects() {
    return [{ source: "/how-i-work", destination: "/about#how-i-work", permanent: true }];
  },
};

export default nextConfig;
