import { describe, expect, it } from "vitest";
import {
  addressSchema,
  checkoutSchema,
  newsletterSchema,
  safeParseCheckoutInput,
  safeParseContactInput,
  safeParseNewsletterInput,
} from "@/lib/validation";

const validAddress = {
  line1: "60 Nowell Dr",
  city: "Fairburn",
  state: "GA",
  postalCode: "30213",
  country: "United States",
};

describe("form validation", () => {
  it("accepts a complete checkout payload", () => {
    const result = safeParseCheckoutInput({
      customer: {
        email: "shopper@example.com",
        firstName: "Deresha",
        lastName: "Cash",
        phone: "+13317314338",
      },
      shippingAddress: validAddress,
      billingSameAsShipping: true,
      acceptTerms: true,
    });
    expect(result.success).toBe(true);
  });

  it("requires billing address when not same as shipping", () => {
    const result = safeParseCheckoutInput({
      customer: {
        email: "shopper@example.com",
        firstName: "Deresha",
        lastName: "Cash",
      },
      shippingAddress: validAddress,
      billingSameAsShipping: false,
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
  });

  it("validates US state and ZIP formats", () => {
    expect(
      addressSchema.safeParse({ ...validAddress, state: "Georgia" }).success,
    ).toBe(false);
    expect(
      addressSchema.safeParse({ ...validAddress, postalCode: "3021" }).success,
    ).toBe(false);
  });

  it("validates contact form order references", () => {
    const valid = safeParseContactInput({
      name: "Customer",
      email: "shopper@example.com",
      message: "Question about my recent order placement.",
      orderReference: "DCG-ABC123DEF456",
    });
    expect(valid.success).toBe(true);

    const invalid = safeParseContactInput({
      name: "Customer",
      email: "shopper@example.com",
      message: "Question about my recent order placement.",
      orderReference: "ORDER-123",
    });
    expect(invalid.success).toBe(false);
  });

  it("requires newsletter consent", () => {
    expect(
      newsletterSchema.safeParse({
        email: "shopper@example.com",
        consent: true,
      }).success,
    ).toBe(true);
    expect(
      safeParseNewsletterInput({
        email: "shopper@example.com",
        consent: false,
      }).success,
    ).toBe(false);
  });

  it("requires terms acceptance at checkout", () => {
    const result = checkoutSchema.safeParse({
      customer: {
        email: "shopper@example.com",
        firstName: "Deresha",
        lastName: "Cash",
      },
      shippingAddress: validAddress,
      billingSameAsShipping: true,
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
  });
});
