import { test, expect } from "@playwright/test";

test.describe("Mobile Menu", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test("toggle button opens and closes menu", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Toggle menu" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("menu links navigate to pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Toggle menu" }).click();
    // Scope to the mobile menu list to avoid matching the desktop nav link
    await page.getByRole("list").getByRole("link", { name: "About" }).click();

    await expect(page).toHaveURL(/\/about/);
  });

  test("menu closes after link click", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Toggle menu" });
    await toggle.click();
    // Scope to the mobile menu list to avoid matching the desktop nav link
    await page.getByRole("list").getByRole("link", { name: "About" }).click();

    // After navigation, menu should be closed
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
