import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetEnvCache, validateEnv, getStripeMode, isStripeConfigured } from "@/lib/env";

describe("environment validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    resetEnvCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    resetEnvCache();
    process.env = originalEnv;
  });

  it("defaults to demo store mode", () => {
    delete process.env.NEXT_PUBLIC_STORE_MODE;
    const env = validateEnv();
    expect(env.NEXT_PUBLIC_STORE_MODE).toBe("demo");
  });

  it("accepts valid optional URLs and emails", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://shop.dcgroceries.com";
    process.env.CONTACT_EMAIL = "hello@example.com";
    const env = validateEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://shop.dcgroceries.com");
    expect(env.CONTACT_EMAIL).toBe("hello@example.com");
  });

  it("rejects invalid site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
    expect(() => validateEnv()).toThrow(/Environment validation failed/);
  });

  it("detects Stripe test mode from secret key prefix", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_example";
    expect(getStripeMode()).toBe("test");
    expect(isStripeConfigured()).toBe(true);
  });

  it("reports Stripe as unconfigured when keys are absent", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    expect(isStripeConfigured()).toBe(false);
    expect(getStripeMode()).toBe("unset");
  });
});
