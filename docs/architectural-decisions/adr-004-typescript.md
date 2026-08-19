# ADR 004: Use TypeScript in strict mode

- **Date created**: 19/08/2026 (backfilled; decision predates ADRs)
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

The site integrates several external data sources — the YouTube Data API, the
Fourthwall storefront, markdown frontmatter — whose shapes are not guaranteed
and change outside our control.

## Decision

TypeScript with `strict` enabled. External data is typed at the boundary:
frontmatter through a Zod schema, API responses through explicit interfaces, and
fallible operations through a `Result`-style union rather than exceptions:

```ts
type ApiResult<T> =
  { success: true; data: T } | { success: false; error: string };
```

## Consequences

- Callers cannot read `data` without handling failure first
- Frontmatter mistakes are caught at build time rather than rendering as
  `undefined`
- The `Result` type is only as good as the code that produces it: a function
  that throws before returning one bypasses the whole pattern, which is exactly
  what happened with a missing API key

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
