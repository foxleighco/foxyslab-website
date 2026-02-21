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

  test("nav links navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Click About link in desktop nav
    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);

    await page.getByRole("link", { name: "Videos" }).first().click();
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
