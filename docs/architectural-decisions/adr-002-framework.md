# ADR 002: Use Next.js with the App Router

- **Date created**: 19/08/2026 (backfilled; decision predates ADRs)
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

The site is a content site for a YouTube channel: blog posts and resources from
markdown in the repository, videos and merchandise from third-party APIs. It
needs to be fast, cheap to host, and good at SEO, since discovery is the point.

Alternatives considered:

- **Astro** — excellent for content sites and ships less JavaScript, but the
  interactive parts (video filtering, forms, menus) would need an island
  framework anyway
- **Plain React SPA** — poor SEO for a site whose purpose is discovery
- **Eleventy or Hugo** — very fast static output, but awkward for the parts that
  need per-request or revalidated data

## Decision

Use Next.js with the App Router, deployed on Vercel.

Server components by default; client components only where interactivity
requires them. Content pages are statically prerendered with ISR so remote data
stays fresh without a rebuild.

## Consequences

- Server rendering gives the SEO the project needs without extra work
- ISR keeps API-backed pages current without redeploying — a video published
  today appears within the hour
- Static rendering is easy to lose by accident: a single request-scoped call in
  the layout turns the whole site dynamic. See [ADR 005](./adr-005-static-rendering.md)
- The framework does a lot implicitly, which is convenient until the implicit
  behaviour is the bug

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
