"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBasket, Trash2 } from "lucide-react";
import { products, getProductsByCollection } from "@/lib/products";
import { useCartStore } from "@/store/cart";
import { calculateLineTotal, calculateSubtotal, getUnitPriceLabel } from "@/lib/cart-math";
import { formatPrice, getProductMainImage } from "@/lib/format";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const categoryTabs = [
  {
    id: "produce",
    label: "Produce",
    productIds: getProductsByCollection("fresh-produce")
      .slice(0, 6)
      .map((p) => p.id),
  },
  {
    id: "pantry",
    label: "Pantry",
    productIds: getProductsByCollection("pantry").slice(0, 6).map((p) => p.id),
  },
  {
    id: "breakfast",
    label: "Breakfast",
    productIds: getProductsByCollection("breakfast")
      .slice(0, 6)
      .map((p) => p.id),
  },
  {
    id: "beverages",
    label: "Beverages",
    productIds: getProductsByCollection("beverages")
      .slice(0, 4)
      .map((p) => p.id),
  },
  {
    id: "household",
    label: "Household",
    productIds: getProductsByCollection("household")
      .slice(0, 4)
      .map((p) => p.id),
  },
] as const;

export function BasketBuilder() {
  const [activeTab, setActiveTab] = useState<(typeof categoryTabs)[number]["id"]>(
    "produce",
  );

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const activeCategory = categoryTabs.find((t) => t.id === activeTab)!;
  const browseProducts = activeCategory.productIds
    .map((id) => productMap.get(id))
    .filter(Boolean);

  const cartLines = items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        item,
        product,
        lineTotal: calculateLineTotal({ product, quantity: item.quantity }),
      };
    })
    .filter(Boolean);

  const subtotal = calculateSubtotal(
    cartLines.map((line) => ({
      product: line!.product,
      quantity: line!.item.quantity,
    })),
  );

  return (
    <section className="bg-produce-mist py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Build your basket"
          description="Add items from produce, pantry, breakfast, beverages and household—quantities update in real time."
          className="mb-8"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div
              className="mb-4 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Product categories"
            >
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                    activeTab === tab.id
                      ? "border-market-ink bg-market-ink text-fresh-white"
                      : "border-border-sand bg-fresh-white text-market-ink hover:bg-oat-cream",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list">
              {browseProducts.map((product) => {
                if (!product) return null;
                const { src, alt } = getProductMainImage(product);
                const inCart = items.find((i) => i.productId === product.id);

                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => addItem(product.id, 1)}
                      disabled={
                        product.availabilityStatus === "out_of_stock" ||
                        product.temperatureClass === "refrigerated"
                      }
                      className="group flex w-full flex-col items-center gap-2 rounded-xl border border-border-sand bg-fresh-white p-3 text-left shadow-sm transition-shadow hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="relative size-16">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <span className="line-clamp-2 text-center text-xs font-medium text-market-ink">
                        {product.title}
                      </span>
                      {inCart && (
                        <span className="text-[10px] font-semibold text-garden-green">
                          {inCart.quantity} in basket
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-sand bg-fresh-white p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBasket className="size-5 text-market-ink" />
              <h3 className="font-heading text-lg font-semibold text-market-ink">
                Your basket
              </h3>
              <span className="ml-auto text-sm text-soft-graphite">
                {cartLines.length} {cartLines.length === 1 ? "item" : "items"}
              </span>
            </div>

            {cartLines.length === 0 ? (
              <p className="py-8 text-center text-sm text-soft-graphite">
                Tap products above to start building your basket.
              </p>
            ) : (
              <ul className="max-h-[320px] space-y-4 overflow-y-auto pr-1" role="list">
                {cartLines.map((line) => {
                  if (!line) return null;
                  const { product, item, lineTotal } = line;
                  const { src, alt } = getProductMainImage(product);

                  return (
                    <li
                      key={product.id}
                      className="flex gap-3 border-b border-border-sand/60 pb-4 last:border-0"
                    >
                      <div className="relative size-14 shrink-0 rounded-lg bg-produce-mist">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-market-ink">
                          {product.title}
                        </p>
                        <p className="text-xs text-soft-graphite">
                          {getUnitPriceLabel(product)}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(qty) => updateQuantity(product.id, qty)}
                            size="sm"
                            min={0}
                            aria-label={`Quantity for ${product.title}`}
                          />
                          <span className="text-sm font-semibold tabular-nums text-market-ink">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.title}`}
                        className="shrink-0 text-soft-graphite hover:text-tomato-red"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border-sand pt-4">
              <span className="text-sm font-medium text-soft-graphite">
                Subtotal
              </span>
              <span className="font-heading text-xl font-semibold tabular-nums text-market-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            {cartLines.length > 0 && (
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="mt-4 w-full"
                onClick={() => setCartDrawerOpen(true)}
              >
                Review basket
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
