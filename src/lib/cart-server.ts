import { products, getProductById } from "@data/products";
import { isDemoMode, isLiveMode } from "@data/store-config";
import {
  calculateLineTotal,
  calculateSubtotalCents,
  calculateUnitPrice,
} from "@/lib/cart-math";
import { getProductPrice } from "@/lib/format";
import {
  validateCartForCheckout,
  type PurchaseBlockReason,
} from "@/lib/production-readiness";
import type { CartItem, Product } from "@/types/product";
import { dollarsToCents } from "@/lib/utils";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface ValidatedCartLine {
  productId: string;
  sku: string;
  title: string;
  packageSize: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  temperatureClass: Product["temperatureClass"];
  freshOrPackaged: Product["freshOrPackaged"];
  isWeightBased: boolean;
  productionReady: boolean;
}

export interface ValidatedCart {
  valid: boolean;
  errors: PurchaseBlockReason[];
  items: ValidatedCartLine[];
  subtotalCents: number;
  totalWeightLb: number;
  hasRefrigerated: boolean;
  hasFrozen: boolean;
  hasFreshProduce: boolean;
  hasWeightBased: boolean;
  storeMode: "demo" | "live";
}

function resolveUnitPriceCents(product: Product): number {
  const dollars = isDemoMode() ? product.demoPrice : getProductPrice(product);
  if (product.isWeightBased) {
    return dollarsToCents(calculateUnitPrice(product));
  }
  return dollarsToCents(dollars);
}

function estimateLineWeightLb(product: Product, quantity: number): number {
  const perUnit =
    product.estimatedWeightLb ?? product.weight ?? 0.5;
  return perUnit * quantity;
}

export function validateAndResolveCart(
  cartItems: CartItemInput[]
): ValidatedCart {
  const storeMode = isLiveMode() ? "live" : "demo";
  const normalized: CartItem[] = cartItems
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));

  const validation = validateCartForCheckout(
    normalized,
    products,
    storeMode
  );

  const items: ValidatedCartLine[] = [];
  let totalWeightLb = 0;
  let hasRefrigerated = false;
  let hasFrozen = false;
  let hasFreshProduce = false;
  let hasWeightBased = false;

  for (const cartItem of normalized) {
    const product = getProductById(cartItem.productId);
    if (!product) continue;

    const unitPriceCents = resolveUnitPriceCents(product);
    const lineTotalDollars = calculateLineTotal({
      product,
      quantity: cartItem.quantity,
    });
    const lineTotalCents = dollarsToCents(lineTotalDollars);

    totalWeightLb += estimateLineWeightLb(product, cartItem.quantity);

    if (product.temperatureClass === "refrigerated") hasRefrigerated = true;
    if (product.temperatureClass === "frozen") hasFrozen = true;
    if (product.freshOrPackaged === "fresh") hasFreshProduce = true;
    if (product.isWeightBased) hasWeightBased = true;

    items.push({
      productId: product.id,
      sku: product.sku,
      title: product.title,
      packageSize: product.packageSize,
      quantity: cartItem.quantity,
      unitPriceCents,
      lineTotalCents,
      temperatureClass: product.temperatureClass,
      freshOrPackaged: product.freshOrPackaged,
      isWeightBased: product.isWeightBased,
      productionReady: product.productionReady,
    });
  }

  const subtotalCents = calculateSubtotalCents(
    normalized
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line))
  );

  return {
    valid: validation.valid && items.length > 0,
    errors: validation.errors,
    items,
    subtotalCents,
    totalWeightLb,
    hasRefrigerated,
    hasFrozen,
    hasFreshProduce,
    hasWeightBased,
    storeMode,
  };
}
