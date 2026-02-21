import { test, expect } from "@playwright/test";

test.describe("Videos Page", () => {
  test("page loads with heading", async ({ page }) => {
    await page.goto("/videos");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("handles empty state gracefully", async ({ page }) => {
    await page.goto("/videos");
    // Page should load without errors even without YouTube API key
    await expect(page).toHaveTitle(/Foxy's Lab/);
  });
});
