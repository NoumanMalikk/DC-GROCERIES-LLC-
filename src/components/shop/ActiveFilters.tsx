"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopFilterFacets, ShopFilterState } from "@/lib/shop-filters";
import { getActiveFilterChips } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

export interface ActiveFiltersProps {
  filters: ShopFilterState;
  facets: ShopFilterFacets;
  onRemove: (key: keyof ShopFilterState) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilters({
  filters,
  facets,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  const chips = getActiveFilterChips(filters, facets);

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-soft-graphite">
        Active filters
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => {
            if (chip.key === "minPrice") {
              onRemove("minPrice");
              onRemove("maxPrice");
              return;
            }
            onRemove(chip.key as keyof ShopFilterState);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border-sand bg-fresh-white px-2.5 py-1 text-xs font-medium text-market-ink transition-colors hover:border-garden-green hover:text-garden-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          {chip.label}
          <X className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove {chip.label} filter</span>
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-2 text-xs text-soft-graphite"
      >
        Clear all
      </Button>
    </div>
  );
}
