# ADR 005: Never evaluate feature flags in the root layout

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

The Footer awaited a `flags/next` flag, and the Footer renders in the root
layout. Evaluating a flag reads cookies, which opts the calling route into
dynamic rendering — so a single `await someFlag()` in the layout turned the
entire site dynamic.

Nothing looked broken. The site rendered correctly and tests passed. What
actually happened was:

- every `export const revalidate` silently stopped applying
- every response shipped `Cache-Control: private, no-cache, no-store`
- production returned `x-vercel-cache: MISS` on every request, for every page

The CDN was caching nothing at all, and had not been for some time.

## Decision

Build-time flag values live in `lib/feature-flags.ts` as plain env-backed
constants. `flags/next` flags are never evaluated in the root layout or in
anything it renders.

If a flag genuinely needs per-request behaviour, evaluate it in a client
component or in an individual route.

## Consequences

- All twelve page routes are static or SSG; only the API route and the redirect
  handler remain dynamic
- Toggling a flag requires a redeploy rather than a restart. On Vercel an env
  var change redeploys anyway
- Guarded by `lib/__tests__/static-rendering.test.ts`, which bans importing a
  flag module anywhere in the layout tree. The failure is invisible in normal
  use, so it needs a test rather than review vigilance

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
