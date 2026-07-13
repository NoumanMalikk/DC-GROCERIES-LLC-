import { NextResponse } from "next/server";
import { isDemoMode } from "@data/store-config";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import {
  getOrderByReference,
  getOrderBySessionId,
  updateOrder,
} from "@/lib/orders/store";
import { constructWebhookEvent } from "@/lib/stripe/server";
import type { Order } from "@/lib/orders";
import type Stripe from "stripe";

export const runtime = "nodejs";

async function fulfillOrderFromSession(
  session: Stripe.Checkout.Session
): Promise<Order | null> {
  const orderReference = session.metadata?.orderReference;
  if (!orderReference) return null;

  const order =
    (await getOrderBySessionId(session.id)) ??
    (await getOrderByReference(orderReference));

  if (!order) return null;

  if (order.status === "paid") {
    return order;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const updated = await updateOrder(order.reference, {
    status: "paid",
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    totalCents: session.amount_total ?? order.totalCents,
  });

  if (updated) {
    try {
      await sendOrderConfirmationEmail(updated);
    } catch (error) {
      console.error("[webhook] Failed to send confirmation email:", error);
    }
  }

  return updated;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook verification failed.";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== "paid") {
          break;
        }

        await fulfillOrderFromSession(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderReference = paymentIntent.metadata?.orderReference;

        if (!orderReference) break;

        const order = await getOrderByReference(orderReference);
        if (!order || order.status === "paid") break;

        const updated = await updateOrder(orderReference, {
          status: "paid",
          stripePaymentIntentId: paymentIntent.id,
        });

        if (updated) {
          try {
            await sendOrderConfirmationEmail(updated);
          } catch (error) {
            console.error("[webhook] Failed to send confirmation email:", error);
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[webhook] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true, demoMode: isDemoMode() });
}
