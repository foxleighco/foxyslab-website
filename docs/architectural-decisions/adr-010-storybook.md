# ADR 010: Adopt Storybook for component documentation and state-level accessibility testing

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

Components had no catalogue. Their states — hover overlays, empty states, error
states, loading skeletons — could only be seen by contriving the conditions on a
real page, and several were only ever exercised in one context.

The reference implementation for how this project likes Storybook used is
[jackanory](https://github.com/foxleigh81/jackanory): component folders grouped
by functional category, documentation as markdown converted to MDX, stories
treated as first-class rather than an afterthought.

Jackanory tests components exclusively through Storybook and has no React
Testing Library tests at all. This project already has 275 passing Vitest tests,
7 files of which cover components.

## Decision

Adopt Storybook for documentation, visual states and per-state accessibility
checks. Keep the existing Vitest and Testing Library tests as the behavioural
safety net.

- **Vitest + RTL** — behaviour, interaction, regression guards
- **Storybook** — documentation, visual states, axe per state

Use the Vite builder (`@storybook/nextjs-vite`), which is also what jackanory
uses.

Storybook's installer recommends the Webpack builder for projects with a custom
webpack config, and this project has one via `withSentryConfig`. That advice
does not hold here: the Webpack builder writes its generated entry as absolute
`require('...')` paths in single quotes, and this project lives in a directory
called "Foxy's Lab". The apostrophe terminates the string and the entry fails to
parse before the build starts. The same character already breaks Next's dynamic
metadata routes — see [ADR 008](./adr-008-generated-static-files.md).

Nothing is lost by using Vite. Sentry's webpack plugin only uploads source maps,
which a component catalogue has no use for.

## Consequences

- Nothing already verified is discarded, and CI stays fast
- Two homes for component checks, with some overlap between a play function and
  an RTL test. Accepted deliberately: the alternative was rewriting working
  coverage to move it
- Storybook is a substantial devDependency
- Storybook builds through Vite while the site builds through Webpack, so the
  two pipelines can in principle disagree about a module. Nothing has yet
- Anyone cloning into a path containing an apostrophe would hit the same class
  of problem elsewhere; it is a property of the directory name, not of Storybook

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
