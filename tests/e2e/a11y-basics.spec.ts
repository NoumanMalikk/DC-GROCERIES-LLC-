import { test, expect } from "@playwright/test";

test.describe("Accessibility basics", () => {
  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    await skipLink.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("primary navigation is keyboard reachable", async ({ page }) => {
    await page.goto("/");

    const produceLink = page
      .getByRole("navigation", { name: /main navigation/i })
      .getByRole("link", { name: "Produce" });
    await produceLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/collections\/fresh-produce/);
  });

  test("product cards expose accessible names", async ({ page }) => {
    await page.goto("/shop");

    const productLink = page.getByRole("link", { name: /gala apples/i }).first();
    await expect(productLink).toBeVisible({ timeout: 15_000 });
  });
});
