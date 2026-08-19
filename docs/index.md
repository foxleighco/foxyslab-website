# Foxy's Lab documentation

Documentation for the Foxy's Lab website. Everything here is plain markdown so
it reads on GitHub and in an editor; `scripts/generate-sb-docs.mjs` mirrors it
into Storybook so the same text appears in the sidebar.

`/docs` is the source of truth. The generated MDX under `.storybook/.docs` is
gitignored — two committed copies of the same prose means one of them is wrong.

- [Architectural Decision Records](./architectural-decisions/index.md) — the
  significant technical decisions and what they cost
- [Component guide](./components.md) — how components are structured, documented
  and tested

For build commands, design tokens and repository conventions, see `CLAUDE.md` in
the repository root.
