import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import { canShipRefrigeratedItems } from "@data/shipping-rules";
import {
  canPurchaseProduct,
  validateCartForCheckout,
} from "@/lib/production-readiness";

describe("refrigerated eligibility", () => {
  const refrigeratedProducts = products.filter(
    (p) => p.temperatureClass === "refrigerated",
  );

  it("lists all refrigerated SKUs in the catalog", () => {
    expect(refrigeratedProducts.length).toBeGreaterThanOrEqual(6);
    expect(
      refrigeratedProducts.some((p) => p.slug === "grade-a-large-white-eggs-12-count"),
    ).toBe(true);
    expect(
      refrigeratedProducts.some((p) => p.slug === "whole-milk-1-gallon"),
    ).toBe(true);
  });

  it("blocks refrigerated products when cold-chain shipping is disabled", () => {
    expect(canShipRefrigeratedItems()).toBe(false);

    for (const product of refrigeratedProducts) {
      const { allowed, reasons } = canPurchaseProduct(product, "demo");
      expect(allowed).toBe(false);
      expect(reasons.some((r) => r.code === "refrigerated_not_supported")).toBe(
        true,
      );
    }
  });

  it("allows ambient products in demo mode despite verification_required status", () => {
    const apples = products.find((p) => p.slug === "gala-apples-3lb-bag")!;
    const { allowed } = canPurchaseProduct(apples, "demo");
    expect(allowed).toBe(true);
  });

  it("flags refrigerated items in cart validation", () => {
    const milk = products.find((p) => p.slug === "whole-milk-1-gallon")!;
    const result = validateCartForCheckout(
      [{ productId: milk.id, quantity: 1, addedAt: new Date().toISOString() }],
      products,
      "demo",
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("refrigerated_not_supported");
  });
});
