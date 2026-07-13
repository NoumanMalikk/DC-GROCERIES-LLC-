import type { Product } from "@/types/product";
import { storeConfig } from "@data/store-config";
import { getProductMainImage, getProductPrice } from "@/lib/format";

const AVAILABILITY_MAP: Record<
  Product["availabilityStatus"],
  string
> = {
  in_stock: "https://schema.org/InStock",
  limited: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
  verification_required: "https://schema.org/PreOrder",
};

export interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const { src } = getProductMainImage(product);
  const price = getProductPrice(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    sku: product.sku,
    image: `${storeConfig.siteUrl}${src}`,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${storeConfig.siteUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: price.toFixed(2),
      availability: AVAILABILITY_MAP[product.availabilityStatus],
      seller: {
        "@type": "Organization",
        name: storeConfig.legalName,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
