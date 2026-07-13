"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { getProductById } from "../../../data/products";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { EmptyState } from "@/components/shared/EmptyState";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatPrice, getProductMainImage, getProductPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

export function CartDrawer() {
  const cartDrawerOpen = useUIStore((s) => s.cartDrawerOpen);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + getProductPrice(product) * item.quantity;
  }, 0);

  return (
    <Drawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <DrawerContent side="right" className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Your cart</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="size-5" />}
              title="Your cart is empty"
              description="Browse our collections and add items to get started."
              action={
                <Link
                  href="/collections/fresh-produce"
                  className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                  onClick={() => setCartDrawerOpen(false)}
                >
                  Shop produce
                </Link>
              }
            />
          ) : (
            <ul className="space-y-4" role="list">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                const { src, alt } = getProductMainImage(product);

                return (
                  <li
                    key={item.productId}
                    className="flex gap-3 rounded-lg border border-border-sand p-3"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative size-16 shrink-0 overflow-hidden rounded-md bg-produce-mist"
                      onClick={() => setCartDrawerOpen(false)}
                    >
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="line-clamp-2 text-sm font-semibold text-market-ink hover:text-garden-green"
                          onClick={() => setCartDrawerOpen(false)}
                        >
                          {product.title}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${product.title} from cart`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-soft-graphite">
                        {product.packageSize}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) =>
                            updateQuantity(item.productId, qty)
                          }
                          size="sm"
                          aria-label={`Quantity for ${product.title}`}
                        />
                        <PriceDisplay
                          amount={getProductPrice(product) * item.quantity}
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft-graphite">Subtotal</span>
              <span className="font-semibold tabular-nums text-market-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full",
                )}
                onClick={() => setCartDrawerOpen(false)}
              >
                Proceed to checkout
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-soft-graphite"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
