import Stripe from "stripe";
import { getStripeMode, isStripeConfigured, validateEnv } from "@/lib/env";

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (stripeInstance) return stripeInstance;

  const env = validateEnv();

  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Stripe server helpers are unavailable."
    );
  }

  stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-06-24.dahlia",
    typescript: true,
  });

  return stripeInstance;
}

export function tryGetStripeServer(): Stripe | null {
  if (!isStripeConfigured()) return null;
  try {
    return getStripeServer();
  } catch {
    return null;
  }
}

export interface CreatePaymentIntentInput {
  amountCents: number;
  currency?: string;
  metadata?: Record<string, string>;
  receiptEmail?: string;
  description?: string;
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeServer();
  const mode = getStripeMode();

  return stripe.paymentIntents.create({
    amount: input.amountCents,
    currency: input.currency ?? "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      storeMode: mode,
      ...input.metadata,
    },
    receipt_email: input.receiptEmail,
    description: input.description,
  });
}

export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeServer();
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export interface CheckoutLineItem {
  name: string;
  description?: string;
  unitAmountCents: number;
  quantity: number;
}

export interface CreateCheckoutSessionInput {
  lineItems: CheckoutLineItem[];
  customerEmail: string;
  orderReference: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeServer();
  const mode = getStripeMode();

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: input.lineItems.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.unitAmountCents,
        product_data: {
          name: item.name,
          description: item.description,
        },
      },
      quantity: item.quantity,
    })),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      orderReference: input.orderReference,
      storeMode: mode,
      ...input.metadata,
    },
    payment_intent_data: {
      metadata: {
        orderReference: input.orderReference,
        storeMode: mode,
        ...input.metadata,
      },
    },
  };

  const options: Stripe.RequestOptions = {};
  if (input.idempotencyKey) {
    options.idempotencyKey = input.idempotencyKey;
  }

  return stripe.checkout.sessions.create(params, options);
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeServer();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const env = validateEnv();

  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }

  const stripe = getStripeServer();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

export function resetStripeServer(): void {
  stripeInstance = null;
}
