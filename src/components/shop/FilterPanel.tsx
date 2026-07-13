"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ShopFilterFacets, ShopFilterState } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

export interface FilterPanelProps {
  filters: ShopFilterState;
  facets: ShopFilterFacets;
  onChange: (updates: Partial<ShopFilterState>) => void;
  className?: string;
  idPrefix?: string;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-xs font-semibold uppercase tracking-wide text-soft-graphite">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function FilterPanel({
  filters,
  facets,
  onChange,
  className,
  idPrefix = "filter",
}: FilterPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <FilterSection title="Category">
        <Select
          id={`${idPrefix}-category`}
          value={filters.category ?? ""}
          onChange={(e) =>
            onChange({ category: e.target.value || undefined })
          }
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {facets.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection title="Product type">
        <Select
          id={`${idPrefix}-type`}
          value={filters.type ?? ""}
          onChange={(e) => onChange({ type: e.target.value || undefined })}
          aria-label="Filter by product type"
        >
          <option value="">All types</option>
          {facets.subcategories.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection title="Fresh or packaged">
        <Select
          id={`${idPrefix}-fresh`}
          value={filters.freshOrPackaged ?? ""}
          onChange={(e) =>
            onChange({
              freshOrPackaged:
                e.target.value === "fresh" || e.target.value === "packaged"
                  ? e.target.value
                  : undefined,
            })
          }
          aria-label="Filter by fresh or packaged"
        >
          <option value="">All items</option>
          <option value="fresh">Fresh</option>
          <option value="packaged">Packaged</option>
        </Select>
      </FilterSection>

      {facets.brands.length > 0 && (
        <FilterSection title="Brand">
          <Select
            id={`${idPrefix}-brand`}
            value={filters.brand ?? ""}
            onChange={(e) => onChange({ brand: e.target.value || undefined })}
            aria-label="Filter by brand"
          >
            <option value="">All brands</option>
            {facets.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </FilterSection>
      )}

      <FilterSection title="Package size">
        <Select
          id={`${idPrefix}-size`}
          value={filters.packageSize ?? ""}
          onChange={(e) =>
            onChange({ packageSize: e.target.value || undefined })
          }
          aria-label="Filter by package size"
        >
          <option value="">All sizes</option>
          {facets.packageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection title="Price range">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-min-price`} className="text-xs">
              Min
            </Label>
            <Input
              id={`${idPrefix}-min-price`}
              type="number"
              min={facets.priceRange.min}
              max={facets.priceRange.max}
              step="0.01"
              placeholder={facets.priceRange.min.toFixed(2)}
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({
                  minPrice: e.target.value
                    ? Number.parseFloat(e.target.value)
                    : undefined,
                })
              }
              aria-label="Minimum price"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-max-price`} className="text-xs">
              Max
            </Label>
            <Input
              id={`${idPrefix}-max-price`}
              type="number"
              min={facets.priceRange.min}
              max={facets.priceRange.max}
              step="0.01"
              placeholder={facets.priceRange.max.toFixed(2)}
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({
                  maxPrice: e.target.value
                    ? Number.parseFloat(e.target.value)
                    : undefined,
                })
              }
              aria-label="Maximum price"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Temperature">
        <div className="space-y-2">
          <Checkbox
            id={`${idPrefix}-refrigerated`}
            label="Refrigerated"
            checked={Boolean(filters.refrigerated)}
            onChange={(e) =>
              onChange({ refrigerated: e.target.checked || undefined })
            }
          />
          <Checkbox
            id={`${idPrefix}-shelf`}
            label="Shelf-stable"
            checked={Boolean(filters.shelfStable)}
            onChange={(e) =>
              onChange({ shelfStable: e.target.checked || undefined })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="Production status">
        <Checkbox
          id={`${idPrefix}-ready`}
          label="Production-ready only"
          checked={Boolean(filters.productionReady)}
          onChange={(e) =>
            onChange({ productionReady: e.target.checked || undefined })
          }
        />
      </FilterSection>

      <FilterSection title="Availability">
        <Select
          id={`${idPrefix}-availability`}
          value={filters.availability ?? ""}
          onChange={(e) =>
            onChange({
              availability:
                e.target.value === "in_stock" ||
                e.target.value === "limited" ||
                e.target.value === "out_of_stock" ||
                e.target.value === "verification_required"
                  ? e.target.value
                  : undefined,
            })
          }
          aria-label="Filter by availability"
        >
          <option value="">All availability</option>
          <option value="in_stock">In stock</option>
          <option value="limited">Limited</option>
          <option value="out_of_stock">Out of stock</option>
          <option value="verification_required">Verify availability</option>
        </Select>
      </FilterSection>
    </div>
  );
}
