# ADR 008: Generate sitemap.xml and rss.xml at build time, not via Next metadata routes

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

Next.js offers `sitemap.ts` and route handlers for this. Neither works here:
the project directory name contains an apostrophe ("Foxy's Lab"), which breaks
Next's dynamic metadata files. `robots.txt` and the web manifest are static
files in `public/` for the same reason.

The sitemap had previously been maintained by hand, with `lastmod` dates
months out of date across 22 entries. A stale `lastmod` is worse than none: it
tells crawlers not to re-read a page that has in fact changed.

## Decision

Generate both in `prebuild` with scripts writing into `public/`.

The rule for what counts as published lives once, in
`scripts/lib/frontmatter.mjs`, shared by both generators and their tests. These
scripts cannot import `lib/blog.ts` — it is TypeScript with path aliases and
Sentry instrumentation — so without a shared module the definition would be
reimplemented, subtly differently, in each.

## Consequences

- Both files are always current and cannot drift from the content
- Neither may be edited by hand; both are overwritten every build
- Adding a static route means adding it to `STATIC_ROUTES`. Content pages and
  partners are picked up automatically
- Guarded by tests comparing the committed output against the content on disk,
  plus direct tests of the draft rule, since a repo with no drafts would let a
  broken filter pass unnoticed

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
