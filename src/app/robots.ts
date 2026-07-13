import type { MetadataRoute } from "next";
import { storeConfig } from "@data/store-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = storeConfig.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/order/success",
        "/api/",
        "/wishlist",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
