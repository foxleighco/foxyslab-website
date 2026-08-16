#!/usr/bin/env node
/**
 * Generates public/sitemap.xml at build time.
 *
 * The sitemap used to be maintained by hand, which meant CLAUDE.md carried a
 * rule to update it whenever a page changed — and, inevitably, `lastmod` dates
 * that had drifted months out of date across 22 entries. A stale `lastmod` is
 * worse than none: it tells crawlers not to bother re-reading a page that has
 * in fact changed.
 *
 * This deliberately writes into `public/` rather than using Next's `sitemap.ts`
 * convention. The project directory name contains an apostrophe, which breaks
 * Next's dynamic metadata routes — the same reason robots.txt and the manifest
 * are static files. See the note in CLAUDE.md.
 *
 * Dates come from frontmatter where content declares one, and fall back to the
 * file's mtime. Routes with no meaningful content date use the build date,
 * which is honest: it is when the page last changed.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://www.foxyslab.com";

/** Routes that exist independently of content. */
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/videos", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/resources", changefreq: "weekly", priority: "0.8" },
  { path: "/partners", changefreq: "monthly", priority: "0.6" },
  { path: "/supporters", changefreq: "monthly", priority: "0.6" },
  { path: "/enquiries", changefreq: "yearly", priority: "0.5" },
];

/*
 * `/refer` and `/refer/[slug]` are excluded on purpose: the first is a noindex
 * fallback page, the second is a redirect handler with no content of its own.
 */

const isoDate = (value) => new Date(value).toISOString().split("T")[0];

/** Reads `publishedAt`/`updatedAt` from frontmatter, falling back to mtime. */
function contentDate(filePath) {
  const source = readFileSync(filePath, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);

  if (frontmatter) {
    const updated = frontmatter[1].match(/^updatedAt:\s*(.+)$/m);
    const published = frontmatter[1].match(/^publishedAt:\s*(.+)$/m);
    const raw = (updated || published)?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (raw && !Number.isNaN(new Date(raw).getTime())) return isoDate(raw);
  }

  return isoDate(statSync(filePath).mtime);
}

/**
 * Every published entry under a content directory, as {path, lastmod}.
 *
 * Handles both layouts in use: blog posts are directories containing an
 * `index.md` (they have co-located images), resources are flat `.md` files.
 * Supporting only the first silently produced a sitemap missing every resource
 * page, which is exactly the failure a generated sitemap is meant to end.
 */
function contentRoutes(dir, urlPrefix) {
  const base = join(ROOT, "content", dir);
  let entries;

  try {
    entries = readdirSync(base, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .map((entry) =>
      entry.isDirectory()
        ? { slug: entry.name, file: join(base, entry.name, "index.md") }
        : entry.name.endsWith(".md")
          ? { slug: entry.name.replace(/\.md$/, ""), file: join(base, entry.name) }
          : null
    )
    .filter(Boolean)
    .filter(({ file }) => {
      try {
        // Drafts stay out of the sitemap.
        return !/^status:\s*["']?draft/m.test(readFileSync(file, "utf8"));
      } catch {
        return false;
      }
    })
    .map(({ slug, file }) => ({
      path: `${urlPrefix}/${slug}`,
      lastmod: contentDate(file),
      changefreq: "monthly",
      priority: "0.7",
    }));
}

function partnerRoutes() {
  const file = join(ROOT, "data", "partners.json");
  try {
    const partners = JSON.parse(readFileSync(file, "utf8"));
    const lastmod = isoDate(statSync(file).mtime);
    const list = Array.isArray(partners) ? partners : (partners.partners ?? []);
    return list
      // Mirrors the `enabled !== false` filter in lib/partners.ts. Disabled
      // partners are excluded from generateStaticParams, so listing them here
      // would advertise URLs that resolve to a not-found page.
      .filter((partner) => partner.slug && partner.enabled !== false)
      .map((partner) => ({
        path: `/partners/${partner.slug}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.5",
      }));
  } catch {
    return [];
  }
}

const buildDate = isoDate(Date.now());

const routes = [
  ...STATIC_ROUTES.map((route) => ({ ...route, lastmod: buildDate })),
  ...contentRoutes("blog", "/blog"),
  ...contentRoutes("resources", "/resources"),
  ...partnerRoutes(),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(({ path, lastmod, changefreq, priority }) =>
    [
      "  <url>",
      `    <loc>${BASE}${path === "/" ? "" : path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n")
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(ROOT, "public", "sitemap.xml"), xml);
console.log(`Generated sitemap with ${routes.length} URLs`);
