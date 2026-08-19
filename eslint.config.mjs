import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Storybook build output and the MDX generated from /docs. Both are
    // gitignored, but flat config does not read .gitignore.
    "storybook-static/**",
    ".storybook/.docs/**",
  ]),
]);

export default eslintConfig;
