# ADR 006: Fail the build when prerendered pages cannot fetch their data

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

Prerendering moved data fetching from request time to build time. That changed
what a missing credential means: not a temporarily degraded page, but an empty
page baked permanently into the static output.

This happened twice. A Docker image supplied `YOUTUBE_API_KEY=build-placeholder`
— truthy, so it passed the "is the key set" check, then was rejected by the API —
and shipped a homepage with no videos from a build that reported success. The
Fourthwall token was absent from the Docker build entirely, and the shop section
baked in empty the same way.

## Decision

During a production build (`NEXT_PHASE === "phase-production-build"`), a failed
fetch for prerendered content throws and fails the build.

At runtime the same failure degrades gracefully: an empty section beats an error
page, and the next revalidation recovers. At build time there is nothing to
recover, because the empty result is what gets served.

Builds that never deploy — CI, which has no credentials by design — opt out
explicitly with `ALLOW_MISSING_API_KEYS=true`.

## Consequences

- A deploy missing a credential fails loudly instead of silently shipping an
  empty page
- Anything a prerendered page fetches now needs its credential at build time,
  including in Docker
- A placeholder value is worse than no value: it passes presence checks and
  fails at the API. Never satisfy the guard with a dummy string

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
