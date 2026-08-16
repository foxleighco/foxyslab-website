import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Checks the generated sitemap against the content it claims to describe.
 *
 * This exists because the generator got it wrong twice while being written:
 * first it missed every resource page (they are flat `.md` files, not
 * directories like blog posts), then it advertised two disabled partners whose
 * URLs resolve to a not-found page. Neither failure is visible without
 * comparing the output to the source of truth, which is what this does.
 *
 * It asserts the committed artefact rather than running the generator, so it
 * also catches the case where someone edits `public/sitemap.xml` by hand and
 * their change is silently overwritten on the next build.
 */

const ROOT = join(__dirname, "..", "..");
const SITEMAP = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");

const locs = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = locs.map(
  (url) => url.replace("https://www.foxyslab.com", "") || "/"
);

interface Partner {
  slug: string;
  enabled?: boolean;
}

const partners: Partner[] = JSON.parse(
  readFileSync(join(ROOT, "data", "partners.json"), "utf8")
);

describe("sitemap", () => {
  it("lists every enabled partner", () => {
    for (const partner of partners.filter((p) => p.enabled !== false)) {
      expect(paths).toContain(`/partners/${partner.slug}`);
    }
  });

  it("excludes disabled partners", () => {
    // Their pages 404 by design — advertising them wastes crawl budget.
    for (const partner of partners.filter((p) => p.enabled === false)) {
      expect(paths).not.toContain(`/partners/${partner.slug}`);
    }
  });

  it("lists every resource, which are flat .md files", () => {
    const slugs = readdirSync(join(ROOT, "content", "resources"))
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, ""));

    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(paths).toContain(`/resources/${slug}`);
    }
  });

  it("lists every blog post, which are directories with an index.md", () => {
    const slugs = readdirSync(join(ROOT, "content", "blog"), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(paths).toContain(`/blog/${slug}`);
    }
  });

  it("excludes the short-link routes", () => {
    // /refer is noindex and /refer/[slug] only redirects.
    expect(paths.filter((p) => p.startsWith("/refer"))).toEqual([]);
  });

  it("has no duplicate URLs", () => {
    expect(new Set(locs).size).toBe(locs.length);
  });

  it("uses absolute URLs with valid dates", () => {
    for (const url of locs) {
      expect(url.startsWith("https://www.foxyslab.com")).toBe(true);
    }
    for (const [, date] of SITEMAP.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
