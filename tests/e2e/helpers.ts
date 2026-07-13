import type { Page } from "@playwright/test";

export async function seedCart(
  page: Page,
  productId: string,
  quantity = 1,
): Promise<void> {
  await page.goto("/");
  await page.evaluate(
    ({ productId, quantity }) => {
      localStorage.setItem(
        "dc-groceries-cart",
        JSON.stringify({
          state: {
            items: [
              {
                productId,
                quantity,
                addedAt: new Date().toISOString(),
              },
            ],
          },
          version: 0,
        }),
      );
    },
    { productId, quantity },
  );
  await page.reload();
}

export async function seedWishlist(page: Page, productId: string): Promise<void> {
  await page.goto("/");
  await page.evaluate((productId) => {
    localStorage.setItem(
      "dc-groceries-wishlist",
      JSON.stringify({
        state: {
          items: [{ productId, addedAt: new Date().toISOString() }],
        },
        version: 0,
      }),
    );
  }, productId);
  await page.reload();
}
