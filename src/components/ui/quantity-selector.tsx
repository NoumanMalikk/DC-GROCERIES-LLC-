"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
  "aria-label": ariaLabel = "Quantity",
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const buttonSize = size === "sm" ? "icon-sm" : "icon";
  const inputHeight = size === "sm" ? "h-8" : "h-10";

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="group"
      aria-label={ariaLabel}
    >
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const parsed = parseInt(e.target.value, 10);
          if (!Number.isNaN(parsed)) {
            onChange(Math.min(max, Math.max(min, parsed)));
          }
        }}
        className={cn(
          inputHeight,
          "w-12 rounded-md border border-border-sand bg-fresh-white text-center text-sm font-semibold text-market-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="Quantity value"
      />
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
}
