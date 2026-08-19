import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

/**
 * Storybook preview configuration.
 *
 * `globals.css` is imported so components render against the real design
 * tokens — `--primary`, `--secondary`, the accent colours — rather than an
 * approximation. Every component's styling depends on them, so a story without
 * them would be testing something the site never renders.
 *
 * The fonts are the one thing not reproduced here. They are loaded through
 * `next/font` in the root layout, which Storybook does not run, so text falls
 * back to a system stack. Layout is close but not pixel-identical; that is a
 * fair trade against duplicating the font setup in two places.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /*
     * The site is dark-only. Storybook's default light canvas would make every
     * component look broken and, worse, would give the a11y addon the wrong
     * background to compute contrast against.
     */
    backgrounds: {
      options: {
        site: { name: "Site", value: "#32002d" },
      },
    },
    a11y: {
      // Surface violations in the panel rather than failing the render, so a
      // story stays usable while it is being worked on.
      test: "todo",
    },
  },
  initialGlobals: {
    backgrounds: { value: "site" },
  },
};

export default preview;
