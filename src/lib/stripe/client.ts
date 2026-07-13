import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { getPublicEnv } from "@/lib/env";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripePublishableKey(): string | null {
  return getPublicEnv().stripePublishableKey;
}

export function isStripeClientConfigured(): boolean {
  return Boolean(getStripePublishableKey());
}

/** Loads the Stripe.js client singleton. Returns null when not configured. */
export function getStripe(): Promise<Stripe | null> {
  const publishableKey = getStripePublishableKey();
  if (!publishableKey) {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

export function resetStripeClient(): void {
  stripePromise = null;
}
