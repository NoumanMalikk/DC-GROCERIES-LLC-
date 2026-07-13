"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Badge } from "@/components/ui/badge";
import { getUnitPriceLabel } from "@/lib/cart-math";
import { isDemoMode } from "@data/store-config";
import { cn } from "@/lib/utils";

const TEMP_LABELS: Record<Product["temperatureClass"], string> = {
  ambient: "Shelf-stable",
  refrigerated: "Refrigerated",
  frozen: "Frozen",
  household: "Household",
};

export interface ProductPurchasePanelProps {
  product: Product;
  className?: string;
}

export function ProductPurchasePanel({
  product,
  className,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-2">
        {product.brand && (
          <p className="text-sm font-medium text-soft-graphite">{product.brand}</p>
        )}
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-market-ink sm:text-3xl">
          {product.title}
        </h1>
        {product.variety && (
          <p className="text-sm text-soft-graphite">
            Variety: <span className="text-market-ink">{product.variety}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AvailabilityBadge status={product.availabilityStatus} />
        <Badge variant="outline">{TEMP_LABELS[product.temperatureClass]}</Badge>
        {product.productionReady ? (
          <Badge variant="success">Production-ready</Badge>
        ) : (
          <Badge variant="muted">Pending verification</Badge>
        )}
      </div>

      <div className="space-y-1">
        <PriceDisplay product={product} size="lg" />
        <p className="text-sm text-soft-graphite">
          {getUnitPriceLabel(product)}
        </p>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-soft-graphite">Package</dt>
          <dd className="font-medium text-market-ink">{product.packageSize}</dd>
        </div>
        {product.packCount !== null && (
          <div>
            <dt className="text-soft-graphite">Pack count</dt>
            <dd className="font-medium text-market-ink">{product.packCount}</dd>
          </div>
        )}
        {product.netWeight && (
          <div>
            <dt className="text-soft-graphite">Net weight</dt>
            <dd className="font-medium text-market-ink">{product.netWeight}</dd>
          </div>
        )}
        <div>
          <dt className="text-soft-graphite">Selling unit</dt>
          <dd className="font-medium text-market-ink">{product.sellingUnit}</dd>
        </div>
        <div>
          <dt className="text-soft-graphite">SKU</dt>
          <dd className="font-medium text-market-ink">{product.sku}</dd>
        </div>
      </dl>

      {product.isWeightBased && (
        <VerificationNotice message="Weight-based item: final price may vary based on actual fulfilled weight. Estimated weight is shown for demonstration." />
      )}

      {isDemoMode() && (
        <VerificationNotice message="Demo mode: price shown is for demonstration only. Availability is confirmed before fulfilment." />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          aria-label={`Quantity for ${product.title}`}
        />
        <WishlistButton productId={product.id} size="md" />
      </div>

      <AddToCartButton
        product={product}
        quantity={quantity}
        size="lg"
        fullWidth
        variant="primary"
      />
    </div>
  );
}
