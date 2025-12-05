/**
 * Simple in-memory rate limiting for serverless functions
 * Note: This resets on cold starts, but provides reasonable protection
 * For production with high traffic, consider using Vercel KV or Upstash Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number = 60 * 60 * 1000 // default 1 hour
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetIn: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxRequests) {
    // Rate limited
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment counter
  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}
