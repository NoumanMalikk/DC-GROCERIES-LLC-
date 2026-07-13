"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({
  productId,
  className,
  size = "md",
}: WishlistButtonProps) {
  const hasItem = useWishlistStore((s) => s.hasItem(productId));
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "icon"}
      onClick={() => toggleItem(productId)}
      className={cn(
        "text-soft-graphite hover:text-tomato-red",
        hasItem && "text-tomato-red",
        className,
      )}
      aria-label={hasItem ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={hasItem}
    >
      <Heart className={cn("size-4", hasItem && "fill-current")} />
    </Button>
  );
}
