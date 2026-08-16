import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Foxy's Lab/);
  });

  test("videos page loads", async ({ page }) => {
    await page.goto("/videos");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("enquiries page loads", async ({ page }) => {
    await page.goto("/enquiries");
    await expect(page.locator("h1")).toBeVisible();
  });

  /*
   * Scoped to the desktop nav, and matching exactly.
   *
   * This previously used an unscoped `getByRole("link", { name: "About" })`
   * with `.first()`. Playwright matches accessible names as a case-insensitive
   * *substring* by default, so on mobile the first match was a video card whose
   * title reads "I've been lying to you about my smart home" — a `target=_blank`
   * link to YouTube, which opens a tab and never changes the page URL.
   *
   * It only passed on desktop because the nav link happened to come first in
   * DOM order. That is not a property worth depending on: any new video with
   * "about" or "videos" in its title would have broken it again.
   */
  test("desktop nav links navigate between pages", async ({ page }) => {
    const width = page.viewportSize()?.width ?? 0;
    test.skip(
      width < 1024,
      "Desktop nav is hidden below 1024px — the mobile menu equivalent lives in mobile-menu.spec.ts"
    );

    await page.goto("/");
    const nav = page.getByTestId("desktop-nav");

    await nav.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about/);

    await nav.getByRole("link", { name: "Videos", exact: true }).click();
    await expect(page).toHaveURL(/\/videos/);
  });

  test("YouTube CTA link opens in new tab", async ({ page }) => {
    await page.goto("/");

    const ctaLink = page
      .getByRole("link", { name: "Subscribe on YouTube" })
      .first();
    await expect(ctaLink).toHaveAttribute("target", "_blank");
    await expect(ctaLink).toHaveAttribute("rel", /noopener/);
  });
});
