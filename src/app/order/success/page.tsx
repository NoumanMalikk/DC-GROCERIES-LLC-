import type { Metadata } from "next";
import Link from "next/link";
import { storeConfig } from "@data/store-config";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { OrderSuccessClient } from "@/components/order/OrderSuccessClient";
import {
  getOrderByReference,
  getOrderBySessionId,
  updateOrder,
} from "@/lib/orders/store";
import { tryGetStripeServer } from "@/lib/stripe/server";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

function sanitizeOrderForSuccess(order: Order) {
  return {
    reference: order.reference,
    status: order.status,
    customer: {
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
    },
    shippingAddress: order.shippingAddress,
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
    estimatedDelivery: order.estimatedDelivery,
    demoMode: order.demoMode,
  };
}

async function verifyAndFulfillOrder(
  sessionId: string
): Promise<Order | null> {
  const stripe = tryGetStripeServer();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return null;
  }

  let order =
    (await getOrderBySessionId(sessionId)) ??
    (session.metadata?.orderReference
      ? await getOrderByReference(session.metadata.orderReference)
      : null);

  if (!order) return null;

  if (order.status !== "paid") {
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    order =
      (await updateOrder(order.reference, {
        status: "paid",
        stripeSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        totalCents: session.amount_total ?? order.totalCents,
      })) ?? order;
  }

  return order;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <Container size="narrow" className="py-12">
        <SectionHeading
          as="h1"
          title="Order not found"
          description="No payment session was provided. If you completed a payment, check your email for your order reference."
        />
        <Link
          href="/track-order"
          className={buttonVariants({ variant: "primary", size: "md", className: "mt-6" })}
        >
          Track an order
        </Link>
      </Container>
    );
  }

  let order: Order | null = null;

  try {
    order = await verifyAndFulfillOrder(sessionId);
  } catch (error) {
    console.error("[order/success] Session verification failed:", error);
  }

  if (!order || order.status !== "paid") {
    return (
      <Container size="narrow" className="py-12">
        <SectionHeading
          as="h1"
          title="Payment verification pending"
          description="We could not verify your payment yet. If you were charged, your confirmation email will arrive shortly. You can also track your order once processing completes."
        />
        <p className="mt-4 text-sm text-soft-graphite">
          Need help? Call{" "}
          <a
            href={`tel:${storeConfig.phoneE164}`}
            className="text-garden-green hover:underline"
          >
            {storeConfig.phoneDisplay}
          </a>
        </p>
        <Link
          href="/track-order"
          className={buttonVariants({ variant: "outline", size: "md", className: "mt-6" })}
        >
          Track order
        </Link>
      </Container>
    );
  }

  return <OrderSuccessClient order={sanitizeOrderForSuccess(order)} />;
}
