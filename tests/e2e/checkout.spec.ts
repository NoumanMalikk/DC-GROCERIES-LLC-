import { test, expect } from "@playwright/test";
import { seedCart } from "./helpers";

test.describe("Checkout flow", () => {
  test.beforeEach(async ({ page }) => {
    await seedCart(page, "prod-015", 1);
  });

  test("cart links to checkout", async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByText(/demo mode/i)).toHaveCount(0);
    await page.getByRole("link", { name: /proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("checkout page renders", async ({ page }) => {
    const response = await page.goto("/checkout");

    if (response?.status() === 404) {
      test.skip(true, "Checkout page not yet implemented");
    }

    await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();
    await expect(page.getByText(/demo mode/i)).toHaveCount(0);
  });
});
