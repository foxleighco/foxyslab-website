import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Guards the fix in `lib/feature-flags.ts`.
 *
 * Evaluating a `flags/next` flag reads cookies, which opts the calling route
 * into dynamic rendering. Because the Footer sits in the root layout, a single
 * `await someFlag()` there silently turned the *entire site* dynamic: every
 * `export const revalidate` stopped applying and every response shipped
 * `Cache-Control: no-store`, so nothing was CDN-cacheable or bfcache-eligible.
 *
 * The failure is invisible locally — the site works fine, it's just uncacheable
 * — so it needs a test rather than review vigilance. These assert on source
 * text because the property being protected (static rendering) only otherwise
 * shows up in build output, which is far too slow to assert on in a unit test.
 *
 * The checks are deliberately structural rather than name-based. An earlier
 * version matched call expressions ending in `flag`/`Flag`, which a flag named
 * `export const newsletter = flag(...)` would have walked straight past. What
 * actually makes a flag reachable is importing the module that defines it, so
 * that is what gets asserted.
 */

const ROOT = join(__dirname, "..", "..");

/**
 * Module specifiers that can hand back a callable flag. `app/flags.ts` is
 * passed wholesale to `getProviderData()`, so it may only contain flag
 * definitions — which is what makes this set complete.
 */
/**
 * Any path pointing at the flag-definitions module, however it is spelled:
 * `./flags`, `@/app/flags`, `../../app/flags`. Requiring a trailing `/flags`
 * path segment is what keeps it from also matching `@/lib/feature-flags`.
 */
const FLAG_DEFS_MODULE = `(?:[^"']*/)flags`;

const FLAG_MODULE_SPECIFIERS = ["flags/next", "flags", FLAG_DEFS_MODULE];

/**
 * An explicit file extension is tolerated in these patterns. `bundler` module
 * resolution accepts `@/app/flags.js` for a `.ts` file, so matching only the
 * bare specifier would leave a way to import a flag without failing the suite.
 * (`.ts` specifiers are already rejected by the compiler, since
 * `allowImportingTsExtensions` is off, but there's no cost to covering them.)
 */
const EXT = "(?:\\.(?:ts|tsx|js|jsx|mjs|cjs))?";

/** Matches any import of `spec`. */
const importOf = (spec: string) => new RegExp(`from\\s*["']${spec}${EXT}["']`);

/** Matches a named import of `spec` — `import { x } from "…"`. */
const namedImportOf = (spec: string) =>
  new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*["']${spec}${EXT}["']`);

/**
 * Renders inside the root layout, so a flag call here turns the whole site
 * dynamic. None of these have any reason to touch a flag module at all.
 */
const LAYOUT_TREE = [
  "components/Footer/index.tsx",
  "components/Navigation/index.tsx",
  "components/MobileMenu/index.tsx",
];

/** Page routes expected to be statically prerendered. */
const STATIC_PAGES = [
  "app/page.tsx",
  "app/about/page.tsx",
  "app/videos/page.tsx",
  "app/blog/page.tsx",
];

/**
 * Strips comments so the guards only see executable code.
 *
 * Without this the suite fails on a doc comment that mentions `cookies()` —
 * which would punish someone for documenting the very rule being enforced.
 * String literals are deliberately left intact: import specifiers are string
 * literals, and stripping them would blind the import checks.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const read = (rel: string) =>
  stripComments(readFileSync(join(ROOT, rel), "utf8"));

describe("static rendering", () => {
  it.each(LAYOUT_TREE.concat(STATIC_PAGES))(
    "%s does not import a flag module",
    (file) => {
      const src = read(file);
      for (const spec of FLAG_MODULE_SPECIFIERS) {
        expect(src).not.toMatch(importOf(spec));
      }
    }
  );

  /*
   * The layout is the one exception. It imports `flags/next` for
   * `getProviderData()`, which reads flag metadata for the toolbar and never
   * touches cookies, so the import itself is safe. What it must never do is
   * evaluate one.
   */
  it("app/layout.tsx does not evaluate a flag", () => {
    const src = read("app/layout.tsx");

    // `flags.newsletterFlag()` — calling through the namespace import.
    expect(src).not.toMatch(/\bflags\.\w+\s*\(/);

    // A named import would allow calling a flag directly by its own name, so
    // the flag module may only be pulled in as a namespace.
    expect(src).not.toMatch(namedImportOf(FLAG_DEFS_MODULE));
  });

  it.each(LAYOUT_TREE.concat(STATIC_PAGES, ["app/layout.tsx"]))(
    "%s does not use request-scoped APIs",
    (file) => {
      // `cookies()`, `headers()` and `draftMode()` force dynamic rendering for
      // the same reason a flag call does.
      expect(read(file)).not.toMatch(/\b(cookies|headers|draftMode)\s*\(\s*\)/);
    }
  );

  it("feature flags are read from the environment, not a flags/next flag", () => {
    const src = read("lib/feature-flags.ts");
    expect(src).toMatch(/process\.env\.FLAG_NEWSLETTER/);
    expect(src).not.toMatch(/from\s+["']flags/);
  });
});
