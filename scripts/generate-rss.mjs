#!/usr/bin/env node
/**
 * Generates public/rss.xml at build time.
 *
 * Written as a build script rather than a route handler for the same reason as
 * the sitemap: the project directory name contains an apostrophe, which breaks
 * Next's dynamic metadata routes. See CLAUDE.md.
 *
 * Frontmatter is parsed with a small reader rather than by importing lib/blog,
 * because that module is TypeScript with path aliases and Sentry
 * instrumentation — none of which a prebuild script can load without a build
 * step of its own. The trade is that the two must agree on where posts live and
 * what "published" means; the tests assert that they do.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseFrontmatter, isDraft } from "./lib/frontmatter.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://www.foxyslab.com";
const TITLE = "Foxy's Lab";
const DESCRIPTION =
  "Smart home and homelab tech without the corporate waffle. Honest reviews, local control advocacy, and the occasional strongly-worded opinion about cloud-dependent tat.";

/** XML text escaping. RSS is XML, so these five are the ones that matter. */
function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function posts() {
  const base = join(ROOT, "content", "blog");

  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = join(base, entry.name, "index.md");
      let source;
      try {
        source = readFileSync(file, "utf8");
      } catch {
        return null;
      }
      if (isDraft(source)) return null;

      const frontmatter = parseFrontmatter(source);
      if (!frontmatter) return null;

      const published = frontmatter.publishedAt
        ? new Date(frontmatter.publishedAt)
        : statSync(file).mtime;

      return {
        slug: entry.name,
        title: frontmatter.title ?? entry.name,
        description: frontmatter.description ?? "",
        published,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.published - a.published);
}

const items = posts();
const updated = items[0]?.published ?? new Date(0);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  "  <channel>",
  `    <title>${escapeXml(TITLE)}</title>`,
  `    <link>${BASE}</link>`,
  `    <description>${escapeXml(DESCRIPTION)}</description>`,
  "    <language>en-GB</language>",
  `    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>`,
  `    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>`,
  ...items.map((post) =>
    [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${BASE}/blog/${post.slug}</link>`,
      `      <guid isPermaLink="true">${BASE}/blog/${post.slug}</guid>`,
      `      <description>${escapeXml(post.description)}</description>`,
      `      <pubDate>${post.published.toUTCString()}</pubDate>`,
      "    </item>",
    ].join("\n")
  ),
  "  </channel>",
  "</rss>",
  "",
].join("\n");

writeFileSync(join(ROOT, "public", "rss.xml"), xml);
console.log(`Generated RSS feed with ${items.length} items`);
