import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const url = `${storeConfig.siteUrl}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${storeConfig.brandName}`,
      description,
      url,
      siteName: storeConfig.brandName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${storeConfig.brandName}`,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
