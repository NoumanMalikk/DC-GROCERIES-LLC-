"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ProductSort } from "@/lib/products";
import { DEFAULT_SORT } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "package-size", label: "Package size" },
];

export interface SortSelectProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
  className?: string;
  id?: string;
}

export function SortSelect({
  value,
  onChange,
  className,
  id = "sort-products",
}: SortSelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-soft-graphite">
        Sort by
      </Label>
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSort)}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {value === DEFAULT_SORT && (
        <span className="sr-only">Currently sorted by featured</span>
      )}
    </div>
  );
}
