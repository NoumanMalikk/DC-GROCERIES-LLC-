import { describe, expect, it } from "vitest";
import { products } from "@data/products";

describe("pack count catalog integrity", () => {
  it("catalog has exactly 26 products", () => {
    expect(products).toHaveLength(26);
  });

  it("multi-count packs have correct packCount values", () => {
    const triColor = products.find((p) => p.slug === "tri-color-bell-peppers-3-count")!;
    const garlic = products.find((p) => p.slug === "fresh-garlic-5-bulb-pack")!;
    const eggs = products.find((p) => p.slug === "grade-a-large-white-eggs-12-count")!;
    const towels = products.find(
      (p) => p.slug === "ultra-paper-towels-6-double-rolls",
    )!;

    expect(triColor.packCount).toBe(3);
    expect(garlic.packCount).toBe(5);
    expect(eggs.packCount).toBe(12);
    expect(towels.packCount).toBe(6);
  });

  it("single-unit bags and clamshells use packCount of 1", () => {
    const singlePackSlugs = [
      "gala-apples-3lb-bag",
      "navel-oranges-4lb-bag",
      "fresh-strawberries-1lb-clamshell",
      "long-grain-white-rice-5lb",
    ];

    for (const slug of singlePackSlugs) {
      const product = products.find((p) => p.slug === slug)!;
      expect(product.packCount).toBe(1);
    }
  });

  it("bunch items may omit numeric pack count in title but still record packCount", () => {
    const cilantro = products.find((p) => p.slug === "fresh-cilantro-1-bunch")!;
    expect(cilantro.packCount).toBe(1);
    expect(cilantro.sellingUnit.toLowerCase()).toContain("bunch");
  });

  it("every product title includes size, weight or count", () => {
    const sizePattern =
      /\d+(\.\d+)?\s*(lb|oz|fl oz|count|bulb|roll|gallon)|bunch|pack/i;

    for (const product of products) {
      expect(
        sizePattern.test(product.title) ||
          sizePattern.test(product.packageSize) ||
          sizePattern.test(product.sellingUnit),
        `${product.sku} missing size/weight/count in title metadata`,
      ).toBe(true);
    }
  });
});
