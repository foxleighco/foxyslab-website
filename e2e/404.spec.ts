import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test("shows 404 for invalid routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(page.getByText(/not found|404/i).first()).toBeVisible();
  });

  test("has a link back to homepage", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    const homeLink = page.getByRole("link", { name: /home/i }).first();
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL("/");
  });
});
