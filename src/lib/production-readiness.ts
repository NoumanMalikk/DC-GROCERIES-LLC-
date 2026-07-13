import { canShipRefrigeratedItems } from "@data/shipping-rules";
import type { CartItem, Product } from "@/types/product";

export type StoreMode = "demo" | "live";

export interface PurchaseBlockReason {
  code:
    | "not_production_ready"
    | "refrigerated_not_supported"
    | "verification_required"
    | "out_of_stock"
    | "unknown_product";
  message: string;
  productId?: string;
}

export function canPurchaseProduct(
  product: Product,
  storeMode: StoreMode = "demo"
): { allowed: boolean; reasons: PurchaseBlockReason[] } {
  const reasons: PurchaseBlockReason[] = [];

  if (storeMode === "live" && !product.productionReady) {
    reasons.push({
      code: "not_production_ready",
      message: `${product.title} is not available for purchase until inventory verification is complete.`,
      productId: product.id,
    });
  }

  if (product.availabilityStatus === "out_of_stock") {
    reasons.push({
      code: "out_of_stock",
      message: `${product.title} is currently out of stock.`,
      productId: product.id,
    });
  }

  if (
    storeMode === "live" &&
    product.availabilityStatus === "verification_required"
  ) {
    reasons.push({
      code: "verification_required",
      message: `${product.title} requires label and inventory verification before live sale.`,
      productId: product.id,
    });
  }

  if (
    product.temperatureClass === "refrigerated" &&
    !canShipRefrigeratedItems()
  ) {
    reasons.push({
      code: "refrigerated_not_supported",
      message: `${product.title} requires refrigerated fulfilment, which is not yet configured.`,
      productId: product.id,
    });
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

export interface CartValidationResult {
  valid: boolean;
  errors: PurchaseBlockReason[];
}

export function validateCartForCheckout(
  items: CartItem[],
  products: Product[],
  storeMode: StoreMode = "demo"
): CartValidationResult {
  const errors: PurchaseBlockReason[] = [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    if (item.quantity <= 0) continue;

    const product = productMap.get(item.productId);
    if (!product) {
      errors.push({
        code: "unknown_product",
        message: `A cart item references an unknown product (${item.productId}).`,
        productId: item.productId,
      });
      continue;
    }

    const { reasons } = canPurchaseProduct(product, storeMode);
    errors.push(...reasons);
  }

  const deduped = dedupeErrors(errors);

  return {
    valid: deduped.length === 0,
    errors: deduped,
  };
}

function dedupeErrors(errors: PurchaseBlockReason[]): PurchaseBlockReason[] {
  const seen = new Set<string>();
  const result: PurchaseBlockReason[] = [];

  for (const error of errors) {
    const key = `${error.code}:${error.productId ?? "global"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(error);
  }

  return result;
}

export function getProductionReadyProducts(products: Product[]): Product[] {
  return products.filter((p) => p.productionReady);
}

export function countBlockedCartItems(
  items: CartItem[],
  products: Product[],
  storeMode: StoreMode = "demo"
): number {
  const productMap = new Map(products.map((p) => [p.id, p]));
  let blocked = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      blocked += 1;
      continue;
    }
    const { allowed } = canPurchaseProduct(product, storeMode);
    if (!allowed) blocked += 1;
  }

  return blocked;
}
