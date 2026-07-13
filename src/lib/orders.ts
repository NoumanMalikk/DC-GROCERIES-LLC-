import { customAlphabet } from "nanoid";
import type { CartItem } from "@/types/product";

const ORDER_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const generateOrderId = customAlphabet(ORDER_ALPHABET, 12);

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

export interface OrderLineItem {
  productId: string;
  sku: string;
  title: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress | null;
  items: OrderLineItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: "USD";
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  idempotencyKey?: string | null;
  marketingConsent?: boolean;
  deliveryInstructions?: string | null;
  orderNotes?: string | null;
  shippingZone?: string | null;
  estimatedDelivery?: { min: number; max: number } | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  demoMode: boolean;
}

export interface CreateOrderInput {
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress | null;
  items: OrderLineItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents?: number;
  demoMode?: boolean;
}

/** Generates a non-guessable order reference prefixed for readability. */
export function generateOrderReference(): string {
  return `DCG-${generateOrderId()}`;
}

export function createOrderDraft(input: CreateOrderInput): Order {
  const now = new Date().toISOString();
  const taxCents = input.taxCents ?? 0;
  const totalCents = input.subtotalCents + input.shippingCents + taxCents;
  const reference = generateOrderReference();

  return {
    id: reference,
    reference,
    status: "pending_payment",
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress ?? null,
    items: input.items,
    subtotalCents: input.subtotalCents,
    shippingCents: input.shippingCents,
    taxCents,
    totalCents,
    currency: "USD",
    createdAt: now,
    updatedAt: now,
    stripePaymentIntentId: null,
    trackingNumber: null,
    trackingUrl: null,
    demoMode: input.demoMode ?? true,
  };
}

export function cartItemsToOrderLineItems(
  cartItems: CartItem[],
  resolveProduct: (productId: string) => {
    sku: string;
    title: string;
    unitPriceCents: number;
  } | null
): OrderLineItem[] {
  return cartItems
    .filter((item) => item.quantity > 0)
    .map((item) => {
      const product = resolveProduct(item.productId);
      if (!product) {
        throw new Error(`Unknown product in cart: ${item.productId}`);
      }

      const lineTotalCents = product.unitPriceCents * item.quantity;

      return {
        productId: item.productId,
        sku: product.sku,
        title: product.title,
        quantity: item.quantity,
        unitPriceCents: product.unitPriceCents,
        lineTotalCents,
      };
    });
}

export function isValidOrderReference(reference: string): boolean {
  return /^DCG-[0-9A-Z]{12}$/.test(reference);
}
