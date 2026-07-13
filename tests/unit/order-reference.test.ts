import { describe, expect, it } from "vitest";
import {
  generateOrderReference,
  isValidOrderReference,
} from "@/lib/orders";

describe("order reference", () => {
  it("generates references with DCG prefix and 12 alphanumeric characters", () => {
    const reference = generateOrderReference();
    expect(reference).toMatch(/^DCG-[0-9A-Z]{12}$/);
    expect(isValidOrderReference(reference)).toBe(true);
  });

  it("generates unique references", () => {
    const refs = new Set(Array.from({ length: 50 }, () => generateOrderReference()));
    expect(refs.size).toBe(50);
  });

  it("rejects invalid reference formats", () => {
    expect(isValidOrderReference("DCG-123")).toBe(false);
    expect(isValidOrderReference("ORDER-ABCDEFGHIJKL")).toBe(false);
    expect(isValidOrderReference("DCG-abcdefghijkl")).toBe(false);
    expect(isValidOrderReference("")).toBe(false);
  });

  it("excludes ambiguous characters from alphabet", () => {
    for (let i = 0; i < 100; i++) {
      const ref = generateOrderReference();
      expect(ref).not.toMatch(/[IO]/);
    }
  });
});
