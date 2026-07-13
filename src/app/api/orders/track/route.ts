import { NextResponse } from "next/server";
import { findOrderByEmailAndReference } from "@/lib/orders/store";
import { getClientIp } from "@/lib/request";
import { rateLimitTrackOrder } from "@/lib/rate-limit";
import { safeParseTrackOrderInput } from "@/lib/validation";
import { formatPrice } from "@/lib/utils";

function sanitizeOrderForClient(
  order: Awaited<ReturnType<typeof findOrderByEmailAndReference>>
) {
  if (!order) return null;

  return {
    reference: order.reference,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer: {
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
    },
    shippingAddress: {
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      postalCode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country,
    },
    items: order.items.map((item) => ({
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      lineTotal: formatPrice(item.lineTotalCents, { cents: true }),
    })),
    subtotal: formatPrice(order.subtotalCents, { cents: true }),
    shipping: formatPrice(order.shippingCents, { cents: true }),
    tax: formatPrice(order.taxCents, { cents: true }),
    total: formatPrice(order.totalCents, { cents: true }),
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    shippingZone: order.shippingZone,
    estimatedDelivery: order.estimatedDelivery,
    demoMode: order.demoMode,
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = rateLimitTrackOrder(ip);

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

  const parsed = safeParseTrackOrderInput(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter a valid order reference and email.",
        errors: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 422 }
    );
  }

  const { email, orderReference } = parsed.data;
  const order = await findOrderByEmailAndReference(email, orderReference);

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        message:
          "We could not find an order matching that reference and email. Please check your details and try again.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    order: sanitizeOrderForClient(order),
  });
}
