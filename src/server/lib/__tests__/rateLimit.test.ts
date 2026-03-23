import { createRateLimiter } from "@/server/lib/rateLimit";

describe("rateLimit", () => {
  it("allows up to maxRequests in window", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });

    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(true);

    limiter.destroy();
  });

  it("blocks request maxRequests+1", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });

    limiter.check("ip1");
    limiter.check("ip1");
    limiter.check("ip1");

    const result = limiter.check("ip1");
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeDefined();
    expect(result.retryAfterMs!).toBeGreaterThan(0);

    limiter.destroy();
  });

  it("tracks different keys independently", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 });

    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip2").allowed).toBe(true);

    expect(limiter.check("ip1").allowed).toBe(false);
    expect(limiter.check("ip2").allowed).toBe(false);

    limiter.destroy();
  });

  it("allows requests again after window expires", () => {
    const limiter = createRateLimiter({ windowMs: 100, maxRequests: 1 });

    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(limiter.check("ip1").allowed).toBe(true);
        limiter.destroy();
        resolve();
      }, 150);
    });
  });
});
