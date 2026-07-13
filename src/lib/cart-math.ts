import type { Product } from "@/types/product";
import { dollarsToCents } from "@/lib/utils";

export interface LineTotalInput {
  product: Pick<Product, "demoPrice" | "isWeightBased" | "estimatedWeightLb">;
  quantity: number;
  /** Actual fulfilled weight in lb for weight-based items. Falls back to estimatedWeightLb. */
  fulfilledWeightLb?: number | null;
}

/** Calculates line total in dollars for a cart line item. */
export function calculateLineTotal({
  product,
  quantity,
  fulfilledWeightLb,
}: LineTotalInput): number {
  const qty = Math.max(0, quantity);
  if (qty === 0) return 0;

  if (product.isWeightBased) {
    const unitPrice = estimateWeightBasedPrice(product, fulfilledWeightLb);
    return unitPrice * qty;
  }

  return product.demoPrice * qty;
}

/** Calculates cart subtotal in dollars. */
export function calculateSubtotal(
  items: Array<LineTotalInput>
): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
}

/** Calculates cart subtotal in cents. */
export function calculateSubtotalCents(
  items: Array<LineTotalInput>
): number {
  return dollarsToCents(calculateSubtotal(items));
}

/**
 * Estimates price for a weight-based product using demo price per estimated lb.
 * Returns dollars.
 */
export function estimateWeightBasedPrice(
  product: Pick<Product, "demoPrice" | "estimatedWeightLb">,
  fulfilledWeightLb?: number | null
): number {
  const weightLb = fulfilledWeightLb ?? product.estimatedWeightLb;
  if (weightLb == null || weightLb <= 0) {
    return product.demoPrice;
  }

  const estimated = product.estimatedWeightLb ?? weightLb;
  if (estimated <= 0) {
    return product.demoPrice;
  }

  const pricePerLb = product.demoPrice / estimated;
  return Math.round(pricePerLb * weightLb * 100) / 100;
}

/**
 * Calculates unit price in dollars.
 * For fixed-weight items, returns demoPrice.
 * For weight-based items, returns price per lb based on estimated weight.
 */
export function calculateUnitPrice(
  product: Pick<Product, "demoPrice" | "isWeightBased" | "estimatedWeightLb">
): number {
  if (!product.isWeightBased) {
    return product.demoPrice;
  }

  const estimated = product.estimatedWeightLb;
  if (estimated == null || estimated <= 0) {
    return product.demoPrice;
  }

  return Math.round((product.demoPrice / estimated) * 100) / 100;
}

/** Returns a display label for unit pricing. */
export function getUnitPriceLabel(
  product: Pick<
    Product,
    "isWeightBased" | "sellingUnit" | "demoPrice" | "estimatedWeightLb"
  >
): string {
  if (product.isWeightBased && product.estimatedWeightLb) {
    const perLb = calculateUnitPrice(product);
    return `$${perLb.toFixed(2)}/lb (est.)`;
  }

  return `$${product.demoPrice.toFixed(2)} ${product.sellingUnit}`;
}
