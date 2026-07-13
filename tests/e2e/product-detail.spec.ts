import { test, expect } from "@playwright/test";

test.describe("Product detail", () => {
  test("renders gala apples PDP with package metadata", async ({ page }) => {
    await page.goto("/products/gala-apples-3lb-bag");

    await expect(
      page.getByRole("heading", { name: /gala apples, 3 lb bag/i }),
    ).toBeVisible();
    await expect(page.getByText("DC-FRU-001")).toBeVisible();
    await expect(page.getByText("Package size: 3 lb")).toBeVisible();
    await expect(
      page.getByText(/pending verification|verify availability/i).first(),
    ).toBeVisible();
  });

  test("shows weight-based notice on banana PDP", async ({ page }) => {
    await page.goto("/products/cavendish-bananas-2lb-bunch");

    await expect(
      page.getByText(/weight-based item/i),
    ).toBeVisible();
    await expect(page.getByText(/\$0\.90\/lb/i)).toBeVisible();
  });

  test("unknown slug returns not found", async ({ page }) => {
    const response = await page.goto("/products/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
