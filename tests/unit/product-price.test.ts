import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { products } from "@data/products";
import type { Product } from "@/types/product";

describe("getProductPrice", () => {
  const sample = products[0];

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_STORE_MODE", "demo");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns demoPrice in demo mode", async () => {
    const { getProductPrice } = await import("@/lib/format");
    expect(getProductPrice(sample)).toBe(sample.demoPrice);
  });

  it("returns unitPrice in live mode when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_STORE_MODE", "live");
    const { getProductPrice } = await import("@/lib/format");
    const product: Product = { ...sample, unitPrice: 7.99 };
    expect(getProductPrice(product)).toBe(7.99);
  });

  it("falls back to demoPrice in live mode when unitPrice is null", async () => {
    vi.stubEnv("NEXT_PUBLIC_STORE_MODE", "live");
    const { getProductPrice } = await import("@/lib/format");
    const product: Product = { ...sample, unitPrice: null };
    expect(getProductPrice(product)).toBe(sample.demoPrice);
  });
});
