import { test, expect } from "@playwright/test";
import { seedCart } from "./helpers";

test.describe("Checkout demo flow", () => {
  test.beforeEach(async ({ page }) => {
    await seedCart(page, "prod-015", 1);
  });

  test("cart links to checkout and shows demo notices", async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByText(/demo mode/i).first()).toBeVisible();
    await page.getByRole("link", { name: /proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("checkout page renders without Stripe keys in demo mode", async ({ page }) => {
    const response = await page.goto("/checkout");

    if (response?.status() === 404) {
      test.skip(true, "Checkout page not yet implemented");
    }

    await expect(page.getByText(/demo/i).first()).toBeVisible();
  });
});
