import type { Product } from "@/types/product";
import { formatPrice, getProductPrice } from "@/lib/format";
import { isDemoMode } from "../../../data/store-config";
import { cn } from "@/lib/utils";

export interface PriceDisplayProps {
  product?: Product;
  amount?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDemoLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl font-semibold",
};

export function PriceDisplay({
  product,
  amount,
  currency = "USD",
  size = "md",
  showDemoLabel = true,
  className,
}: PriceDisplayProps) {
  const price = amount ?? (product ? getProductPrice(product) : 0);
  const isDemo = isDemoMode() || (product && product.unitPrice === null);

  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span
        className={cn(
          "font-semibold tabular-nums text-market-ink",
          sizeClasses[size],
        )}
      >
        {formatPrice(price, currency)}
      </span>
      {showDemoLabel && isDemo && (
        <span className="text-xs font-medium text-soft-graphite">demo</span>
      )}
    </span>
  );
}
