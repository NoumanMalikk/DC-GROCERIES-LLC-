"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Package, Phone, Truck } from "lucide-react";
import { storeConfig } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

interface OrderSuccessClientProps {
  order: {
    reference: string;
    status: string;
    customer: { firstName: string; lastName: string; email: string };
    shippingAddress: {
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    items: Array<{
      title: string;
      sku: string;
      quantity: number;
      lineTotal: string;
    }>;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    estimatedDelivery?: { min: number; max: number } | null;
    demoMode: boolean;
  };
}

export function OrderSuccessClient({ order }: OrderSuccessClientProps) {
  const clearCart = useCartStore((s) => s.clearCart);
  const reducedMotion = useReducedMotion();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    clearCart();
  }, [clearCart]);

  const SuccessIcon = reducedMotion ? "div" : motion.div;

  return (
    <Container size="narrow" className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Order confirmed" },
        ]}
        className="mb-6"
      />

      <div className="text-center">
        <SuccessIcon
          {...(!reducedMotion && {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { type: "spring", stiffness: 200, damping: 18 },
          })}
          className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-garden-green/15"
        >
          <CheckCircle className="size-8 text-garden-green" aria-hidden="true" />
        </SuccessIcon>

        <SectionHeading
          as="h1"
          title="Thank you for your order"
          description={`A confirmation has been sent to ${order.customer.email}.`}
          className="mb-2"
        />
      </div>

      <div className="mt-8 rounded-xl border border-border-sand bg-fresh-white p-6 shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-soft-graphite">
          Order reference
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold text-garden-green">
          {order.reference}
        </p>
        <p className="mt-2 text-sm text-soft-graphite">
          Save this reference to track your order.
        </p>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 size-5 text-garden-green" />
            <div>
              <h2 className="font-semibold text-market-ink">Items ordered</h2>
              <ul className="mt-2 space-y-2" role="list">
                {order.items.map((item) => (
                  <li
                    key={`${item.sku}-${item.quantity}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.title} × {item.quantity}
                      <span className="block text-xs text-soft-graphite">
                        SKU {item.sku}
                      </span>
                    </span>
                    <span className="tabular-nums">{item.lineTotal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-5 text-garden-green" />
            <div>
              <h2 className="font-semibold text-market-ink">Shipping to</h2>
              <p className="mt-1 text-sm text-soft-graphite">
                {order.customer.firstName} {order.customer.lastName}
                <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && (
                  <>
                    <br />
                    {order.shippingAddress.line2}
                  </>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              {order.estimatedDelivery && (
                <p className="mt-2 text-xs text-soft-graphite">
                  Estimated delivery: {order.estimatedDelivery.min}-
                  {order.estimatedDelivery.max} business days
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-soft-graphite">Subtotal</span>
            <span>{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-soft-graphite">Shipping</span>
            <span>{order.shipping}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-soft-graphite">Tax</span>
            <span>{order.tax}</span>
          </div>
          <div className="flex justify-between font-semibold text-market-ink">
            <span>Total paid</span>
            <span>{order.total}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border-sand bg-oat-cream/50 p-5">
        <h2 className="font-semibold text-market-ink">Track your order</h2>
        <p className="mt-1 text-sm text-soft-graphite">
          Use your order reference and email on our track order page anytime.
        </p>
        <Link
          href="/track-order"
          className={cn(buttonVariants({ variant: "outline", size: "md" }), "mt-4")}
        >
          Track order
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3 text-sm text-soft-graphite">
        <Phone className="size-4 text-garden-green" />
        <span>
          Questions? Call{" "}
          <a
            href={`tel:${storeConfig.phoneE164}`}
            className="font-medium text-garden-green hover:underline"
          >
            {storeConfig.phoneDisplay}
          </a>
        </span>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          Continue shopping
        </Link>
      </div>
    </Container>
  );
}
