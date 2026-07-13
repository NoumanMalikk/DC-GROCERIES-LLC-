"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
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

  const isUnavailable =
    product.availabilityStatus === "out_of_stock" ||
    product.availabilityStatus === "verification_required";

  const handleClick = () => {
    addItem(product.id, quantity);
    setCartDrawerOpen(true);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isUnavailable}
      className={cn(fullWidth && "w-full", className)}
      aria-label={`Add ${product.title} to cart`}
    >
      {showIcon && <ShoppingCart />}
      Add to cart
    </Button>
  );
}
