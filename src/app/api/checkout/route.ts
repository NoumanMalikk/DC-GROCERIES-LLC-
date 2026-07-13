import { NextResponse } from "next/server";
import { hasUnresolvedLegalPlaceholders } from "@data/legal-config";
import { calculateDemoShipping } from "@data/shipping-rules";
import { isDemoMode, isLiveMode, storeConfig } from "@data/store-config";
import { validateAndResolveCart } from "@/lib/cart-server";
import { calculateTaxEstimate } from "@/lib/tax";
import { validateEnv } from "@/lib/env";
import {
  createOrderDraft,
  generateOrderReference,
} from "@/lib/orders";
import {
  getIdempotentCheckout,
  saveIdempotentCheckout,
  saveOrder,
} from "@/lib/orders/store";
import { getClientIp } from "@/lib/request";
import { rateLimitCheckout } from "@/lib/rate-limit";
import { createCheckoutSession, tryGetStripeServer } from "@/lib/stripe/server";
import { safeParseCheckoutRequestInput } from "@/lib/validation";
import {
  canShipRefrigeratedItems,
} from "@data/shipping-rules";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = rateLimitCheckout(ip);

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = safeParseCheckoutRequestInput(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please review your checkout details.",
        errors: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (isLiveMode() && hasUnresolvedLegalPlaceholders()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Checkout is temporarily unavailable while legal policies are being finalized. Please call us to place your order.",
        code: "legal_placeholders",
      },
      { status: 503 }
    );
  }

  const validated = validateAndResolveCart(data.cart);

  if (!validated.valid) {
    return NextResponse.json(
      {
        success: false,
        message: "Some items in your cart cannot be purchased.",
        errors: validated.errors,
      },
      { status: 422 }
    );
  }

  if (
    (validated.hasRefrigerated || validated.hasFrozen) &&
    !canShipRefrigeratedItems()
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Your cart includes refrigerated items that cannot be shipped with current fulfilment settings.",
        code: "refrigerated_not_supported",
      },
      { status: 422 }
    );
  }

  const shippingQuote = calculateDemoShipping(
    validated.totalWeightLb,
    {
      state: data.shippingAddress.state,
      postalCode: data.shippingAddress.postalCode,
      country: data.shippingAddress.country,
    },
    validated.subtotalCents
  );

  const tax = calculateTaxEstimate(
    validated.subtotalCents,
    data.shippingAddress.state
  );

  const stripe = tryGetStripeServer();
  if (!stripe) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment to enable checkout.",
        code: "stripe_not_configured",
        demoMode: isDemoMode(),
      },
      { status: 503 }
    );
  }

  if (data.idempotencyKey) {
    const existing = await getIdempotentCheckout(data.idempotencyKey);
    if (existing) {
      return NextResponse.json({
        success: true,
        sessionId: existing.sessionId,
        url: existing.url,
        orderReference: existing.orderReference,
        idempotent: true,
      });
    }
  }

  const orderReference = generateOrderReference();
  const billingAddress = data.billingSameAsShipping
    ? data.shippingAddress
    : data.billingAddress!;

  const lineItems = validated.items.map((item) => ({
    productId: item.productId,
    sku: item.sku,
    title: item.title,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    lineTotalCents: item.lineTotalCents,
  }));

  const order = createOrderDraft({
    customer: {
      email: data.customer.email,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      phone: data.customer.phone,
    },
    shippingAddress: data.shippingAddress,
    billingAddress,
    items: lineItems,
    subtotalCents: validated.subtotalCents,
    shippingCents: shippingQuote.shippingCents,
    taxCents: tax.taxCents,
    demoMode: isDemoMode(),
  });

  order.reference = orderReference;
  order.id = orderReference;
  order.marketingConsent = data.marketingConsent ?? false;
  order.deliveryInstructions = data.deliveryInstructions ?? null;
  order.orderNotes = data.orderNotes ?? null;
  order.shippingZone = shippingQuote.zone;
  order.estimatedDelivery = shippingQuote.estimatedBusinessDays;
  if (data.idempotencyKey) {
    order.idempotencyKey = data.idempotencyKey;
  }

  const env = validateEnv();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? storeConfig.siteUrl;

  const stripeLineItems = [
    ...validated.items.map((item) => ({
      name: item.title,
      description: `${item.packageSize} · SKU ${item.sku}`,
      unitAmountCents: item.unitPriceCents,
      quantity: item.quantity,
    })),
    ...(shippingQuote.shippingCents > 0
      ? [
          {
            name: "Standard shipping",
            description: shippingQuote.note,
            unitAmountCents: shippingQuote.shippingCents,
            quantity: 1,
          },
        ]
      : []),
    ...(tax.taxCents > 0
      ? [
          {
            name: "Estimated tax",
            description: tax.note,
            unitAmountCents: tax.taxCents,
            quantity: 1,
          },
        ]
      : []),
  ];

  const cartSnapshot = JSON.stringify(
    validated.items.map((item) => ({
      productId: item.productId,
      sku: item.sku,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    }))
  );

  const session = await createCheckoutSession({
    lineItems: stripeLineItems,
    customerEmail: data.customer.email,
    orderReference,
    successUrl: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/checkout`,
    metadata: {
      orderReference,
      cartSnapshot,
      customerName: `${data.customer.firstName} ${data.customer.lastName}`,
      shippingState: data.shippingAddress.state,
      demoMode: String(isDemoMode()),
    },
    idempotencyKey: data.idempotencyKey ?? undefined,
  });

  if (!session.url) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create checkout session. Please try again.",
      },
      { status: 500 }
    );
  }

  order.stripeSessionId = session.id;
  order.totalCents =
    validated.subtotalCents + shippingQuote.shippingCents + tax.taxCents;

  await saveOrder(order);

  if (data.idempotencyKey) {
    await saveIdempotentCheckout(data.idempotencyKey, {
      sessionId: session.id,
      orderReference,
      url: session.url,
    });
  }

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    url: session.url,
    orderReference,
  });
}
