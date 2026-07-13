import { describe, expect, it } from "vitest";
import { products } from "@data/products";
import { imageCredits } from "@data/image-credits";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("food and label verification status", () => {
  it("all catalog products start with pending label verification", () => {
    for (const product of products) {
      expect(product.labelVerificationStatus).toBe("pending");
    }
  });

  it("all catalog products keep pending image verification until inventory photos are approved", () => {
    for (const product of products) {
      expect(product.imageVerificationStatus).toBe("pending");
      expect(product.productionReady).toBe(false);
    }
  });

  it("every product has a local main.webp catalog image", () => {
    for (const product of products) {
      const primary = product.imageGallery[0];
      expect(primary.type).toBe("main");
      expect(primary.src).toBe(`/products/${product.slug}/main.webp`);
      expect(
        existsSync(join(process.cwd(), "public", "products", product.slug, "main.webp")),
      ).toBe(true);
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
    }
  });
});
