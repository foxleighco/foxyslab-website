import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
// Plain .mjs, shared with the prebuild scripts.
import { isDraft } from "../../scripts/lib/frontmatter.mjs";

/**
 * Checks the generated feed against the posts it claims to describe.
 *
 * `scripts/generate-rss.mjs` cannot import `lib/blog` — that module is
 * TypeScript with path aliases and Sentry instrumentation, none of which a
 * prebuild script can load. So it reads frontmatter with its own small parser,
 * and the two have to agree about where posts live and what counts as
 * published. That agreement is what this asserts.
 */

const ROOT = join(__dirname, "..", "..");
const FEED = readFileSync(join(ROOT, "public", "rss.xml"), "utf8");

const links = [...FEED.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
const itemLinks = links.filter((url) => url.includes("/blog/"));

/** Posts on disk that the feed should contain. */
const publishedSlugs = readdirSync(join(ROOT, "content", "blog"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .filter((entry) => {
    const source = readFileSync(
      join(ROOT, "content", "blog", entry.name, "index.md"),
      "utf8"
    );
    return !isDraft(source);
  })
  .map((entry) => entry.name);

describe("rss feed", () => {
  it("is well-formed XML with a channel", () => {
    expect(FEED.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(FEED).toContain('<rss version="2.0"');
    expect(FEED).toContain("</channel>");
  });

  it("contains every published post", () => {
    expect(publishedSlugs.length).toBeGreaterThan(0);
    for (const slug of publishedSlugs) {
      expect(itemLinks).toContain(`https://www.foxyslab.com/blog/${slug}`);
    }
  });

  it("contains nothing that isn't a published post", () => {
    expect(itemLinks).toHaveLength(publishedSlugs.length);
  });

  it("orders items newest first", () => {
    const dates = [...FEED.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) =>
      new Date(m[1]).getTime()
    );

    expect(dates.length).toBeGreaterThan(0);
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it("escapes XML metacharacters", () => {
    // The site name contains an apostrophe, so this is exercised for real.
    expect(FEED).not.toMatch(/<title>[^<]*[&][^a-z#][^<]*<\/title>/);
    expect(FEED).toContain("&apos;");
  });

  it("declares a self-referencing atom link", () => {
    // Feed readers use this to resolve the canonical feed URL.
    expect(FEED).toContain(
      '<atom:link href="https://www.foxyslab.com/rss.xml" rel="self"'
    );
  });
});
