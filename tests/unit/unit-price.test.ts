import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import {
  calculateUnitPrice,
  getUnitPriceLabel,
} from "@/lib/cart-math";

describe("calculateUnitPrice", () => {
  it("returns demoPrice for fixed-weight products", () => {
    const apples = products.find((p) => p.slug === "gala-apples-3lb-bag")!;
    expect(calculateUnitPrice(apples)).toBe(5.49);
  });

  it("returns price per lb for weight-based products", () => {
    const bananas = products.find((p) => p.slug === "cavendish-bananas-2lb-bunch")!;
    expect(calculateUnitPrice(bananas)).toBe(0.9);
  });

  it("formats unit price label for weight-based items", () => {
    const bananas = products.find((p) => p.slug === "cavendish-bananas-2lb-bunch")!;
    expect(getUnitPriceLabel(bananas)).toBe("$0.90/lb (est.)");
  });

  it("formats unit price label for fixed-weight items", () => {
    const apples = products.find((p) => p.slug === "gala-apples-3lb-bag")!;
    expect(getUnitPriceLabel(apples)).toContain("One 3 lb bag");
  });
});
