# Architectural Decision Records

Records of the significant technical decisions on this project, why they were
made, and what they cost.

ADRs 002 to 009 are backfilled — the decisions predate the practice. They were
written from the code, the commit history and the pull request discussions that
produced them, so the reasoning is recovered rather than invented, but the dates
are the date of writing.

| ADR                                        | Decision                                                      | Status   |
| ------------------------------------------ | ------------------------------------------------------------- | -------- |
| [001](./adr-001-adrs.md)                   | Begin using ADRs                                              | Accepted |
| [002](./adr-002-framework.md)              | Use Next.js with the App Router                               | Accepted |
| [003](./adr-003-styling.md)                | Use CSS Modules rather than Tailwind                          | Accepted |
| [004](./adr-004-typescript.md)             | Use TypeScript in strict mode                                 | Accepted |
| [005](./adr-005-static-rendering.md)       | Never evaluate feature flags in the root layout               | Accepted |
| [006](./adr-006-build-time-credentials.md) | Fail the build when prerendered pages cannot fetch their data | Accepted |
| [007](./adr-007-structured-data.md)        | Render JSON-LD as plain script tags                           | Accepted |
| [008](./adr-008-generated-static-files.md) | Generate sitemap.xml and rss.xml at build time                | Accepted |
| [009](./adr-009-accessibility.md)          | Treat accessibility as the highest priority concern           | Accepted |
| [010](./adr-010-storybook.md)              | Adopt Storybook for documentation and state-level a11y        | Accepted |
| [011](./adr-011-component-organisation.md) | Group components by functional category                       | Proposed |

## Writing a new one

Copy the format from [ADR 001](./adr-001-adrs.md). Take the next free number,
and include the consequences you would rather not admit to — an ADR listing only
benefits is advertising, not a record.

Supersede rather than rewrite. The point of the record is that it shows what was
believed at the time.
