// Basit in-memory sliding-window rate limiter.
// Tek serverless instance için yeterli; coldstart/scale-out olunca her instance kendi
// bucket'ını tutar — sıkı koruma değil ama bot/brute-force'u büyük oranda yavaşlatır.
//
// Dağıtık ihtiyaç doğunca Upstash Redis (`@upstash/ratelimit`) ile değiştirilebilir.

type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();

// Periyodik temizlik — bellek sızdırmasın
let lastCleanup = 0;
function maybeCleanup(now: number) {
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, b] of buckets) {
    // 10 dk'dan eski hit'leri tamamen sil
    b.hits = b.hits.filter((t) => now - t < 600_000);
    if (b.hits.length === 0) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetMs: number;
};

/**
 * @param key       Hangi kova — genelde IP veya userId+endpoint
 * @param limit     Pencere içinde izin verilen istek sayısı
 * @param windowMs  Pencere uzunluğu (ms)
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  maybeCleanup(now);

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    return {
      ok: false,
      remaining: 0,
      resetMs: Math.max(0, windowMs - (now - oldest)),
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return {
    ok: true,
    remaining: limit - bucket.hits.length,
    resetMs: windowMs,
  };
}

export function ipFrom(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
