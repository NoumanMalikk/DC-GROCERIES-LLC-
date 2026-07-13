import { products as catalogProducts } from "@data/products";
import type { Product } from "@/types/product";

export {
  products,
  getProductBySlug,
  getProductById,
  getProductBySku,
  getFeaturedProducts,
  getProductsByCollection,
  getProductsByCategory,
  getRelatedProducts,
  getCrossSellProducts,
} from "@data/products";

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "package-size";

export interface ProductFilterOptions {
  collectionSlug?: string;
  category?: string;
  subcategory?: string;
  temperatureClass?: Product["temperatureClass"];
  freshOrPackaged?: Product["freshOrPackaged"];
  featured?: boolean;
  availabilityStatus?: Product["availabilityStatus"];
  productionReady?: boolean;
  query?: string;
  brand?: string;
  packageSize?: string;
  minPrice?: number;
  maxPrice?: number;
  refrigerated?: boolean;
  shelfStable?: boolean;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function matchesQuery(product: Product, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  const haystack = [
    product.title,
    product.shortDescription,
    product.category,
    product.subcategory,
    product.brand ?? "",
    product.variety ?? "",
    product.sku,
    product.packageSize,
    ...product.searchKeywords,
    ...product.collectionSlugs,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function parsePackageSizeWeight(product: Product): number {
  const size = product.packageSize.toLowerCase();
  const lbMatch = size.match(/([\d.]+)\s*lb/);
  if (lbMatch) return parseFloat(lbMatch[1]);

  const ozMatch = size.match(/([\d.]+)\s*oz/);
  if (ozMatch) return parseFloat(ozMatch[1]) / 16;

  const countMatch = size.match(/([\d.]+)\s*count/);
  if (countMatch) return parseFloat(countMatch[1]);

  return product.estimatedWeightLb ?? product.weight ?? 0;
}

export function searchProducts(query: string, source: Product[] = catalogProducts): Product[] {
  const q = normalizeQuery(query);
  if (!q) return [...source];
  return source.filter((product) => matchesQuery(product, q));
}

export function filterProducts(
  source: Product[] = catalogProducts,
  options: ProductFilterOptions = {}
): Product[] {
  return source.filter((product) => {
    if (
      options.collectionSlug &&
      !product.collectionSlugs.includes(options.collectionSlug)
    ) {
      return false;
    }

    if (
      options.category &&
      product.category.toLowerCase() !== options.category.toLowerCase()
    ) {
      return false;
    }

    if (
      options.subcategory &&
      product.subcategory.toLowerCase() !== options.subcategory.toLowerCase()
    ) {
      return false;
    }

    if (
      options.temperatureClass &&
      product.temperatureClass !== options.temperatureClass
    ) {
      return false;
    }

    if (
      options.freshOrPackaged &&
      product.freshOrPackaged !== options.freshOrPackaged
    ) {
      return false;
    }

    if (options.featured !== undefined && product.featured !== options.featured) {
      return false;
    }

    if (
      options.availabilityStatus &&
      product.availabilityStatus !== options.availabilityStatus
    ) {
      return false;
    }

    if (
      options.productionReady !== undefined &&
      product.productionReady !== options.productionReady
    ) {
      return false;
    }

    if (options.query && !matchesQuery(product, options.query)) {
      return false;
    }

    if (options.brand && (product.brand ?? "") !== options.brand) {
      return false;
    }

    if (options.packageSize && product.packageSize !== options.packageSize) {
      return false;
    }

    if (
      options.minPrice !== undefined &&
      product.demoPrice < options.minPrice
    ) {
      return false;
    }

    if (
      options.maxPrice !== undefined &&
      product.demoPrice > options.maxPrice
    ) {
      return false;
    }

    if (
      options.refrigerated &&
      product.temperatureClass !== "refrigerated" &&
      product.temperatureClass !== "frozen"
    ) {
      return false;
    }

    if (
      options.shelfStable &&
      product.temperatureClass !== "ambient" &&
      product.temperatureClass !== "household"
    ) {
      return false;
    }

    return true;
  });
}

export function sortProducts(
  source: Product[],
  sort: ProductSort = "featured"
): Product[] {
  const items = [...source];

  switch (sort) {
    case "featured":
      return items.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      });
    case "newest":
      return items.sort((a, b) => b.sortOrder - a.sortOrder);
    case "price-asc":
      return items.sort((a, b) => a.demoPrice - b.demoPrice);
    case "price-desc":
      return items.sort((a, b) => b.demoPrice - a.demoPrice);
    case "name-asc":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return items.sort((a, b) => b.title.localeCompare(a.title));
    case "package-size":
      return items.sort(
        (a, b) => parsePackageSizeWeight(a) - parsePackageSizeWeight(b)
      );
    default:
      return items;
  }
}

export function searchFilterAndSortProducts(
  options: ProductFilterOptions & { sort?: ProductSort } = {}
): Product[] {
  const { sort = "featured", query, ...filters } = options;
  const filtered = filterProducts(catalogProducts, { ...filters, query });
  const searched = query ? searchProducts(query, filtered) : filtered;
  return sortProducts(searched, sort);
}
