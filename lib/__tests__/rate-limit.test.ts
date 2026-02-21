import { describe, it, expect, beforeEach, vi } from "vitest";

// Must re-import fresh module for each test to reset the in-memory map
let checkRateLimit: typeof import("../rate-limit").checkRateLimit;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("../rate-limit");
  checkRateLimit = mod.checkRateLimit;
});

describe("checkRateLimit", () => {
  it("allows requests within the limit", () => {
    const result = checkRateLimit("test-user", 3, 60000);

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("decrements remaining count on each request", () => {
    const r1 = checkRateLimit("test-user", 3, 60000);
    const r2 = checkRateLimit("test-user", 3, 60000);
    const r3 = checkRateLimit("test-user", 3, 60000);

    expect(r1.remaining).toBe(2);
    expect(r2.remaining).toBe(1);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding the limit", () => {
    checkRateLimit("test-user", 2, 60000);
    checkRateLimit("test-user", 2, 60000);
    const result = checkRateLimit("test-user", 2, 60000);

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks different identifiers independently", () => {
    checkRateLimit("user-a", 1, 60000);
    const result = checkRateLimit("user-b", 1, 60000);

    expect(result.success).toBe(true);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();

    checkRateLimit("test-user", 1, 60000);
    const blocked = checkRateLimit("test-user", 1, 60000);
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(60001);

    const result = checkRateLimit("test-user", 1, 60000);
    expect(result.success).toBe(true);

    vi.useRealTimers();
  });

  it("returns resetIn in seconds", () => {
    const result = checkRateLimit("test-user", 5, 120000);

    expect(result.resetIn).toBe(120);
  });
});
