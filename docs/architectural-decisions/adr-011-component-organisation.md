# ADR 011: Group components by functional category

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![proposed]

## Context

`components/` is a flat list of eighteen PascalCase folders with no ordering
beyond the alphabet, so unrelated things sit next to each other and the list
only gets harder to scan as it grows.

Jackanory groups by function: `data-display`, `data-input`, `factories`,
`feedback`, `layout`, `navigation`.

## Decision

Group by functional category under the existing `components/` directory. Do
not move to `src/` — that would touch every import path, alias and test path in
the repository for organisational benefit only.

Proposed categories:

- **layout** — Footer, PageHeader
- **navigation** — Navigation, MobileMenu, TableOfContents
- **data-display** — VideoCard, PostCard, ResourceCard, ProductCard, FeedItem,
  ShopPreview, VideoGallery
- **data-input** — EnquiryForm, Newsletter, PlaylistFilter
- **feedback** — ProductModal
- **media** — TransparentVideo, CodeBlockActions

Each component keeps its own folder: `index.tsx`, `styles.module.css`,
`<name>.stories.tsx`, `<name>.mdx`, `__tests__/`.

## Consequences

- The directory listing groups related components together
- Import churn across the app, though it is mechanical and the type-checker
  finds every case
- Category boundaries are a judgement call. `PlaylistFilter` is a control that
  displays data; it is filed under data-input because its purpose is input
- Marked Proposed rather than Accepted: the moves land incrementally as
  components are pulled into Storybook, so the categories can be adjusted before
  they are applied eighteen times

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
