import { describe, it, expect } from "vitest";
import {
  REMOTE_IMAGE_PATTERNS,
  REQUIRED_IMAGE_URLS,
  isAllowedImageUrl,
} from "../image-hosts";

describe("isAllowedImageUrl", () => {
  it("allows a host on the list", () => {
    expect(isAllowedImageUrl("https://cdn.fourthwall.com/anything.jpg")).toBe(
      true
    );
  });

  it("rejects a host that isn't on the list", () => {
    expect(isAllowedImageUrl("https://evil.example.com/x.jpg")).toBe(false);
  });

  it("rejects http for an https-only pattern", () => {
    expect(isAllowedImageUrl("http://cdn.fourthwall.com/x.jpg")).toBe(false);
  });

  it("honours a pathname restriction", () => {
    expect(isAllowedImageUrl("https://i.ytimg.com/vi/abc123/hq.jpg")).toBe(
      true
    );
    expect(isAllowedImageUrl("https://i.ytimg.com/other/abc.jpg")).toBe(false);
  });

  it("does not treat a matching host as a substring match", () => {
    expect(isAllowedImageUrl("https://notfourthwall.com/x.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://cdn.fourthwall.com.evil.io/x.jpg")).toBe(
      false
    );
  });

  it("returns false for an unparseable url", () => {
    expect(isAllowedImageUrl("not a url")).toBe(false);
    expect(isAllowedImageUrl("")).toBe(false);
  });
});

/**
 * Regression guard for the Fourthwall CDN migration.
 *
 * When Fourthwall moved product images to imgproxy.fourthwall.dev, next/image
 * rejected every one with `400 "url" parameter is not allowed` and the shop
 * section rendered blank — with no build error and no exception. These assert
 * the hosts each integration depends on stay allowlisted, so removing one
 * fails here rather than silently on the homepage.
 */
describe("required image hosts are allowlisted", () => {
  it.each(REQUIRED_IMAGE_URLS)("$integration", ({ url }) => {
    expect(isAllowedImageUrl(url), `next/image would reject ${url}`).toBe(true);
  });

  it("keeps every pattern https-only", () => {
    for (const p of REMOTE_IMAGE_PATTERNS) {
      expect(p.protocol).toBe("https");
    }
  });
});

/**
 * Live check against the storefront API.
 *
 * This is the only test that catches Fourthwall moving hosts *again*, since
 * the offline guards above can only see hosts we already know about.
 *
 * It needs FOURTHWALL_STOREFRONT_TOKEN and network access, so it skips when
 * either is unavailable — including CI, which doesn't currently hold that
 * secret. Run it locally (or add the secret to CI) to get the coverage.
 */
const token = process.env.FOURTHWALL_STOREFRONT_TOKEN;

describe.skipIf(!token)("Fourthwall product images (live)", () => {
  it("serves every product image from an allowlisted host", async (ctx) => {
    // We're testing our allowlist, not Fourthwall's uptime, so transient
    // failures skip rather than redden the build. Anything that suggests the
    // check itself is broken — a bad token, a moved endpoint — must fail
    // loudly instead, or it quietly stops guarding anything.
    let res: Response;
    try {
      res = await fetch(
        `https://storefront-api.fourthwall.com/v1/collections/all/products?storefront_token=${encodeURIComponent(token!)}`
      );
    } catch (err) {
      // Offline or DNS failure: nothing to learn, and not our bug.
      ctx.skip(
        `Fourthwall API unreachable, skipping: ${err instanceof Error ? err.message : String(err)}`
      );
      return;
    }

    if (res.status === 429 || res.status >= 500) {
      ctx.skip(`Fourthwall API returned ${res.status} (transient), skipping`);
      return;
    }

    expect(
      res.ok,
      `Fourthwall API returned ${res.status}. If that's 401/403 the storefront ` +
        `token is missing, expired or wrong — fix it rather than ignoring this, ` +
        `otherwise the image-host check silently stops running.`
    ).toBe(true);

    const data = await res.json();
    const products = data.results ?? [];
    expect(products.length).toBeGreaterThan(0);

    const urls: string[] = products.flatMap(
      (p: { images?: { url: string }[] }) => (p.images ?? []).map((i) => i.url)
    );
    expect(urls.length).toBeGreaterThan(0);

    const blocked = [...new Set(urls.filter((u) => !isAllowedImageUrl(u)))];
    const blockedHosts = [
      ...new Set(
        blocked.map((u) => {
          try {
            return new URL(u).hostname;
          } catch {
            return u;
          }
        })
      ),
    ];

    expect(
      blockedHosts,
      `Fourthwall is serving images from host(s) missing from REMOTE_IMAGE_PATTERNS in lib/image-hosts.ts. ` +
        `next/image will reject these with 400 and the shop images will render blank. ` +
        `Add: ${blockedHosts.join(", ")}`
    ).toEqual([]);
  }, 20_000);
});
