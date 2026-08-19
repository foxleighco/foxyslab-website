# ADR 001: Begin using Architectural Decision Records (ADRs) and store them in the repository

- **Date created**: 19/08/2026
- **Driver**: Alex Foxleigh (Foxy)

## Status

![accepted]

## Context

This project has accumulated a number of non-obvious technical decisions —
several of them counter-intuitive enough that a future reader would reasonably
try to "fix" them and reintroduce the problem they were made to solve.

Some of that reasoning currently lives in code comments, some in commit
messages, and some only in pull request discussion. Comments are close to the
code but cannot explain a decision that spans files. Commit messages are
thorough here but effectively unsearchable a year later. Pull requests are
outside the repository entirely.

An ADR records the decision, the alternatives, and the consequences in one place
that travels with the code.

## Advice

ADRs should be written in Markdown and stored in the `docs/architectural-decisions`
folder in the repository.

All ADRs should follow this format:

### Title

`ADR NNN: <decision statement>` — a three digit number and a short descriptive
title in the imperative mood, including a decision word ("Use", "Stop Using",
"Replace", "Generate", "Prefer"). The title does not include the status.

### Dates

"Date created", and "Date last updated" if it has been revised.

### Drivers

Who made the decision, so it is clear who to ask later.

### Status

One of Proposed, Accepted, Superseded, Rejected, Deprecated — rendered as a
badge. A superseded ADR links to the one that replaced it, for example:

`![superseded] by [ADR 002](./adr-002-framework.md)`

### Context

The problem and the forces acting on it, including the alternatives considered.

### Decision

What was decided. Distinct from the status: a decision can be accepted now and
superseded later without the record changing.

### Consequences

What this costs as well as what it buys. An ADR that lists only benefits is
advertising, not a record.

## Decision

Adopt ADRs immediately, store them in `docs/architectural-decisions`, and
backfill the significant decisions already made on this project so the record
starts complete rather than from today.

## Consequences

- One searchable place for the reasoning behind non-obvious choices
- Future readers can tell "deliberate" from "accident", which matters most for
  the decisions that look wrong at first glance
- A small ongoing overhead per significant decision
- A risk that ADRs drift out of date; mitigated by superseding rather than
  editing history

[proposed]: https://img.shields.io/badge/Proposed-yellow?style=for-the-badge
[accepted]: https://img.shields.io/badge/Accepted-green?style=for-the-badge
[superseded]: https://img.shields.io/badge/Superseded-orange?style=for-the-badge
[rejected]: https://img.shields.io/badge/Rejected-red?style=for-the-badge
[deprecated]: https://img.shields.io/badge/Deprecated-grey?style=for-the-badge
