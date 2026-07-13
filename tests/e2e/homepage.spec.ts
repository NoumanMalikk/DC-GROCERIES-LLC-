import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with brand and main content", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "DC Groceries" }),
    ).toBeVisible();
    await expect(page.getByText("Demo mode")).toHaveCount(0);
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("shows editorial hero and category sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /main navigation/i }).getByRole("button", { name: "Shop" }),
    ).toBeVisible();
  });
});
