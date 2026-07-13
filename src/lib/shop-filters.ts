import { products as catalogProducts } from "@data/products";
import type { AvailabilityStatus, Product } from "@/types/product";
import {
  filterProducts,
  searchProducts,
  sortProducts,
  type ProductFilterOptions,
  type ProductSort,
} from "@/lib/products";

export interface ShopFilterState {
  category?: string;
  type?: string;
  freshOrPackaged?: Product["freshOrPackaged"];
  brand?: string;
  packageSize?: string;
  minPrice?: number;
  maxPrice?: number;
  refrigerated?: boolean;
  shelfStable?: boolean;
  productionReady?: boolean;
  availability?: AvailabilityStatus;
  sort: ProductSort;
  q?: string;
}

export interface ShopFilterFacets {
  categories: string[];
  subcategories: string[];
  brands: string[];
  packageSizes: string[];
  priceRange: { min: number; max: number };
  availabilityStatuses: AvailabilityStatus[];
}

export const DEFAULT_SORT: ProductSort = "featured";

export function getShopFilterFacets(
  source: Product[] = catalogProducts,
): ShopFilterFacets {
  const prices = source.map((p) => p.demoPrice);

  return {
    categories: [...new Set(source.map((p) => p.category))].sort(),
    subcategories: [...new Set(source.map((p) => p.subcategory))].sort(),
    brands: [
      ...new Set(
        source.map((p) => p.brand).filter((b): b is string => Boolean(b)),
      ),
    ].sort(),
    packageSizes: [...new Set(source.map((p) => p.packageSize))].sort(),
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    availabilityStatuses: [
      ...new Set(source.map((p) => p.availabilityStatus)),
    ],
  };
}

export function shopFiltersToProductOptions(
  filters: ShopFilterState,
  collectionSlug?: string,
): ProductFilterOptions {
  return {
    collectionSlug,
    category: filters.category,
    subcategory: filters.type,
    freshOrPackaged: filters.freshOrPackaged,
    brand: filters.brand,
    packageSize: filters.packageSize,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    refrigerated: filters.refrigerated,
    shelfStable: filters.shelfStable,
    productionReady: filters.productionReady,
    availabilityStatus: filters.availability,
    query: filters.q,
  };
}

export function applyShopFilters(
  source: Product[],
  filters: ShopFilterState,
  collectionSlug?: string,
): Product[] {
  const options = shopFiltersToProductOptions(filters, collectionSlug);
  const filtered = filterProducts(source, options);
  const searched = filters.q
    ? searchProducts(filters.q, filtered)
    : filtered;
  return sortProducts(searched, filters.sort);
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "1" || value === "true") return true;
  return undefined;
}

const SORT_VALUES: ProductSort[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "package-size",
];

const AVAILABILITY_VALUES: AvailabilityStatus[] = [
  "in_stock",
  "limited",
  "out_of_stock",
  "verification_required",
];

export function parseShopFiltersFromSearchParams(
  params: URLSearchParams,
): ShopFilterState {
  const sortParam = params.get("sort");
  const sort = SORT_VALUES.includes(sortParam as ProductSort)
    ? (sortParam as ProductSort)
    : DEFAULT_SORT;

  const availabilityParam = params.get("availability");
  const availability = AVAILABILITY_VALUES.includes(
    availabilityParam as AvailabilityStatus,
  )
    ? (availabilityParam as AvailabilityStatus)
    : undefined;

  const freshParam = params.get("fresh");
  const freshOrPackaged =
    freshParam === "fresh" || freshParam === "packaged"
      ? freshParam
      : undefined;

  return {
    category: params.get("category") ?? undefined,
    type: params.get("type") ?? undefined,
    freshOrPackaged,
    brand: params.get("brand") ?? undefined,
    packageSize: params.get("size") ?? undefined,
    minPrice: parseNumber(params.get("min")),
    maxPrice: parseNumber(params.get("max")),
    refrigerated: parseBoolean(params.get("refrigerated")),
    shelfStable: parseBoolean(params.get("shelf")),
    productionReady: parseBoolean(params.get("ready")),
    availability,
    sort,
    q: params.get("q") ?? undefined,
  };
}

export function serializeShopFiltersToSearchParams(
  filters: ShopFilterState,
  options: { includeQuery?: boolean } = {},
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.type) params.set("type", filters.type);
  if (filters.freshOrPackaged) params.set("fresh", filters.freshOrPackaged);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.packageSize) params.set("size", filters.packageSize);
  if (filters.minPrice !== undefined) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("max", String(filters.maxPrice));
  if (filters.refrigerated) params.set("refrigerated", "1");
  if (filters.shelfStable) params.set("shelf", "1");
  if (filters.productionReady) params.set("ready", "1");
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (options.includeQuery && filters.q) params.set("q", filters.q);

  return params;
}

export function countActiveFilters(filters: ShopFilterState): number {
  let count = 0;
  if (filters.category) count += 1;
  if (filters.type) count += 1;
  if (filters.freshOrPackaged) count += 1;
  if (filters.brand) count += 1;
  if (filters.packageSize) count += 1;
  if (filters.minPrice !== undefined) count += 1;
  if (filters.maxPrice !== undefined) count += 1;
  if (filters.refrigerated) count += 1;
  if (filters.shelfStable) count += 1;
  if (filters.productionReady) count += 1;
  if (filters.availability) count += 1;
  return count;
}

export interface ActiveFilterChip {
  key: keyof ShopFilterState | "sort";
  label: string;
  value?: string;
}

export function getActiveFilterChips(
  filters: ShopFilterState,
  facets: ShopFilterFacets,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.category) {
    chips.push({ key: "category", label: `Category: ${filters.category}` });
  }
  if (filters.type) {
    chips.push({ key: "type", label: `Type: ${filters.type}` });
  }
  if (filters.freshOrPackaged) {
    chips.push({
      key: "freshOrPackaged",
      label:
        filters.freshOrPackaged === "fresh" ? "Fresh items" : "Packaged items",
    });
  }
  if (filters.brand) {
    chips.push({ key: "brand", label: `Brand: ${filters.brand}` });
  }
  if (filters.packageSize) {
    chips.push({ key: "packageSize", label: `Size: ${filters.packageSize}` });
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ?? facets.priceRange.min;
    const max = filters.maxPrice ?? facets.priceRange.max;
    chips.push({
      key: "minPrice",
      label: `Price: $${min.toFixed(2)}–$${max.toFixed(2)}`,
    });
  }
  if (filters.refrigerated) {
    chips.push({ key: "refrigerated", label: "Refrigerated" });
  }
  if (filters.shelfStable) {
    chips.push({ key: "shelfStable", label: "Shelf-stable" });
  }
  if (filters.productionReady) {
    chips.push({ key: "productionReady", label: "Production-ready" });
  }
  if (filters.availability) {
    const labels: Record<AvailabilityStatus, string> = {
      in_stock: "In stock",
      limited: "Limited",
      out_of_stock: "Out of stock",
      verification_required: "Verify availability",
    };
    chips.push({
      key: "availability",
      label: labels[filters.availability],
    });
  }

  return chips;
}
