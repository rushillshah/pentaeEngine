interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimiter {
  check(key: string): RateLimitResult;
  /** Stop the background cleanup interval. Call in tests or on shutdown. */
  destroy(): void;
}

export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  const requests = new Map<string, number[]>();

  const cleanupInterval = setInterval(() => {
    const cutoff = Date.now() - config.windowMs;
    for (const [key, timestamps] of requests.entries()) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, valid);
      }
    }
  }, 60_000);

  // Allow the process to exit even if the interval is active
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const cutoff = now - config.windowMs;

      const existing = requests.get(key) || [];
      const valid = existing.filter((t) => t > cutoff);

      if (valid.length >= config.maxRequests) {
        const oldestInWindow = valid[0];
        const retryAfterMs = oldestInWindow + config.windowMs - now;
        return { allowed: false, retryAfterMs };
      }

      valid.push(now);
      requests.set(key, valid);
      return { allowed: true };
    },

    destroy() {
      clearInterval(cleanupInterval);
      requests.clear();
    },
  };
}

export const rateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 5,
});
