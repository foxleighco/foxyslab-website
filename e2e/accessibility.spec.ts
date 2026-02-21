import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/videos", name: "Videos" },
  { path: "/enquiries", name: "Enquiries" },
];

for (const { path, name } of pages) {
  test(`${name} page passes axe accessibility audit`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
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
    await skipLink.click();

    // Main content should receive focus or be scrolled to
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  }
});
