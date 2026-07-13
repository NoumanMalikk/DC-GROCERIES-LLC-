"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { isDemoMode } from "@data/store-config";
import { cn } from "@/lib/utils";

export interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "primary" | "secondary" | "outline" | "citrus";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "primary",
  size = "md",
  showIcon = true,
  className,
  fullWidth = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.availabilityStatus === "out_of_stock";
  const isLiveBlocked =
    !isDemoMode() &&
    (!product.productionReady ||
      product.availabilityStatus === "verification_required");

  const disabled = isOutOfStock || isLiveBlocked;

  const handleClick = () => {
    if (disabled) return;
    addItem(product.id, quantity);
    setCartDrawerOpen(true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Button
      type="button"
      variant={justAdded ? "secondary" : variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn(fullWidth && "w-full", className)}
      aria-label={`Add ${product.title} to cart`}
    >
      {justAdded ? <Check /> : showIcon ? <ShoppingCart /> : null}
      {justAdded ? "Added" : "Add to cart"}
    </Button>
  );
}
