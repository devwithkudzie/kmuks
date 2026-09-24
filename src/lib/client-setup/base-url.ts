export function getSetupBaseUrl() {
  const deployed = process.env.VERCEL === "1";
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    "https://kudziemuks.com",
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    try {
      const url = new URL(value.includes("://") ? value : `https://${value}`);
      if (!["http:", "https:"].includes(url.protocol)) continue;
      const local = url.hostname === "localhost" || url.hostname.endsWith(".localhost") ||
        url.hostname.startsWith("127.") || url.hostname === "[::1]";
      if (deployed && local) continue;
      return url.origin;
    } catch {
      continue;
    }
  }
  return "https://kudziemuks.com";
}
