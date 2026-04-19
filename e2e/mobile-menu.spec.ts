import { test, expect } from "@playwright/test";

test.describe("Mobile Menu", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test("toggle button opens and closes menu", async ({ page }) => {
    await page.goto("/");

    const openBtn = page.getByRole("button", { name: "Open menu" });
    await expect(openBtn).toBeVisible();
    await expect(openBtn).toHaveAttribute("aria-expanded", "false");

    await openBtn.click();
    const closeBtn = page.getByRole("button", { name: "Close menu" });
    await expect(closeBtn).toHaveAttribute("aria-expanded", "true");

    await closeBtn.click();
    await expect(openBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("menu links navigate to pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByTestId("mobile-menu")
      .getByRole("link", { name: "About" })
      .click();

    await expect(page).toHaveURL(/\/about/);
  });

  test("menu closes after link click", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await page
      .getByTestId("mobile-menu")
      .getByRole("link", { name: "About" })
      .click();

    // After navigation, menu should be closed
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
