import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { shortLinks, shortLinkRedirects } from "../short-links";
import { siteConfig } from "@/site.config";

describe("short links", () => {
  it("exposes the discord permalink, which is the reason this exists", () => {
    const discord = shortLinks.find((l) => l.slug === "discord");
    expect(discord).toBeDefined();
    expect(discord?.url).toBe(siteConfig.social.discord);
  });

  it("has no duplicate slugs", () => {
    const slugs = shortLinks.map((l) => l.slug.toLowerCase());
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("points every slug at an absolute http(s) url", () => {
    for (const link of shortLinks) {
      expect(link.url, `${link.slug} destination`).toMatch(/^https?:\/\//);
    }
  });

  it("takes destinations from siteConfig.social, not hardcoded copies", () => {
    const configured = Object.values(siteConfig.social) as string[];
    for (const link of shortLinks) {
      expect(
        configured,
        `${link.slug} should reference siteConfig.social so there's one source of truth`
      ).toContain(link.url);
    }
  });
});

describe("short link redirects", () => {
  it("builds one temporary redirect per link", () => {
    const redirects = shortLinkRedirects();
    expect(redirects).toHaveLength(shortLinks.length);
    for (const r of redirects) {
      expect(r.source).toMatch(/^\/[a-z0-9-]+$/);
      // Temporary: destinations change, and browsers cache permanent
      // redirects indefinitely.
      expect(r.permanent, `${r.source} must not be permanent`).toBe(false);
    }
  });
});

/**
 * The failure mode worth guarding against.
 *
 * Next matches redirects before routing, so a slug that collides with a real
 * page silently shadows it — /blog would stop being the blog. Checking the app
 * directory rather than a hardcoded list means new pages are covered
 * automatically, including ones added long after this was written.
 */
describe("short link slugs don't shadow real routes", () => {
  const appDir = join(process.cwd(), "app");

  const routeSegments = readdirSync(appDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    // Route groups (parens) and dynamic segments (brackets) aren't literal paths
    .filter((n) => !n.startsWith("(") && !n.startsWith("[") && n !== "api");

  const publicFiles = existsSync(join(process.cwd(), "public"))
    ? readdirSync(join(process.cwd(), "public"))
    : [];

  it.each(shortLinks)(
    "$slug does not collide with an app route",
    ({ slug }) => {
      expect(
        routeSegments,
        `/${slug} would shadow the app/${slug} route. Rename the short link.`
      ).not.toContain(slug);
    }
  );

  it.each(shortLinks)(
    "$slug does not collide with a public file",
    ({ slug }) => {
      const clashes = publicFiles.filter(
        (f) => f === slug || f.replace(/\.[^.]+$/, "") === slug
      );
      expect(clashes, `/${slug} would shadow public/${clashes[0]}`).toEqual([]);
    }
  );
});
