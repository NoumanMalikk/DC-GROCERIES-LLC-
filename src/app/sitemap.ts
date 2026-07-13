import type { MetadataRoute } from "next";
import { collections } from "@data/collections";
import { products } from "@data/products";
import { storeConfig } from "@data/store-config";

const STATIC_ROUTES = [
  "/",
  "/shop",
  "/search",
  "/about",
  "/contact",
  "/food-information",
  "/product-allergen-information",
  "/storage-handling",
  "/shipping-policy",
  "/return-refund-policy",
  "/privacy-policy",
  "/terms-conditions",
  "/accessibility",
  "/faq",
  "/track-order",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = storeConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
