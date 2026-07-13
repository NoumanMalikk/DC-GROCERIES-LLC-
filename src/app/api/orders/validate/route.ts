import { NextResponse } from "next/server";
import { validateAndResolveCart } from "@/lib/cart-server";
import { getClientIp } from "@/lib/request";
import { rateLimitCheckout } from "@/lib/rate-limit";
import { safeParseCartValidateRequestInput } from "@/lib/validation";
import {
  canShipRefrigeratedItems,
  isFragileProduceHandlingConfigured,
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

  const parsed = safeParseCartValidateRequestInput(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid cart data.",
        errors: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 422 }
    );
  }

  const validated = validateAndResolveCart(parsed.data.cart);

  const shippingWarnings: Array<{ code: string; message: string }> = [];

  if (
    (validated.hasRefrigerated || validated.hasFrozen) &&
    !canShipRefrigeratedItems()
  ) {
    shippingWarnings.push({
      code: "refrigerated_not_supported",
      message:
        "Your cart includes refrigerated items that cannot be shipped with current fulfilment settings.",
    });
  }

  if (validated.hasFreshProduce && !isFragileProduceHandlingConfigured()) {
    shippingWarnings.push({
      code: "fragile_produce",
      message:
        "Your cart includes fresh produce. Special handling may be required - contact us if you have questions.",
    });
  }

  return NextResponse.json({
    success: validated.valid,
    valid: validated.valid,
    errors: validated.errors,
    items: validated.items,
    subtotalCents: validated.subtotalCents,
    totalWeightLb: validated.totalWeightLb,
    hasRefrigerated: validated.hasRefrigerated,
    hasFrozen: validated.hasFrozen,
    hasFreshProduce: validated.hasFreshProduce,
    hasWeightBased: validated.hasWeightBased,
    storeMode: validated.storeMode,
    shippingWarnings,
  });
}
