# Component guide

How components are structured, documented and tested on this project.

See [ADR 010](./architectural-decisions/adr-010-storybook.md) for why Storybook
was adopted and [ADR 011](./architectural-decisions/adr-011-component-organisation.md)
for the category structure.

## Structure

Each component lives in its own folder, grouped by functional category:

```
components/
  <category>/
    <ComponentName>/
      index.tsx              the component
      styles.module.css      its styles
      <name>.stories.tsx     its states
      <name>.mdx             its documentation
      __tests__/             its behaviour
```

Categories are `layout`, `navigation`, `data-display`, `data-input`, `feedback`
and `media`. A component that needs internal sub-components or helpers gets
`components/` and `helpers/` subfolders rather than putting them in the parent.

Not every component has moved yet — the migration happens as components are
pulled into Storybook, so the categories can still change.

## Where each kind of check lives

Two tools, deliberately, with different jobs:

|                           | Vitest + Testing Library   | Storybook                                 |
| ------------------------- | -------------------------- | ----------------------------------------- |
| Behaviour and interaction | yes                        | no                                        |
| Regression guards         | yes                        | no                                        |
| Visual states             | no                         | yes                                       |
| Documentation             | no                         | yes                                       |
| Accessibility             | page level, via axe in E2E | component state level, via the a11y addon |

The split matters because a full-page axe run only ever sees the states a page
happens to be in. A story can put a component into an error state, an empty
state or a hover state and run axe against that.

## Writing a story

Cover the states someone would need to see to trust the component — not every
permutation of every prop. A story earns its place by showing something a reader
could otherwise only reach by contriving conditions on a live page.

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoCard } from "./index";

const meta: Meta<typeof VideoCard> = {
  // Set the title explicitly as "<category>/<ComponentName>". Derived from the
  // path it repeats the component name, because folders are PascalCase and
  // story files are kebab-case.
  title: "data-display/VideoCard",
  component: VideoCard,
  args: { video: mockVideo },
};

export default meta;
type Story = StoryObj<typeof VideoCard>;

export const Default: Story = {};

export const WithCompanionArticle: Story = {
  args: { articleSlug: "node-red-nodes-explained" },
};
```

Prop tables are generated from the TypeScript interface, so document the
component's purpose and its non-obvious behaviour in the MDX — not the props.
Restating a prop table by hand produces a second copy that goes stale.

## Writing the MDX

Cover what the props cannot say:

- what the component is for, in a sentence
- decisions that look wrong without context — why the card's article link is a
  sibling of the anchor rather than a child, for instance
- accessibility behaviour that is deliberate

Keep it short. Documentation nobody finishes reading is documentation nobody
reads.

## Running it

```bash
npm run storybook         # dev server on :6006
npm run build-storybook   # static build
npm run docs              # regenerate the MDX from /docs
```

`npm run storybook` regenerates the docs first, so editing a file in `/docs` and
restarting is enough to see it in the sidebar.
