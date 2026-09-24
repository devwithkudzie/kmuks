type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Basic in-memory fixed-window rate limiter. Good enough to blunt casual
 * abuse of a low-traffic client onboarding form on a single server
 * instance — not a substitute for edge/WAF-level protection at scale.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
