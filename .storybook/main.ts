import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Storybook configuration.
 *
 * The framework is the Vite builder. Storybook's init warns that a project with
 * a custom webpack config (this one has `withSentryConfig`) should prefer the
 * Webpack builder — but that advice does not survive contact here.
 *
 * The Webpack builder writes its generated entry as absolute `require('...')`
 * paths in single quotes. This project lives in a directory called "Foxy's Lab",
 * and the apostrophe terminates the string, so the entry fails to parse before
 * anything else happens. The same character already breaks Next's dynamic
 * metadata routes — see ADR 008.
 *
 * Vite has no such problem, and loses nothing: Sentry's webpack plugin only
 * uploads source maps, which is irrelevant to a component catalogue.
 */
const config: StorybookConfig = {
  stories: [
    /*
     * Documentation comes from plain markdown in /docs, converted to MDX by
     * scripts/generate-sb-docs.mjs. The generated files are gitignored: /docs
     * is the source of truth, so there is only ever one copy to edit.
     */
    {
      directory: "./.docs",
      titlePrefix: "Documentation",
      files: "**/*.mdx",
    },
    {
      directory: "../components",
      titlePrefix: "Components",
      files: "**/*.@(mdx|stories.@(ts|tsx))",
    },
  ],
  addons: [
    "@storybook/addon-docs",
    /*
     * Accessibility is the first-class concern on this project, so the a11y
     * addon is not optional furniture — it is why a component gets a story at
     * all. Every story is an axe run against a state that would otherwise only
     * be checked on a full page, if at all.
     */
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  typescript: {
    // Props tables are generated from the TypeScript types, so interfaces stay
    // the single source of truth rather than being restated in MDX.
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
