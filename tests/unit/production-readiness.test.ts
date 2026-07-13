import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import {
  canPurchaseProduct,
  countBlockedCartItems,
  getProductionReadyProducts,
  validateCartForCheckout,
} from "@/lib/production-readiness";

describe("production readiness", () => {
  it("catalog has exactly 26 products", () => {
    expect(products).toHaveLength(26);
  });

  it("includes fresh fruit, vegetables, herbs, pantry, refrigerated, beverages, snacks and household", () => {
    const subcategories = new Set(products.map((p) => p.subcategory));
    const categories = new Set(products.map((p) => p.category));

    expect(subcategories.has("Fresh Fruit")).toBe(true);
    expect(subcategories.has("Fresh Vegetables")).toBe(true);
    expect(subcategories.has("Herbs and Aromatics")).toBe(true);
    expect(categories.has("Pantry")).toBe(true);
    expect(categories.has("Dairy and Refrigerated")).toBe(true);
    expect(categories.has("Beverages")).toBe(true);
    expect(categories.has("Snacks")).toBe(true);
    expect(categories.has("Household Essentials")).toBe(true);
  });

  it("starts with no production-ready products", () => {
    expect(getProductionReadyProducts(products)).toHaveLength(0);
    expect(products.every((p) => p.productionReady === false)).toBe(true);
  });

  it("blocks non-ready products in live mode", () => {
    const apples = products.find((p) => p.slug === "gala-apples-3lb-bag")!;
    const { allowed, reasons } = canPurchaseProduct(apples, "live");
    expect(allowed).toBe(false);
    expect(
      reasons.some(
        (r) =>
          r.code === "not_production_ready" ||
          r.code === "verification_required",
      ),
    ).toBe(true);
  });

  it("counts blocked cart lines in live mode", () => {
    const blocked = countBlockedCartItems(
      [
        {
          productId: products[0].id,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
        {
          productId: products[20].id,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      products,
      "live",
    );
    expect(blocked).toBe(2);
  });

  it("rejects live checkout when cart contains unverified products", () => {
    const result = validateCartForCheckout(
      [
        {
          productId: products[0].id,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      products,
      "live",
    );
    expect(result.valid).toBe(false);
  });
});
