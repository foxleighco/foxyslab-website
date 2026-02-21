import { test, expect } from "@playwright/test";

test.describe("Enquiry Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/enquiries");
  });

  test("shows validation errors for empty submission", async ({ page }) => {
    await page.getByRole("button", { name: "Send Enquiry" }).click();

    await expect(
      page.getByText("Name must be at least 2 characters")
    ).toBeVisible();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test("shows error for invalid email", async ({ page }) => {
    await page.getByLabel(/^Name/).fill("John Doe");
    await page.getByLabel(/^Email/).fill("not-an-email");
    await page.getByRole("button", { name: "Send Enquiry" }).click();

    await expect(
      page.getByText("Please enter a valid email address")
    ).toBeVisible();
  });

  test("accepts valid input without client errors", async ({ page }) => {
    await page.getByLabel(/^Name/).fill("John Doe");
    await page.getByLabel(/^Email/).fill("john@example.com");
    await page.getByLabel(/Enquiry Type/).selectOption("other");
    await page
      .getByLabel(/^Message/)
      .fill(
        "This is a test enquiry message that should be long enough to pass validation."
      );

    // Just verify the form doesn't show client-side validation errors
    await page.getByRole("button", { name: "Send Enquiry" }).click();

    // Should not show client-side validation errors
    await expect(
      page.getByText("Name must be at least 2 characters")
    ).not.toBeVisible();
    await expect(
      page.getByText("Please enter a valid email address")
    ).not.toBeVisible();
  });
});
