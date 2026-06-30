import { describe, it, expect } from "vitest";
import { getReferLink, referLinks } from "../refer";

describe("getReferLink", () => {
  it("finds a configured link by slug", () => {
    const link = getReferLink("repenic");
    expect(link).toBeDefined();
    expect(link?.url).toContain("repenic.com");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(getReferLink("  Repenic ")?.slug).toBe("repenic");
  });

  it("returns undefined for unknown slugs", () => {
    expect(getReferLink("does-not-exist")).toBeUndefined();
  });

  it("treats disabled links as not found", () => {
    const disabled = referLinks.find((l) => l.enabled === false);
    if (disabled) {
      expect(getReferLink(disabled.slug)).toBeUndefined();
    }
  });
});

describe("refer data integrity", () => {
  it("has no duplicate slugs (case-insensitive)", () => {
    const slugs = referLinks.map((l) => l.slug.trim().toLowerCase());
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every configured link has an absolute http(s) url", () => {
    for (const link of referLinks) {
      expect(link.url).toMatch(/^https?:\/\//);
    }
  });
});
