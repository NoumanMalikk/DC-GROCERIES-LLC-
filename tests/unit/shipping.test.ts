import { describe, expect, it } from "vitest";
import {
  calculateDemoShipping,
  canShipRefrigeratedItems,
  shippingRules,
} from "@data/shipping-rules";

describe("demo shipping", () => {
  it("quotes local zone for Georgia", () => {
    const quote = calculateDemoShipping(5, { state: "GA", postalCode: "30213" }, 2000);
    expect(quote.zone).toBe("local");
    expect(quote.estimatedBusinessDays).toEqual(shippingRules.localBusinessDays);
  });

  it("quotes regional zone for neighboring states", () => {
    const quote = calculateDemoShipping(3, { state: "FL", postalCode: "33101" }, 0);
    expect(quote.zone).toBe("regional");
  });

  it("quotes extended zone for distant states", () => {
    const quote = calculateDemoShipping(3, { state: "CA", postalCode: "90210" }, 0);
    expect(quote.zone).toBe("extended");
  });

  it("applies weight-based surcharge", () => {
    const light = calculateDemoShipping(1, { state: "GA", postalCode: "30213" });
    const heavy = calculateDemoShipping(10, { state: "GA", postalCode: "30213" });
    expect(heavy.shippingCents).toBeGreaterThan(light.shippingCents);
  });

  it("reduces shipping above free-shipping threshold", () => {
    const below = calculateDemoShipping(5, { state: "GA", postalCode: "30213" }, 5000);
    const above = calculateDemoShipping(5, { state: "GA", postalCode: "30213" }, 8000);
    expect(above.shippingCents).toBeLessThan(below.shippingCents);
  });

  it("marks refrigerated fulfilment as not yet eligible", () => {
    expect(canShipRefrigeratedItems()).toBe(false);
    const quote = calculateDemoShipping(2, { state: "GA", postalCode: "30213" });
    expect(quote.refrigeratedEligible).toBe(false);
    expect(quote.demoMode).toBe(true);
  });
});
