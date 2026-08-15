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
 */

const ROOT = join(__dirname, "..", "..");

/** Files that render inside the root layout, so must stay statically renderable. */
const LAYOUT_TREE = [
  "app/layout.tsx",
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

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("static rendering", () => {
  it.each(LAYOUT_TREE)("%s does not evaluate a feature flag", (file) => {
    const src = read(file);
    // Matches `await someFlag()` / `someFlag()` in an await list. Importing the
    // flag is fine; calling it is what forces dynamic rendering.
    expect(src).not.toMatch(/\b\w*[fF]lag\s*\(\s*\)/);
  });

  it.each(STATIC_PAGES)("%s does not evaluate a feature flag", (file) => {
    expect(read(file)).not.toMatch(/\b\w*[fF]lag\s*\(\s*\)/);
  });

  it.each(LAYOUT_TREE.concat(STATIC_PAGES))(
    "%s does not use request-scoped APIs",
    (file) => {
      const src = read(file);
      // `cookies()`, `headers()` and `draftMode()` force dynamic rendering for
      // the same reason a flag call does.
      expect(src).not.toMatch(/\b(cookies|headers|draftMode)\s*\(\s*\)/);
    }
  );

  it("feature flags are read from the environment, not a flags/next flag", () => {
    const src = read("lib/feature-flags.ts");
    expect(src).toMatch(/process\.env\.FLAG_NEWSLETTER/);
    expect(src).not.toMatch(/from "flags/);
  });
});
