import { test, expect } from "@playwright/test";
import { seedCart, seedWishlist } from "./helpers";

test.describe("Cart and wishlist", () => {
  test("wishlist page shows seeded item", async ({ page }) => {
    await seedWishlist(page, "prod-001");
    await page.goto("/wishlist");

    await expect(page.getByRole("heading", { name: "Wishlist", exact: true })).toBeVisible();
    await expect(page.getByText(/gala apples/i).first()).toBeVisible();
  });

  test("cart page shows seeded line and subtotal", async ({ page }) => {
    await seedCart(page, "prod-001", 2);
    await page.goto("/cart");

    await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
    await expect(page.getByText(/gala apples/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("$10.98").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /proceed to checkout/i })).toBeVisible();
  });

  test("wishlist toggle works from product page", async ({ page }) => {
    await page.goto("/products/gala-apples-3lb-bag");

    const wishlistButton = page
      .locator("main")
      .getByRole("button", { name: /add to wishlist/i })
      .first();
    await wishlistButton.click();
    await expect(
      page.locator("main").getByRole("button", { name: /remove from wishlist/i }).first(),
    ).toBeVisible();
  });
});
