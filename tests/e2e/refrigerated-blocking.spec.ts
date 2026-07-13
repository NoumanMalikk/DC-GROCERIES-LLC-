import { test, expect } from "@playwright/test";
import { seedCart } from "./helpers";

test.describe("Refrigerated blocking", () => {
  test("milk PDP shows refrigerated handling badge", async ({ page }) => {
    await page.goto("/products/whole-milk-1-gallon");

    await expect(page.getByText(/refrigerated/i).first()).toBeVisible();
    await expect(page.getByText(/pending verification/i)).toBeVisible();
  });

  test("cart with refrigerated item shows handling notice", async ({ page }) => {
    await seedCart(page, "prod-022", 1);
    await page.goto("/cart");

    await expect(page.getByText(/refrigerated items/i)).toBeVisible();
    await expect(page.getByText(/temperature-controlled/i)).toBeVisible();
  });

  test("refrigerated collection highlights dairy items", async ({ page }) => {
    await page.goto("/collections/dairy-refrigerated");

    await expect(
      page.getByText(/whole milk|grade a large white eggs|greek yogurt/i).first(),
    ).toBeVisible();
  });
});
