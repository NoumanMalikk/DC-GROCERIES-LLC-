import type { Product } from "@/types/product";
import { isDemoMode } from "../../data/store-config";

export function formatPrice(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getProductPrice(product: Product): number {
  if (isDemoMode() || product.unitPrice === null) {
    return product.demoPrice;
  }
  return product.unitPrice;
}

export function getProductMainImage(product: Product): {
  src: string;
  alt: string;
} {
  const main =
    product.imageGallery.find((img) => img.type === "main") ??
    product.imageGallery.find((img) => img.type !== "placeholder") ??
    product.imageGallery[0];

  return {
    src: main?.src ?? "/products/placeholder.svg",
    alt: main?.alt ?? product.title,
  };
}
