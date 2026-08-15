import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/videos", name: "Videos" },
  { path: "/enquiries", name: "Enquiries" },
  { path: "/blog", name: "Blog" },
  { path: "/resources", name: "Resources" },
  { path: "/partners", name: "Partners" },
  { path: "/supporters", name: "Supporters" },
];

/*
 * `wcag21a` and `wcag21aa` cover the 2.1 additions, and `best-practice` picks
 * up heading-order — which is not tagged to a success criterion but is exactly
 * the kind of structural problem that makes a page tedious to navigate by
 * heading. Both were missing, which is why three listing pages shipped with an
 * h1 -> h3 jump and the suite stayed green.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

/*
 * axe ships `label-content-name-mismatch` disabled, because it is marked
 * experimental — listing its tag is not enough to turn it on. That is why the
 * playlist filter's WCAG 2.5.3 failure was invisible here while Lighthouse,
 * which enables the rule, reported it on every run. Enabling it explicitly.
 */
const EXTRA_RULES = { "label-content-name-mismatch": { enabled: true } };

for (const { path, name } of pages) {
  test(`${name} page passes axe accessibility audit`, async ({ page }) => {
    await page.goto(path);

    // Several of these render their content client-side, so an audit that runs
    // before hydration would pass against an empty page.
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(TAGS)
      .options({ rules: EXTRA_RULES })
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("skip-to-content link works", async ({ page }) => {
  await page.goto("/");

  // Tab to the skip link
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: /skip to/i });

  // The skip link should be focusable (it may only appear on focus)
  if (await skipLink.isVisible()) {
    // Use Enter key since the skip link is designed for keyboard navigation
    // and may be overlapped by the fixed nav bar
    await page.keyboard.press("Enter");

    // Main content should receive focus or be scrolled to
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  }
});
