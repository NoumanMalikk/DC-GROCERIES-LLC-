export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function pruneExpired(now: number): void {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-instance demo deployments; use Redis or similar in production.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();

  if (store.size > 10_000) {
    pruneExpired(now);
  }

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  if (existing.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

export function clearAllRateLimits(): void {
  store.clear();
}

export const defaultRateLimits = {
  checkout: { limit: 10, windowMs: 60_000 },
  contact: { limit: 5, windowMs: 60_000 },
  newsletter: { limit: 3, windowMs: 60_000 },
  trackOrder: { limit: 20, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitConfig>;

export function rateLimitCheckout(ip: string): RateLimitResult {
  return rateLimit(`checkout:${ip}`, defaultRateLimits.checkout);
}

export function rateLimitContact(ip: string): RateLimitResult {
  return rateLimit(`contact:${ip}`, defaultRateLimits.contact);
}

export function rateLimitNewsletter(ip: string): RateLimitResult {
  return rateLimit(`newsletter:${ip}`, defaultRateLimits.newsletter);
}

export function rateLimitTrackOrder(ip: string): RateLimitResult {
  return rateLimit(`track-order:${ip}`, defaultRateLimits.trackOrder);
}
