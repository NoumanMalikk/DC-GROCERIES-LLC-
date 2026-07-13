"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import { products as allProducts } from "@data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ActiveFilters } from "./ActiveFilters";
import { FilterPanel } from "./FilterPanel";
import { SortSelect } from "./SortSelect";
import {
  applyShopFilters,
  countActiveFilters,
  DEFAULT_SORT,
  getShopFilterFacets,
  parseShopFiltersFromSearchParams,
  serializeShopFiltersToSearchParams,
  type ShopFilterState,
} from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

export interface ShopCatalogProps {
  sourceProducts?: Product[];
  collectionSlug?: string;
  showQuery?: boolean;
  initialQuery?: string;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ShopCatalog({
  sourceProducts = allProducts,
  collectionSlug,
  showQuery = false,
  initialQuery,
  className,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search terms.",
}: ShopCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const baseProducts = useMemo(() => {
    if (collectionSlug) {
      return sourceProducts.filter((p) =>
        p.collectionSlugs.includes(collectionSlug),
      );
    }
    return sourceProducts;
  }, [sourceProducts, collectionSlug]);

  const facets = useMemo(
    () => getShopFilterFacets(baseProducts),
    [baseProducts],
  );

  const filters = useMemo(() => {
    const parsed = parseShopFiltersFromSearchParams(searchParams);
    return {
      ...parsed,
      q: showQuery ? (parsed.q ?? initialQuery) : undefined,
    };
  }, [searchParams, showQuery, initialQuery]);

  const filteredProducts = useMemo(() => {
    if (showQuery && !filters.q?.trim()) {
      return [];
    }
    return applyShopFilters(baseProducts, filters, collectionSlug);
  }, [baseProducts, filters, collectionSlug, showQuery]);

  const activeFilterCount = countActiveFilters(filters);

  const updateFilters = useCallback(
    (updates: Partial<ShopFilterState>) => {
      const next: ShopFilterState = {
        ...filters,
        ...updates,
      };

      const params = serializeShopFiltersToSearchParams(next, {
        includeQuery: showQuery,
      });
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [filters, pathname, router, showQuery],
  );

  const removeFilter = useCallback(
    (key: keyof ShopFilterState) => {
      if (key === "minPrice" || key === "maxPrice") {
        updateFilters({ minPrice: undefined, maxPrice: undefined });
        return;
      }
      updateFilters({ [key]: undefined });
    },
    [updateFilters],
  );

  const clearAllFilters = useCallback(() => {
    updateFilters({
      category: undefined,
      type: undefined,
      freshOrPackaged: undefined,
      brand: undefined,
      packageSize: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      refrigerated: undefined,
      shelfStable: undefined,
      productionReady: undefined,
      availability: undefined,
      sort: DEFAULT_SORT,
    });
  }, [updateFilters]);

  const toolbar = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <p className="text-sm text-soft-graphite">
        <span className="font-semibold text-market-ink">
          {filteredProducts.length}
        </span>{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
      </p>

      <div className="flex items-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
        >
          <SlidersHorizontal />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-citrus-orange px-1.5 py-0.5 text-[10px] font-bold text-fresh-white">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <SortSelect
          value={filters.sort}
          onChange={(sort) => updateFilters({ sort })}
          className="min-w-[180px]"
        />
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      <ActiveFilters
        filters={filters}
        facets={facets}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-border-sand bg-fresh-white p-5 shadow-card">
            <h2 className="mb-4 font-heading text-base font-semibold text-market-ink">
              Filters
            </h2>
            <FilterPanel
              filters={filters}
              facets={facets}
              onChange={updateFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          {toolbar}

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={4} />
          ) : (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={
                activeFilterCount > 0 ? (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DrawerContent side="left" className="max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <FilterPanel
              filters={filters}
              facets={facets}
              onChange={updateFilters}
              idPrefix="mobile-filter"
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
