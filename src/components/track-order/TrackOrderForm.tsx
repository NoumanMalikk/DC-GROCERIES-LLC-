"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, Search } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { storeConfig } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { trackOrderSchema, type TrackOrderInput } from "@/lib/validation";

interface TrackedOrder {
  reference: string;
  status: string;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string };
  shippingAddress: {
    city: string;
    state: string;
    postalCode: string;
    country: string;
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
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  estimatedDelivery?: { min: number; max: number } | null;
  demoMode: boolean;
}

const statusLabels: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid - processing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function TrackOrderForm() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderInput>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { email: "", orderReference: "" },
  });

  const onSubmit = async (data: TrackOrderInput) => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setNotFound(true);
        return;
      }

      setOrder(result.order);
    } catch {
      setError("Unable to look up your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="narrow" className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Track order" },
        ]}
        className="mb-6"
      />

      <SectionHeading
        as="h1"
        title="Track your order"
        description="Enter your order reference and the email used at checkout."
        className="mb-8"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-border-sand bg-fresh-white p-5 shadow-card"
        noValidate
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="orderReference" required>
              Order reference
            </Label>
            <Controller
              name="orderReference"
              control={control}
              render={({ field }) => (
                <Input
                  id="orderReference"
                  placeholder="DCG-XXXXXXXXXXXX"
                  className="font-mono"
                  error={Boolean(errors.orderReference)}
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            {errors.orderReference && (
              <p className="mt-1 text-xs text-tomato-red">
                {errors.orderReference.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="track-email" required>
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="track-email"
                  type="email"
                  autoComplete="email"
                  error={Boolean(errors.email)}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-tomato-red">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-tomato-red" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="mt-6 w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Looking up order…
            </>
          ) : (
            <>
              <Search />
              Track order
            </>
          )}
        </Button>
      </form>

      {notFound && (
        <EmptyState
          icon={<Package className="size-5" />}
          title="Order not found"
          description="We could not find an order matching that reference and email. Double-check your details or contact us for help."
          className="mt-8"
          action={
            <a
              href={`tel:${storeConfig.phoneE164}`}
              className="text-sm font-medium text-garden-green hover:underline"
            >
              Call {storeConfig.phoneDisplay}
            </a>
          }
        />
      )}

      {order && (
        <div className="mt-8 rounded-xl border border-border-sand bg-fresh-white p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-soft-graphite">
                Order reference
              </p>
              <p className="font-mono text-xl font-semibold text-garden-green">
                {order.reference}
              </p>
            </div>
            <span className="rounded-full bg-garden-green/15 px-3 py-1 text-xs font-medium text-garden-green">
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-soft-graphite">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
          </p>

          <Separator className="my-6" />

          <h2 className="font-semibold text-market-ink">Items</h2>
          <ul className="mt-3 space-y-2" role="list">
            {order.items.map((item) => (
              <li
                key={`${item.sku}-${item.quantity}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="tabular-nums">{item.lineTotal}</span>
              </li>
            ))}
          </ul>

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
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-6 rounded-md bg-oat-cream/50 p-4">
              <p className="text-sm font-medium text-market-ink">Tracking</p>
              {order.trackingUrl ? (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-garden-green hover:underline"
                >
                  {order.trackingNumber}
                </a>
              ) : (
                <p className="mt-1 font-mono text-sm">{order.trackingNumber}</p>
              )}
            </div>
          )}

          {order.estimatedDelivery && order.status === "paid" && (
            <p className="mt-4 text-sm text-soft-graphite">
              Estimated delivery: {order.estimatedDelivery.min}-
              {order.estimatedDelivery.max} business days to{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          )}

          <p className="mt-6 text-sm text-soft-graphite">
            Questions?{" "}
            <Link href="/contact" className="text-garden-green hover:underline">
              Contact us
            </Link>{" "}
            or call{" "}
            <a
              href={`tel:${storeConfig.phoneE164}`}
              className="text-garden-green hover:underline"
            >
              {storeConfig.phoneDisplay}
            </a>
          </p>
        </div>
      )}
    </Container>
  );
}
