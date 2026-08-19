# ADR 003: Use CSS Modules rather than Tailwind

- **Date created**: 19/08/2026 (backfilled; migration completed February 2026)
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

The project was originally built with Tailwind and migrated away from it.

The site has a small, opinionated visual language — a dark aubergine palette,
pink and orange accents, pill shapes, gradient text — applied across a modest
number of components. That is the case where utility classes give least and
cost most: long unreadable class strings for styling that is not being reused
across a large team.

## Decision

Use CSS Modules for component and page styles, with global utilities and design
tokens in `app/globals.css`.

Design tokens are CSS custom properties on `:root` (`--primary`,
`--secondary`, `--accent-yellow`, `--accent-orange`). Shared utilities
(`.container`, `.btn-primary`, `.gradient-text`, `.sr-only`, `.prose`)
stay global; everything else is scoped to its component.

## Consequences

- Styles are colocated with components and cannot leak
- Tokens make palette changes a one-line edit
- `color-mix()` is used heavily (115 occurrences) for tinting, which sets a
  real browser support floor of Chrome/Edge 111, Firefox 113, Safari 16.2
- Some duplication between components; `PostCard` and `ResourceCard` share a
  byte-identical surface recipe that should be extracted

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
