import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import {
  calculateLineTotal,
  estimateWeightBasedPrice,
} from "@/lib/cart-math";

describe("estimateWeightBasedPrice", () => {
  const bananas = products.find((p) => p.slug === "cavendish-bananas-2lb-bunch")!;
  const broccoli = products.find(
    (p) => p.slug === "fresh-broccoli-crowns-1-5lb",
  )!;

  it("scales price proportionally to fulfilled weight", () => {
    expect(estimateWeightBasedPrice(bananas, 2)).toBe(1.79);
    expect(estimateWeightBasedPrice(bananas, 3)).toBe(2.69);
  });

  it("uses estimated weight when fulfilled weight is omitted", () => {
    expect(estimateWeightBasedPrice(broccoli)).toBe(3.99);
  });

  it("calculates line totals for weight-based cart lines", () => {
    expect(
      calculateLineTotal({
        product: bananas,
        quantity: 2,
        fulfilledWeightLb: 2,
      }),
    ).toBe(3.58);
  });

  it("identifies all weight-based products in the catalog", () => {
    const weightBased = products.filter((p) => p.isWeightBased);
    expect(weightBased).toHaveLength(2);
    expect(weightBased.map((p) => p.slug)).toEqual([
      "cavendish-bananas-2lb-bunch",
      "fresh-broccoli-crowns-1-5lb",
    ]);
  });
});
