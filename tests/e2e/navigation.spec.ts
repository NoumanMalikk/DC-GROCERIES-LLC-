import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header links reach shop and utility pages", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: /shop all products/i })).toBeVisible();

    await page.goto("/about");
    await expect(page).toHaveURL(/\/about/);

    await page.goto("/contact");
    await expect(page).toHaveURL(/\/contact/);
  });

  test("footer exposes legal and food-information links", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: /privacy policy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /terms and conditions/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: "FAQ" })).toBeVisible();
  });

  test("collection navigation works from footer categories", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Fresh Produce" })
      .click();
    await expect(page).toHaveURL(/\/collections\/fresh-produce/);
  });
});
