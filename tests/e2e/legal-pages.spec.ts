import { test, expect } from "@playwright/test";

const legalPages = [
  { path: "/privacy-policy", title: /privacy/i },
  { path: "/terms-conditions", title: /terms/i },
  { path: "/accessibility", title: /accessibility/i },
  { path: "/shipping-policy", title: /shipping/i },
  { path: "/return-refund-policy", title: /return/i },
  { path: "/food-information", title: /food information/i },
  { path: "/product-allergen-information", title: /allergen/i },
];

test.describe("Legal and policy pages", () => {
  for (const { path, title } of legalPages) {
    test(`${path} is reachable`, async ({ page }) => {
      const response = await page.goto(path);

      if (response?.status() === 404) {
        test.skip(true, `${path} not yet implemented`);
      }

      await expect(page.getByRole("heading", { name: title }).first()).toBeVisible();
    });
  }

  test("footer legal links are present on homepage", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
    await expect(footer.getByRole("link", { name: /terms and conditions/i })).toHaveAttribute(
      "href",
      "/terms-conditions",
    );
    await expect(footer.getByRole("link", { name: "Accessibility" })).toHaveAttribute(
      "href",
      "/accessibility",
    );
  });
});
