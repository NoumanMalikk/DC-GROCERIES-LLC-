import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import {
  calculateLineTotal,
  calculateSubtotal,
  calculateSubtotalCents,
} from "@/lib/cart-math";

describe("cart totals", () => {
  const apples = products.find((p) => p.slug === "gala-apples-3lb-bag")!;
  const rice = products.find((p) => p.slug === "long-grain-white-rice-5lb")!;
  const bananas = products.find((p) => p.slug === "cavendish-bananas-2lb-bunch")!;

  it("sums fixed-weight line totals", () => {
    const subtotal = calculateSubtotal([
      { product: apples, quantity: 2 },
      { product: rice, quantity: 1 },
    ]);
    expect(subtotal).toBeCloseTo(18.47, 2);
  });

  it("returns zero for empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
    expect(calculateSubtotalCents([])).toBe(0);
  });

  it("ignores zero-quantity lines", () => {
    expect(calculateLineTotal({ product: apples, quantity: 0 })).toBe(0);
  });

  it("converts subtotal to cents", () => {
    const cents = calculateSubtotalCents([{ product: apples, quantity: 1 }]);
    expect(cents).toBe(549);
  });

  it("includes weight-based items in subtotal", () => {
    const subtotal = calculateSubtotal([
      { product: bananas, quantity: 1, fulfilledWeightLb: 2 },
      { product: apples, quantity: 1 },
    ]);
    expect(subtotal).toBeCloseTo(7.28, 2);
  });
});
