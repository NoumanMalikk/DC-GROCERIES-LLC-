"use client";

import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { ValidatedCartLine } from "@/lib/cart-server";
import type { DemoShippingQuote } from "@data/shipping-rules";
import type { TaxEstimate } from "@/lib/tax";

interface CheckoutSummaryProps {
  items: ValidatedCartLine[];
  subtotalCents: number;
  shipping?: DemoShippingQuote | null;
  tax?: TaxEstimate | null;
  className?: string;
}

export function CheckoutSummary({
  items,
  subtotalCents,
  shipping,
  tax,
  className,
}: CheckoutSummaryProps) {
  const shippingCents = shipping?.shippingCents ?? 0;
  const taxCents = tax?.taxCents ?? 0;
  const totalCents = subtotalCents + shippingCents + taxCents;

  return (
    <aside
      className={className}
      aria-label="Order summary"
    >
      <div className="rounded-xl border border-border-sand bg-fresh-white p-5 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-market-ink">
          Order summary
        </h2>

        <ul className="mt-4 space-y-3" role="list">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0 text-market-ink">
                <span className="font-medium">{item.title}</span>
                <span className="block text-xs text-soft-graphite">
                  {item.packageSize} · Qty {item.quantity}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-market-ink">
                {formatPrice(item.lineTotalCents, { cents: true })}
              </span>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-soft-graphite">Subtotal</span>
            <span className="tabular-nums text-market-ink">
              {formatPrice(subtotalCents, { cents: true })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-soft-graphite">Shipping</span>
            <span className="tabular-nums text-market-ink">
              {shipping
                ? formatPrice(shippingCents, { cents: true })
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-soft-graphite">Tax</span>
            <span className="tabular-nums text-market-ink">
              {tax
                ? formatPrice(taxCents, { cents: true })
                : "—"}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold text-market-ink">
          <span>Estimated total</span>
          <span className="tabular-nums">
            {formatPrice(totalCents, { cents: true })}
          </span>
        </div>

        {shipping?.note && (
          <p className="mt-3 text-xs text-soft-graphite">{shipping.note}</p>
        )}
        {tax?.note && (
          <p className="mt-2 text-xs text-soft-graphite">{tax.note}</p>
        )}
      </div>
    </aside>
  );
}
