# ADR 009: Treat accessibility as the highest priority concern

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

The site targets WCAG 2.1 AA. In practice that had been aspirational rather than
enforced: the axe suite ran with only the `wcag2a` and `wcag2aa` tags across
four pages, which meant `heading-order` (tagged `best-practice`) was never
checked, and `label-content-name-mismatch` never ran at all because axe ships
it disabled as experimental. Both were failing.

## Decision

Accessibility outranks visual preference and outranks the literal reading of a
request.

- The axe sweep covers eight pages with `wcag2a`, `wcag2aa`, `wcag21a`,
  `wcag21aa` and `best-practice`, and explicitly enables
  `label-content-name-mismatch`
- It waits for network idle, because several pages render client-side and would
  otherwise be audited empty — passing without checking anything
- The Storybook a11y addon runs axe against individual component states, which
  is where states that never appear in a full-page audit get covered
- When a change would remove an accessibility affordance, the affordance is kept
  in a non-visual form and that is stated explicitly, rather than silently
  dropped or silently left visible

## Consequences

- Requests to remove UI are interpreted as being about visual clutter, not about
  assistive behaviour. Removing the visible video count kept it as a
  screen-reader-only live region
- Some decisions are made on accessibility grounds against the simpler option:
  a native `<select>` over a custom dropdown, a sibling link rather than a
  nested anchor, an empty `alt` where a title already names the image
- Occasional duplication, such as two controls sharing the accessible name
  "Clear search", which is acceptable when both do the same thing

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
