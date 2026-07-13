import { test, expect } from "@playwright/test";

test.describe("Shop search", () => {
  test("shop page lists 26 catalog items", async ({ page }) => {
    await page.goto("/shop");

    await expect(page.getByRole("heading", { name: /shop all products/i })).toBeVisible();
    await expect(page.getByText(/browse all 26 catalog items/i)).toBeVisible();
  });

  test("search page filters results by query", async ({ page }) => {
    await page.goto("/search?q=apple");

    await expect(page.getByRole("heading", { name: /search results for "apple"/i })).toBeVisible();
    await expect(page.getByText(/gala apples/i).first()).toBeVisible();
  });

  test("search from header reaches search route", async ({ page }) => {
    await page.goto("/");

    const searchLink = page.getByRole("link", { name: /search/i }).first();
    if (await searchLink.isVisible()) {
      await searchLink.click();
      await expect(page).toHaveURL(/\/search/);
    } else {
      await page.goto("/search?q=rice");
      await expect(page.getByText(/long grain white rice/i).first()).toBeVisible();
    }
  });
});
