# ADR 007: Render JSON-LD as plain script tags, not next/script

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

Every JSON-LD block on the site used `next/script`, which injects client-side.
The markup existed only inside the RSC flight payload — verified against
production, there were **zero** real `<script type="application/ld+json">`
tags in the HTML of any page.

Google executes JavaScript so it likely still saw them, but validators and
non-JS crawlers never did.

## Decision

Render JSON-LD as a plain `<script type="application/ld+json">` element in the
server component, which is what the Next.js documentation shows for structured
data. Serialise through `jsonLd()` in `lib/structured-data.ts`.

That helper escapes `<`, `>`, `&` and the JavaScript line separators.
`JSON.stringify` alone is unsafe here: the video schema is built from YouTube
titles and descriptions, and a title containing `</script>` would close the tag
and have everything after it parsed as HTML.

## Consequences

- Structured data is in the HTML for every consumer, not just JS-capable ones
- External content cannot break out of the script tag
- `next/script` remains correct for actual scripts with loading strategies,
  such as Google Analytics

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
