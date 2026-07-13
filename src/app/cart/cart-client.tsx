"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Snowflake, Trash2 } from "lucide-react";
import { getProductById } from "@data/products";
import { storeConfig, isDemoMode } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Separator } from "@/components/ui/separator";
import { calculateLineTotal, calculateSubtotal } from "@/lib/cart-math";
import { formatPrice, getProductMainImage } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export default function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);

  const cartLines = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = calculateSubtotal(
    cartLines.map(({ item, product }) => ({
      product,
      quantity: item.quantity,
    })),
  );

  const hasWeightBased = cartLines.some(({ product }) => product.isWeightBased);
  const hasRefrigerated = cartLines.some(
    ({ product }) =>
      product.temperatureClass === "refrigerated" ||
      product.temperatureClass === "frozen",
  );

  const handleMoveToWishlist = (productId: string) => {
    addToWishlist(productId);
    removeItem(productId);
  };

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        className="mb-6"
      />

      <SectionHeading
        as="h1"
        title="Your cart"
        description={
          cartLines.length > 0
            ? `${cartLines.length} ${cartLines.length === 1 ? "item" : "items"} in your cart`
            : "Review items before checkout."
        }
        className="mb-8"
      />

      {isDemoMode() && cartLines.length > 0 && (
        <VerificationNotice
          message="Demo mode: cart totals use demonstration pricing. Tax and shipping are calculated at checkout."
          className="mb-6"
        />
      )}

      {cartLines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-5" />}
          title="Your cart is empty"
          description="Browse our shop and add items to get started."
          action={
            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "primary", size: "md" }))}
            >
              Shop now
            </Link>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="space-y-4" role="list">
              {cartLines.map(({ item, product }) => {
                const { src, alt } = getProductMainImage(product);
                const lineTotal = calculateLineTotal({
                  product,
                  quantity: item.quantity,
                });

                return (
                  <li
                    key={item.productId}
                    className="rounded-xl border border-border-sand bg-fresh-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-produce-mist sm:size-24"
                      >
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </Link>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${product.slug}`}
                              className="font-semibold text-market-ink hover:text-garden-green"
                            >
                              {product.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-soft-graphite">
                              {product.packageSize}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Remove ${product.title} from cart`}
                          >
                            <Trash2 />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(qty) =>
                              updateQuantity(item.productId, qty)
                            }
                            size="sm"
                            aria-label={`Quantity for ${product.title}`}
                          />
                          <PriceDisplay amount={lineTotal} size="md" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-soft-graphite"
                            onClick={() => handleMoveToWishlist(item.productId)}
                          >
                            <Heart />
                            Move to wishlist
                          </Button>
                        </div>

                        {product.isWeightBased && (
                          <p className="text-xs text-citrus-orange">
                            Weight-based: final price may vary at fulfilment.
                          </p>
                        )}
                        {(product.temperatureClass === "refrigerated" ||
                          product.temperatureClass === "frozen") && (
                          <p className="flex items-center gap-1 text-xs text-soft-graphite">
                            <Snowflake className="size-3" />
                            Requires refrigerated handling
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4 rounded-xl border border-border-sand bg-fresh-white p-5 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-market-ink">
                Order summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-soft-graphite">Subtotal</span>
                  <span className="font-semibold tabular-nums text-market-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-graphite">Shipping</span>
                  <span className="text-soft-graphite">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-graphite">Tax</span>
                  <span className="text-soft-graphite">Calculated at checkout</span>
                </div>
              </div>

              <Separator />

              <p className="text-xs text-soft-graphite">
                Shipping and pickup options depend on your delivery area.
                {!storeConfig.localDeliveryEnabled &&
                  !storeConfig.localPickupEnabled &&
                  " Contact us for fulfilment details."}
              </p>

              {hasWeightBased && (
                <VerificationNotice message="Your cart includes weight-based items. Final totals may change based on actual fulfilled weight." />
              )}

              {hasRefrigerated && (
                <VerificationNotice message="Your cart includes refrigerated items that require temperature-controlled handling." />
              )}

              <Link
                href="/checkout"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full",
                )}
              >
                Proceed to checkout
                <ArrowRight />
              </Link>

              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ variant: "outline", size: "md" }),
                  "w-full",
                )}
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
