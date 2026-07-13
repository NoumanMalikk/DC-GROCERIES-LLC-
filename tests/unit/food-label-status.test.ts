import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import { imageCredits } from "@data/image-credits";

describe("food and label verification status", () => {
  it("all catalog products start with pending label verification", () => {
    for (const product of products) {
      expect(product.labelVerificationStatus).toBe("pending");
    }
  });

  it("all catalog products use missing image verification status", () => {
    for (const product of products) {
      expect(product.imageVerificationStatus).toBe("missing");
    }
  });

  it("placeholder images are used until exact photography is verified", () => {
    for (const product of products) {
      const primary = product.imageGallery[0];
      expect(primary.type).toBe("placeholder");
      expect(primary.src).toBe("/products/placeholder.svg");
      expect(primary.alt).toContain("Exact product image required");
    }
  });

  it("nutrition facts remain pending across the catalog", () => {
    for (const product of products) {
      expect(product.nutritionFacts.calories).toBeNull();
      expect(product.nutritionFacts.note).toContain("review the physical product label");
    }
  });

  it("image credit records exist for every SKU", () => {
    expect(imageCredits).toHaveLength(26);
    const skuSet = new Set(products.map((p) => p.sku));
    for (const record of imageCredits) {
      expect(skuSet.has(record.sku)).toBe(true);
      expect(record.productionStatus).toBe("blocked");
    }
  });
});
